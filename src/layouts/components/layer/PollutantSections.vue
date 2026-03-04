<script>
import { fromUrl } from 'geotiff'
import { booleanPointInPolygon, point } from '@turf/turf'

// 陆域栅格范围（与 /file/pollutant/land/*.tif.xml 中 nativeExtBox 一致）
const LAND_RASTER_BOUNDS = [
  [27.044745, 118.023019], // southWest [lat, lng]
  [31.178078, 122.948019], // northEast [lat, lng]
]

// 大气污染物 CSV 目录下任选一个包含全部 kind_type 列的文件
// 说明：陆域图层来自 GeoTIFF 预生成栅格（专业软件/模型输出），大气为 CSV 散点 + 前端 IDW 插值，故观感会有差异
const AIR_CSV_BASE = '/file/pollutant/air'
const AIR_CSV_FILE = 'emitgrid_2022-01-01_13_with_coords.csv'

// 小于等于该值视为空数据，不参与插值
const AIR_NO_DATA_THRESHOLD = 1e-9
// 流式解析时每处理多少行让出主线程一次，避免卡顿
const LINES_PER_YIELD = 8000
// 插值最大距离（度），超过则格点视为无数据；与陆域效果一致，取较小值
const AIR_MAX_INTERP_DIST = 0.06
// 大气栅格与陆域共用同一范围，不随 CSV 全量范围外推
const AIR_RASTER_BOUNDS = {
  minLat: LAND_RASTER_BOUNDS[0][0],
  maxLat: LAND_RASTER_BOUNDS[1][0],
  minLon: LAND_RASTER_BOUNDS[0][1],
  maxLon: LAND_RASTER_BOUNDS[1][1],
}
// 陆域+海域 GeoJSON，大气在陆域和海域内均显示
const LAND_GEOJSON_URLS = [
  '/file/json/land_jiangsu.json',
  '/file/json/land_zhejiang.json',
  '/file/json/land_shanghai.json',
  '/file/json/land_fujian.json',
]
const SEA_GEOJSON_URLS = [
  '/file/json/sea_jiangsu.json',
  '/file/json/sea_zhejiang.json',
  '/file/json/sea_shanghai.json',
  '/file/json/sea_fujian.json',
]

function yieldToMain() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

/** 展平单个 GeoJSON 的 features 为 Polygon 数组 */
function flattenGeoJsonToPolygons(geojson) {
  const polygons = []
  if (!geojson?.features) {
    return polygons
  }
  for (const f of geojson.features) {
    const g = f.geometry
    if (!g) {
      continue
    }
    if (g.type === 'Polygon') {
      polygons.push(f)
    }
    else if (g.type === 'MultiPolygon') {
      for (const ring of g.coordinates) {
        polygons.push({
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: ring },
          properties: {},
        })
      }
    }
  }
  return polygons
}

/** 加载江浙沪闽陆域+海域 GeoJSON，大气在陆域与海域内均显示 */
async function loadLandAndSeaPolygons() {
  const urls = [...LAND_GEOJSON_URLS, ...SEA_GEOJSON_URLS]
  const results = await Promise.all(
    urls.map(url => fetch(url).then(r => r.json())),
  )
  const polygons = []
  for (const geojson of results) {
    polygons.push(...flattenGeoJsonToPolygons(geojson))
  }
  return polygons
}

/** 流式解析大气 CSV：按块读取、分批解析并让出主线程，避免 100MB+ 时卡死 */
async function parseAirCsvStream(url, valueColumn, onProgress) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const reader = res.body?.getReader()
  if (!reader) {
    throw new Error('Streaming not supported')
  }
  const decoder = new TextDecoder()
  let buffer = ''
  let headerParsed = false
  let latIdx = -1
  let lonIdx = -1
  let valueIdx = -1
  const points = []
  let minLat = Infinity
  let maxLat = -Infinity
  let minLon = Infinity
  let maxLon = -Infinity
  let lineCount = 0
  let lastYieldAt = 0

  while (true) {
    const { done, value } = await reader.read()
    if (value) {
      buffer += decoder.decode(value, { stream: true })
    }
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() ?? ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!headerParsed) {
        const header = line.split(',')
        latIdx = header.indexOf('Lat')
        lonIdx = header.indexOf('Lon')
        valueIdx = header.indexOf(valueColumn)
        if (latIdx < 0 || lonIdx < 0 || valueIdx < 0) {
          return { points: [], bounds: null }
        }
        headerParsed = true
        continue
      }
      const cols = line.split(',')
      const lat = Number(cols[latIdx])
      const lon = Number(cols[lonIdx])
      const v = Number(cols[valueIdx])
      if (Number.isFinite(lat) && Number.isFinite(lon) && Number.isFinite(v) && v > AIR_NO_DATA_THRESHOLD) {
        const value = v < 0 ? 0 : v
        points.push({ lat, lon, value })
        if (lat < minLat) {
          minLat = lat
        }
        if (lat > maxLat) {
          maxLat = lat
        }
        if (lon < minLon) {
          minLon = lon
        }
        if (lon > maxLon) {
          maxLon = lon
        }
      }
      lineCount++
      if (lineCount - lastYieldAt >= LINES_PER_YIELD) {
        lastYieldAt = lineCount
        onProgress?.(lineCount)
        await yieldToMain()
      }
    }
    if (done) {
      break
    }
  }

  const bounds = points.length
    ? { minLat, maxLat, minLon, maxLon }
    : null
  return { points, bounds }
}

/** 在主线程用 Worker 执行 IDW，避免插值阻塞；maxInterpDist 限制插值范围，避免外推 */
function runIdwInWorker(points, bounds, gridW = 256, gridH = 256, maxInterpDist = AIR_MAX_INTERP_DIST) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('./airRaster.worker.js', import.meta.url),
      { type: 'module' },
    )
    worker.onmessage = (e) => {
      worker.terminate()
      if (e.data.error) {
        reject(new Error(e.data.error))
      }
      else {
        resolve(e.data.grid)
      }
    }
    worker.onerror = (err) => {
      worker.terminate()
      reject(err)
    }
    worker.postMessage({ points, bounds, gridW, gridH, maxInterpDist })
  })
}

/**
 * 将栅格绘制为与陆域风格一致：绿阶、低值透明、陆域外掩膜、3x3 平滑减块状
 */
function gridToDataUrl(grid, bounds, options = {}) {
  const dataThreshold = typeof options === 'number' ? options : (options.dataThreshold ?? 1e-9)
  const landPolygons = (typeof options === 'object' && options.landPolygons) ? options.landPolygons : []
  if (!grid || grid.length === 0) {
    return null
  }
  const gridH = grid.length
  const gridW = grid[0].length
  const { minLat, maxLat, minLon, maxLon } = bounds
  const spanLon = maxLon - minLon || 1
  const spanLat = maxLat - minLat || 1
  let min = Infinity
  let max = -Infinity
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const v = grid[y][x]
      if (isFinite(v) && v > dataThreshold) {
        if (v < min) {
          min = v
        }
        if (v > max) {
          max = v
        }
      }
    }
  }
  const range = max > min ? max - min : 1
  const displayMin = min + 0.03 * range
  const displayRange = max > displayMin ? max - displayMin : 1
  const canvas = document.createElement('canvas')
  canvas.width = gridW
  canvas.height = gridH
  const ctx = canvas.getContext('2d')
  const imgData = ctx.createImageData(gridW, gridH)
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const v = grid[y][x]
      const isNoData = !isFinite(v) || v <= dataThreshold || v < displayMin
      let R = 0
      let G = 0
      let B = 0
      let alpha = 0
      if (!isNoData) {
        const t = (v - displayMin) / displayRange
        const t1 = Math.max(0, Math.min(1, t))
        R = Math.round(200 * (1 - t1))
        G = Math.round(220 - 80 * t1)
        B = Math.round(170 * (1 - t1))
        alpha = 255
      }
      const i = (y * gridW + x) * 4
      imgData.data[i] = R
      imgData.data[i + 1] = G
      imgData.data[i + 2] = B
      imgData.data[i + 3] = alpha
    }
  }
  // 陆域+海域掩膜：仅在研究区陆域与海域内显示，之外透明
  if (landPolygons.length > 0) {
    for (let y = 0; y < gridH; y++) {
      const lat = maxLat - (y + 0.5) / gridH * spanLat
      for (let x = 0; x < gridW; x++) {
        const lon = minLon + (x + 0.5) / gridW * spanLon
        const pt = point([lon, lat])
        const inside = landPolygons.some(p => booleanPointInPolygon(pt, p))
        if (!inside) {
          imgData.data[(y * gridW + x) * 4 + 3] = 0
        }
      }
    }
  }
  // 3x3 盒式模糊，减弱块状感
  const tmp = ctx.createImageData(gridW, gridH)
  tmp.data.set(imgData.data)
  const r = 1
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      let sr = 0
      let sg = 0
      let sb = 0
      let sa = 0
      let n = 0
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx >= 0 && nx < gridW && ny >= 0 && ny < gridH) {
            const i = (ny * gridW + nx) * 4
            sr += tmp.data[i]
            sg += tmp.data[i + 1]
            sb += tmp.data[i + 2]
            sa += tmp.data[i + 3]
            n++
          }
        }
      }
      const o = (y * gridW + x) * 4
      imgData.data[o] = Math.round(sr / n)
      imgData.data[o + 1] = Math.round(sg / n)
      imgData.data[o + 2] = Math.round(sb / n)
      imgData.data[o + 3] = Math.round(sa / n)
    }
  }
  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL('image/png')
}

const months = [
  { value: 1, label: '一月' },
  { value: 2, label: '二月' },
  { value: 3, label: '三月' },
  { value: 4, label: '四月' },
  { value: 5, label: '五月' },
  { value: 6, label: '六月' },
  { value: 7, label: '七月' },
  { value: 8, label: '八月' },
  { value: 9, label: '九月' },
  { value: 10, label: '十月' },
  { value: 11, label: '十一月' },
  { value: 12, label: '十二月' },
]

const kinds = [
  { value: 'NH3', label: 'NH3' },
  { value: 'NO', label: 'NO' },
  { value: 'NO2', label: 'NO2' },
]

const types = [
  { value: 'Industry', label: '工业源' },
  { value: 'Energy', label: '能源及电厂源' },
  { value: 'Domestic', label: '居民源' },
  { value: 'Traffic', label: '交通源' },
  { value: 'Agriculture', label: '农业源' },
  { value: 'Ship', label: '港口和船舶源' },
]

export default {
  data() {
    return {
      type: 'land',
      landType: 'tn',
      months,
      landMonth: 1,
      landLayer: null,
      landLoading: false,
      kinds,
      airKind: 'NH3',
      types,
      airType: 'Industry',
      airLayer: null,
      airLoading: false,
      airProgress: '', // 解析中 / 插值中，用于大文件时提示
    }
  },
  watch: {
    landType() {
      this.loadLandRaster()
    },
    landMonth() {
      this.loadLandRaster()
    },
    airKind() {
      if (this.type === 'air' && window.$zMap) {
        this.loadAirRaster()
      }
    },
    airType() {
      if (this.type === 'air' && window.$zMap) {
        this.loadAirRaster()
      }
    },
  },
  mounted() {
    if (this.type === 'land' && window.$zMap) {
      this.loadLandRaster()
    }
    if (this.type === 'air' && window.$zMap) {
      this.loadAirRaster()
    }
  },
  beforeUnmount() {
    this.removeLandLayer()
    this.removeAirLayer()
  },
  methods: {
    /** 根据 landType(tn/tp) 和 landMonth(1-12) 得到 tif 文件名 */
    getTifUrl() {
      const prefix = this.landType === 'tp' ? 'TP' : 'TN'
      return `/file/pollutant/land/${prefix}Mon${this.landMonth}_all.tif`
    },
    removeLandLayer() {
      if (this.landLayer && window.$zMap) {
        window.$zMap.removeLayer(this.landLayer)
        if (this.landLayer._urlRevoke && typeof URL.revokeObjectURL === 'function') {
          URL.revokeObjectURL(this.landLayer._urlRevoke)
        }
        this.landLayer = null
      }
    },
    /** 将 GeoTIFF 栅格数据绘制到 canvas，返回 PNG data URL */
    async renderGeoTiffToDataUrl(tifUrl) {
      const tiff = await fromUrl(tifUrl)
      const image = await tiff.getImage()
      const width = image.getWidth()
      const height = image.getHeight()
      const rasters = await image.readRasters()
      const data = rasters[0]
      const noData = -3.4028235e38
      // 小于等于该值视为无数据/背景，不参与 min/max 且绘制为透明
      const dataThreshold = 1e-6
      let min = Infinity
      let max = -Infinity
      for (let i = 0; i < data.length; i++) {
        const v = data[i]
        if (v !== noData && isFinite(v) && v > dataThreshold) {
          if (v < min) {
            min = v
          }
          if (v > max) {
            max = v
          }
        }
      }
      const range = max > min ? max - min : 1
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      const imgData = ctx.createImageData(width, height)
      for (let i = 0; i < data.length; i++) {
        const v = data[i]
        const isNoData = v === noData
          || !isFinite(v)
          || v <= dataThreshold
        let gray = 0
        let alpha = 0
        if (!isNoData) {
          gray = Math.round(((v - min) / range) * 255)
          alpha = 255
        }
        imgData.data[i * 4] = gray
        imgData.data[i * 4 + 1] = gray
        imgData.data[i * 4 + 2] = gray
        imgData.data[i * 4 + 3] = alpha
      }
      ctx.putImageData(imgData, 0, 0)
      return canvas.toDataURL('image/png')
    },
    /** 大气 CSV 路径（列名为 airKind_airType，如 NH3_Industry） */
    getAirCsvUrl() {
      return `${AIR_CSV_BASE}/${AIR_CSV_FILE}`
    },
    removeAirLayer() {
      if (this.airLayer && window.$zMap) {
        window.$zMap.removeLayer(this.airLayer)
        if (this.airLayer._urlRevoke && typeof URL.revokeObjectURL === 'function') {
          URL.revokeObjectURL(this.airLayer._urlRevoke)
        }
        this.airLayer = null
      }
    },
    /** 根据 airKind + airType 从 CSV 流式解析，Worker 插值成栅格并渲染大气图层（大文件不卡顿） */
    async loadAirRaster() {
      if (!window.$zMap || this.type !== 'air') {
        return
      }
      const valueColumn = `${this.airKind}_${this.airType}`
      const url = this.getAirCsvUrl()
      this.airLoading = true
      this.airProgress = '解析中…'
      this.removeAirLayer()
      try {
        const { points, bounds } = await parseAirCsvStream(
          url,
          valueColumn,
          () => { this.airProgress = '解析中…' },
        )
        if (!bounds || points.length === 0) {
          console.warn('PollutantSections: no air data for', valueColumn)
          return
        }
        this.airProgress = '插值中…'
        const gridBounds = AIR_RASTER_BOUNDS
        const grid = await runIdwInWorker(points, gridBounds, 512, 512)
        if (!grid) {
          return
        }
        this.airProgress = '渲染中…'
        const landAndSeaPolygons = await loadLandAndSeaPolygons()
        const dataUrl = gridToDataUrl(grid, gridBounds, { landPolygons: landAndSeaPolygons })
        if (!dataUrl) {
          return
        }
        const { minLat, maxLat, minLon, maxLon } = gridBounds
        const layerBounds = window.$ZMap.L.latLngBounds(
          window.$ZMap.L.latLng(minLat, minLon),
          window.$ZMap.L.latLng(maxLat, maxLon),
        )
        this.airLayer = new window.$ZMap.layer.ImageLayer({
          url: dataUrl,
          bounds: layerBounds,
          name: 'airPollutantRaster',
          opacity: 0.7,
          zIndex: 500,
        })
        window.$zMap.addLayer(this.airLayer)
      }
      catch (err) {
        console.warn('PollutantSections: load air raster failed', url, err)
      }
      finally {
        this.airLoading = false
        this.airProgress = ''
      }
    },
    onTypeChange() {
      if (this.type === 'land' && window.$zMap) {
        this.loadLandRaster()
      }
      else {
        this.removeLandLayer()
      }
      if (this.type === 'air' && window.$zMap) {
        this.loadAirRaster()
      }
      else {
        this.removeAirLayer()
      }
    },
    async loadLandRaster() {
      if (!window.$zMap || this.type !== 'land') {
        return
      }
      const url = this.getTifUrl()
      this.landLoading = true
      this.removeLandLayer()
      try {
        const dataUrl = await this.renderGeoTiffToDataUrl(url)
        const bounds = window.$ZMap.L.latLngBounds(
          window.$ZMap.L.latLng(LAND_RASTER_BOUNDS[0][0], LAND_RASTER_BOUNDS[0][1]),
          window.$ZMap.L.latLng(LAND_RASTER_BOUNDS[1][0], LAND_RASTER_BOUNDS[1][1]),
        )
        this.landLayer = new window.$ZMap.layer.ImageLayer({
          url: dataUrl,
          bounds,
          name: 'landPollutantRaster',
          opacity: 0.7,
          zIndex: 500,
        })
        window.$zMap.addLayer(this.landLayer)
      }
      catch (err) {
        console.warn('PollutantSections: load raster failed', url, err)
      }
      finally {
        this.landLoading = false
      }
    },
  },
}
</script>

<template>
  <div class="work-zone">
    <div class="filters">
      <div>
        <el-select v-model="type" @change="onTypeChange">
          <el-option label="陆域" value="land" />
          <el-option label="大气" value="air" />
        </el-select>
      </div>
      <div style="display: flex; margin-top: 20px;">
        <template v-if="type === 'land'">
          <el-radio-group
            v-model="landType"
            is-button
          >
            <el-radio-button label="总氮" value="tn" />
            <el-radio-button label="总磷" value="tp" />
          </el-radio-group>
          <el-select v-model="landMonth" style="margin-left: 8px;" :loading="landLoading">
            <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
        <template v-else>
          <el-select v-model="airKind" :loading="airLoading">
            <el-option v-for="item in kinds" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="airType" style="margin-left: 8px;" :loading="airLoading">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-if="airProgress" class="air-progress">{{ airProgress }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.work-zone {
  position: absolute;
  top: 0;
  left: 512px;
  width: calc(100% - 1024px);
  display: flex;

  .filters {
    pointer-events: all;
  }

  .air-progress {
    margin-left: 8px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}
</style>
