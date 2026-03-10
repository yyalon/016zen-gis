<script>
import { fromUrl } from 'geotiff'

// 陆域栅格范围（与 /file/pollutant/land/*.tif.xml 中 nativeExtBox 一致）
const LAND_RASTER_BOUNDS = [
  [27.044745, 118.023019], // southWest [lat, lng]
  [31.178078, 122.948019], // northEast [lat, lng]
]

// 大气 TIF 范围（与陆域一致：江浙沪闽，与 generate_air_raster.py 输出范围一致）
const AIR_RASTER_BOUNDS = [
  [27.044745, 118.023019], // southWest [lat, lng]
  [31.178078, 122.948019], // northEast [lat, lng]
]

// 大气 TIF 目录（仅用 TIF 加载）
const AIR_CSV_BASE = '/file/pollutant/air'

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

// 大气四季：对应 TIF 目录 Mon1(冬)/Mon4(春)/Mon7(夏)/Mon10(秋)
const seasons = [
  { value: 'Mon1', label: '冬季' },
  { value: 'Mon4', label: '春季' },
  { value: 'Mon7', label: '夏季' },
  { value: 'Mon10', label: '秋季' },
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
      seasons,
      airSeason: 'Mon4',
      airLayer: null,
      airLoading: false,
      airProgress: '',
    }
  },
  computed: {
    airMonFolder() {
      return this.airSeason
    },
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
    airSeason() {
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
    /** 双线性插值采样：用周围 4 格点加权得到平滑值，避免块状 */
    sampleBilinear(data, width, height, x, y, noData, threshold) {
      const x0 = Math.max(0, Math.min(width - 1, Math.floor(x)))
      const y0 = Math.max(0, Math.min(height - 1, Math.floor(y)))
      const x1 = Math.max(0, Math.min(width - 1, x0 + 1))
      const y1 = Math.max(0, Math.min(height - 1, y0 + 1))
      const dx = x - x0
      const dy = y - y0
      const valid = (v) => v !== noData && Number.isFinite(v) && v > threshold
      const get = (ix, iy) => data[iy * width + ix]
      const v00 = get(x0, y0)
      const v10 = get(x1, y0)
      const v01 = get(x0, y1)
      const v11 = get(x1, y1)
      let sum = 0
      let wSum = 0
      if (valid(v00)) {
        const w = (1 - dx) * (1 - dy)
        sum += v00 * w
        wSum += w
      }
      if (valid(v10)) {
        const w = dx * (1 - dy)
        sum += v10 * w
        wSum += w
      }
      if (valid(v01)) {
        const w = (1 - dx) * dy
        sum += v01 * w
        wSum += w
      }
      if (valid(v11)) {
        const w = dx * dy
        sum += v11 * w
        wSum += w
      }
      return wSum > 0 ? { v: sum / wSum, hasData: true } : { v: 0, hasData: false }
    },
    /** 将 GeoTIFF 栅格数据绘制到 canvas，返回 PNG data URL（灰阶）。
     * opts.renderStyle === 'dots'：每格画小圆点，与陆域风格一致
     * opts.uniformColor：有数据的格点统一用同一灰色点亮，无过渡色
     * opts.quantizeLevels：灰阶分级数（如 5），有值时无平滑过渡，仅离散几档灰
     * opts.interpolate + opts.scale：双线性插值放大，适合陆域栅格
     * opts.returnBounds：为 true 时返回 { dataUrl, bounds }，bounds 来自 TIF 的 getBoundingBox，保证叠加范围正确
     */
    async renderGeoTiffToDataUrl(tifUrl, opts = {}) {
      const tiff = await fromUrl(tifUrl)
      const image = await tiff.getImage()
      const width = image.getWidth()
      const height = image.getHeight()
      let geoBounds = null
      if (opts.returnBounds && typeof image.getBoundingBox === 'function') {
        const bbox = image.getBoundingBox()
        if (Array.isArray(bbox) && bbox.length >= 4) {
          const [west, south, east, north] = bbox
          geoBounds = [[south, west], [north, east]]
        }
      }
      const rasters = await image.readRasters()
      const data = rasters[0]
      const noData = -3.4028235e38
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
      const scale = Math.max(1, Math.min(4, Number(opts.scale) || 1))
      const outW = width * scale
      const outH = height * scale
      const canvas = document.createElement('canvas')
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')
      const useUniformColor = opts.uniformColor === true
      const uniformGray = 20
      const quantizeLevels = Math.max(0, Math.min(16, Number(opts.quantizeLevels) || 0))
      if (opts.renderStyle === 'dots' || opts.renderStyle === 'blocks') {
        ctx.clearRect(0, 0, outW, outH)
        const useBlocks = opts.renderStyle === 'blocks'
        for (let gy = 0; gy < height; gy++) {
          for (let gx = 0; gx < width; gx++) {
            const v = data[gy * width + gx]
            const valid = v !== noData && Number.isFinite(v) && v > dataThreshold
            if (!valid) {
              continue
            }
            let gray
            if (useUniformColor) {
              gray = uniformGray
            }
            else {
              const t = Math.max(0, Math.min(1, (v - min) / range))
              if (quantizeLevels > 1) {
                const level = Math.min(quantizeLevels - 1, Math.floor(t * quantizeLevels))
                gray = Math.round((level / (quantizeLevels - 1)) * 255)
              }
              else {
                gray = Math.round(t * 255)
              }
            }
            ctx.fillStyle = `rgb(${gray},${gray},${gray})`
            if (useBlocks) {
              ctx.fillRect(gx * scale, gy * scale, scale, scale)
            }
            else {
              const dotRadius = Math.max(0.5, scale * 0.55)
              const cx = gx * scale + scale / 2
              const cy = gy * scale + scale / 2
              ctx.beginPath()
              ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
        return canvas.toDataURL('image/png')
      }
      const useInterpolate = opts.interpolate !== false && scale > 1
      const imgData = ctx.createImageData(outW, outH)
      if (useInterpolate) {
        for (let j = 0; j < outH; j++) {
          for (let i = 0; i < outW; i++) {
            const x = (i + 0.5) / scale - 0.5
            const y = (j + 0.5) / scale - 0.5
            const { v, hasData } = this.sampleBilinear(data, width, height, x, y, noData, dataThreshold)
            const t1 = hasData ? Math.max(0, Math.min(1, (v - min) / range)) : 0
            const gray = Math.round(t1 * 255)
            const alpha = hasData ? 255 : 0
            const idx = (j * outW + i) * 4
            imgData.data[idx] = gray
            imgData.data[idx + 1] = gray
            imgData.data[idx + 2] = gray
            imgData.data[idx + 3] = alpha
          }
        }
        ctx.putImageData(imgData, 0, 0)
      }
      else {
        const smallCanvas = document.createElement('canvas')
        smallCanvas.width = width
        smallCanvas.height = height
        const smallCtx = smallCanvas.getContext('2d')
        const smallImg = smallCtx.createImageData(width, height)
        for (let i = 0; i < data.length; i++) {
          const v = data[i]
          const isNoData = v === noData || !isFinite(v) || v <= dataThreshold
          const t1 = isNoData ? 0 : Math.max(0, Math.min(1, (v - min) / range))
          const gray = Math.round(t1 * 255)
          const alpha = isNoData ? 0 : 255
          smallImg.data[i * 4] = gray
          smallImg.data[i * 4 + 1] = gray
          smallImg.data[i * 4 + 2] = gray
          smallImg.data[i * 4 + 3] = alpha
        }
        smallCtx.putImageData(smallImg, 0, 0)
        if (scale > 1) {
          const ctx2 = canvas.getContext('2d')
          ctx2.imageSmoothingEnabled = true
          ctx2.imageSmoothingQuality = 'high'
          ctx2.drawImage(smallCanvas, 0, 0, width, height, 0, 0, outW, outH)
        }
        else {
          ctx.putImageData(smallImg, 0, 0)
        }
      }
      const dataUrl = canvas.toDataURL('image/png')
      if (opts.returnBounds && geoBounds) {
        return { dataUrl, bounds: geoBounds }
      }
      return dataUrl
    },
    /** 大气 TIF 路径：按月份选 Mon1/Mon4/Mon7/Mon10 目录下的 {airKind}_{airType}.tif */
    getAirTifUrl() {
      return `${AIR_CSV_BASE}/${this.airMonFolder}/${this.airKind}_${this.airType}.tif`
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
    /** 大气图层：仅用 TIF 加载（与陆域一致） */
    async loadAirRaster() {
      if (!window.$zMap || this.type !== 'air') {
        return
      }
      const tifUrl = this.getAirTifUrl()
      this.airLoading = true
      this.airProgress = '加载中…'
      this.removeAirLayer()
      try {
        const result = await this.renderGeoTiffToDataUrl(tifUrl, { scale: 4, renderStyle: 'blocks', uniformColor: false, quantizeLevels: 5, returnBounds: true })
        const dataUrl = (typeof result === 'string') ? result : result.dataUrl
        const boundsArr = (typeof result === 'object' && result.bounds) ? result.bounds : AIR_RASTER_BOUNDS
        const bounds = window.$ZMap.L.latLngBounds(
          window.$ZMap.L.latLng(boundsArr[0][0], boundsArr[0][1]),
          window.$ZMap.L.latLng(boundsArr[1][0], boundsArr[1][1]),
        )
        this.airLayer = new window.$ZMap.layer.ImageLayer({
          url: dataUrl,
          bounds,
          name: 'airPollutantRaster',
          opacity: 0.7,
          zIndex: 500,
        })
        window.$zMap.addLayer(this.airLayer)
      }
      catch (err) {
        console.warn('PollutantSections: load air raster failed', tifUrl, err)
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
        const dataUrl = await this.renderGeoTiffToDataUrl(url, { scale: 3 })
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
          <el-select v-model="airSeason" style="margin-right: 8px;" :loading="airLoading">
            <el-option v-for="item in seasons" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
