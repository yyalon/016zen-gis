<script>
import { fromUrl } from 'geotiff'
import { applyBasinMaskToCanvas } from '@/utils/basinMask'

// 陆域栅格范围（与 /file/pollutant/land/*.tif.xml 中 nativeExtBox 一致）
const LAND_RASTER_BOUNDS = [
  [27.044745, 118.023019], // southWest [lat, lng]
  [31.178078, 122.948019], // northEast [lat, lng]
]

/** 与 LAND_RASTER_BOUNDS 一致，用于流域掩膜与 canvas 像素对齐 */
const LAND_RASTER_GEO_BOUNDS = {
  west: 118.023019,
  south: 27.044745,
  east: 122.948019,
  north: 31.178078,
}

// 大气 TIF 范围：仅当 GeoTIFF 无法解析 bbox 时回退（正常情况用 TIF 自身 bounds）
const AIR_RASTER_BOUNDS = [
  [27.044745, 118.023019], // southWest [lat, lng]
  [31.178078, 122.948019], // northEast [lat, lng]
]

// 大气 TIF 目录（仅用 TIF 加载）
const AIR_CSV_BASE = '/file/pollutant/air'

/** 大气物种品牌色 RGB（0–255） */
const AIR_KIND_TINT_RGB = {
  NH3: { r: 0x1A, g: 0x98, b: 0x50 },
  NO: { r: 0x6A, g: 0x51, b: 0xA3 },
  NO2: { r: 0xD7, g: 0x30, b: 0x27 },
}

/** 归一化强度 t1∈[0,1] → 不透明显色：RGB 在 45%～100% 品牌色之间（避免 R*t1 纯黑，也避免仅靠 alpha 在 ImageLayer 上不可见） */
function airTintRgbComponents(tint, t1) {
  const k = 0.45 + 0.55 * Math.max(0, Math.min(1, t1))
  return {
    r: Math.round(tint.r * k),
    g: Math.round(tint.g * k),
    b: Math.round(tint.b * k),
  }
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
      /** 控制单元 / 流域（controlUnit1.json） */
      basinSelectOptions: [],
      selectedBasinCode: '',
      controlUnitFC: null,
      basinOutlineLayer: null,
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
    selectedBasinCode() {
      this.updateBasinOutlineLayer()
      if (this.type === 'land' && window.$zMap) {
        this.loadLandRaster()
      }
      if (this.type === 'air' && window.$zMap) {
        this.loadAirRaster()
      }
    },
  },
  mounted() {
    this.loadControlUnits()
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
    this.removeBasinOutlineLayer()
  },
  methods: {
    /** 下拉显示名：仅用「名称」，不拼接「流域」（避免东南片等片区后缀）；若名称中含「·」则去掉后缀 */
    formatBasinLabel(feature, idx) {
      const p = feature.properties || {}
      const name = p['名称']
      if (name != null && String(name).trim() !== '') {
        return String(name).replace(/\s*·\s*.+$/, '').trim()
      }
      return `控制单元 ${idx + 1}`
    },
    async loadControlUnits() {
      try {
        const res = await fetch('/file/json/controlUnit1.json')
        const fc = await res.json()
        if (fc?.type !== 'FeatureCollection' || !Array.isArray(fc.features)) {
          return
        }
        this.controlUnitFC = fc
        // 使用唯一 value：JSON 中多条要素可能共用同一「编码」，若用编码作 value 会导致 el-select 多选高亮错乱
        const opts = fc.features.map((f, idx) => ({
          value: `cu:${idx}`,
          label: this.formatBasinLabel(f, idx),
        }))
        opts.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'))
        this.basinSelectOptions = [{ value: '', label: '全部流域' }, ...opts]
        // JSON 异步返回后若已选流域，补一次掩膜/高亮（避免首次 loadLandRaster 时 FC 尚未就绪）
        this.$nextTick(() => {
          if (!this.selectedBasinCode || !window.$zMap) {
            return
          }
          this.updateBasinOutlineLayer()
          if (this.type === 'land') {
            this.loadLandRaster()
          }
          if (this.type === 'air') {
            this.loadAirRaster()
          }
        })
      }
      catch (e) {
        console.warn('PollutantSections: load controlUnit1.json failed', e)
      }
    },
    getSelectedBasinGeometry() {
      if (!this.selectedBasinCode || !this.controlUnitFC?.features) {
        return null
      }
      const m = /^cu:(\d+)$/.exec(String(this.selectedBasinCode))
      if (!m) {
        return null
      }
      const idx = Number(m[1])
      return this.controlUnitFC.features[idx]?.geometry ?? null
    },
    /** GeoJSON Polygon/MultiPolygon → WGS84 外包矩形 */
    geometryLonLatBBox(geometry) {
      if (!geometry) {
        return null
      }
      let minLon = Infinity
      let minLat = Infinity
      let maxLon = -Infinity
      let maxLat = -Infinity
      const consumeRing = (ring) => {
        for (let i = 0; i < ring.length; i++) {
          const lon = ring[i][0]
          const lat = ring[i][1]
          if (lon < minLon) {
            minLon = lon
          }
          if (lon > maxLon) {
            maxLon = lon
          }
          if (lat < minLat) {
            minLat = lat
          }
          if (lat > maxLat) {
            maxLat = lat
          }
        }
      }
      const consumePolygon = (poly) => {
        for (let r = 0; r < poly.length; r++) {
          consumeRing(poly[r])
        }
      }
      if (geometry.type === 'Polygon') {
        consumePolygon(geometry.coordinates)
      }
      else if (geometry.type === 'MultiPolygon') {
        for (let p = 0; p < geometry.coordinates.length; p++) {
          consumePolygon(geometry.coordinates[p])
        }
      }
      else {
        return null
      }
      if (!Number.isFinite(minLon) || minLon === Infinity) {
        return null
      }
      return { west: minLon, south: minLat, east: maxLon, north: maxLat }
    },
    /** 地图定位到流域几何中心并缩放至可见（不依赖 GeoJsonLayer.getBounds） */
    flyToBasinGeometry(geometry) {
      const box = this.geometryLonLatBBox(geometry)
      if (!box || !window.$zMap || !window.$ZMap?.L) {
        return
      }
      const L = window.$ZMap.L
      const map = window.$zMap
      const sw = L.latLng(box.south, box.west)
      const ne = L.latLng(box.north, box.east)
      const bounds = L.latLngBounds(sw, ne)
      const center = bounds.getCenter()
      const latSpan = Math.max(0.0001, box.north - box.south)
      const lngSpan = Math.max(0.0001, box.east - box.west)
      const span = Math.max(latSpan, lngSpan)
      let zoomGuess = 9
      if (span > 8) {
        zoomGuess = 5
      }
      else if (span > 4) {
        zoomGuess = 6
      }
      else if (span > 2) {
        zoomGuess = 7
      }
      else if (span > 1) {
        zoomGuess = 8
      }
      else if (span > 0.5) {
        zoomGuess = 9
      }
      else if (span > 0.25) {
        zoomGuess = 10
      }
      else {
        zoomGuess = 11
      }
      try {
        if (typeof map.fitBounds === 'function') {
          // duration 与 WaterSections 等一致（ZMap 自定义动画时长）
          // 大气：顶部有筛选项条，加大顶部留白使高亮区域在视口内下移，避免贴顶
          const fitOpts = { duration: 5, maxZoom: 15 }
          if (this.type === 'air' && typeof L.point === 'function') {
            fitOpts.paddingTopLeft = L.point(48, 132)
            fitOpts.paddingBottomRight = L.point(48, 64)
          }
          else {
            fitOpts.padding = [56, 56]
          }
          map.fitBounds(bounds, fitOpts)
        }
        else if (typeof map.setView === 'function') {
          map.setView(center, Math.min(zoomGuess, 14))
        }
      }
      catch (e) {
        console.warn('PollutantSections: fitBounds failed', e)
        if (typeof map.setView === 'function') {
          map.setView(center, Math.min(zoomGuess, 14))
        }
      }
    },
    removeBasinOutlineLayer() {
      if (this.basinOutlineLayer && window.$zMap) {
        window.$zMap.removeLayer(this.basinOutlineLayer)
        this.basinOutlineLayer = null
      }
    },
    updateBasinOutlineLayer() {
      this.removeBasinOutlineLayer()
      if (!this.selectedBasinCode || !window.$zMap) {
        return
      }
      const geom = this.getSelectedBasinGeometry()
      if (!geom || (geom.type !== 'Polygon' && geom.type !== 'MultiPolygon')) {
        return
      }
      const fc = {
        type: 'FeatureCollection',
        features: [{ type: 'Feature', properties: {}, geometry: geom }],
      }
      const layer = new window.$ZMap.layer.GeoJsonLayer({
        zIndex: 550,
        name: 'pollutantBasinHighlight',
        symbol: {
          styleOptions: {
            width: 3,
            color: '#00ffc8',
            fillColor: '#00e5ff',
            fillOpacity: 0.18,
            outlineColor: '#00ffc8',
            outlineWidth: 3,
            opacity: 1,
          },
        },
      })
      window.$zMap.addLayer(layer)
      layer.load({ data: fc })
      layer.show = true
      this.basinOutlineLayer = layer
      // 缩放到流域在「栅格加载完成」后再做，避免与 loadLandRaster / loadAirRaster 并发导致 ImageLayer 被盖掉或未带上掩膜
    },
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
     * opts.basinGeometry + opts.rasterGeoBounds：按流域多边形裁剪栅格（与 opts.returnBounds 解析出的范围或显式 bounds 一致）
     * opts.tintRgb：{ r, g, b } 0–255，大气图层按物种着色；不传则陆域灰阶
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
      const tint = (opts.tintRgb && typeof opts.tintRgb.r === 'number') ? opts.tintRgb : null
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
            if (tint) {
              if (useUniformColor) {
                ctx.fillStyle = `rgb(${tint.r},${tint.g},${tint.b})`
              }
              else {
                const tCol = Math.max(0, Math.min(1, (v - min) / range))
                const { r, g, b } = airTintRgbComponents(tint, tCol)
                ctx.fillStyle = `rgb(${r},${g},${b})`
              }
            }
            else {
              ctx.fillStyle = `rgb(${gray},${gray},${gray})`
            }
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
            const idx = (j * outW + i) * 4
            if (tint) {
              if (hasData) {
                const { r, g, b } = airTintRgbComponents(tint, t1)
                imgData.data[idx] = r
                imgData.data[idx + 1] = g
                imgData.data[idx + 2] = b
                imgData.data[idx + 3] = 255
              }
              else {
                imgData.data[idx] = 0
                imgData.data[idx + 1] = 0
                imgData.data[idx + 2] = 0
                imgData.data[idx + 3] = 0
              }
            }
            else {
              imgData.data[idx] = gray
              imgData.data[idx + 1] = gray
              imgData.data[idx + 2] = gray
              imgData.data[idx + 3] = hasData ? 255 : 0
            }
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
          const base = i * 4
          if (tint) {
            if (isNoData) {
              smallImg.data[base] = 0
              smallImg.data[base + 1] = 0
              smallImg.data[base + 2] = 0
              smallImg.data[base + 3] = 0
            }
            else {
              const { r, g, b } = airTintRgbComponents(tint, t1)
              smallImg.data[base] = r
              smallImg.data[base + 1] = g
              smallImg.data[base + 2] = b
              smallImg.data[base + 3] = 255
            }
          }
          else {
            smallImg.data[base] = gray
            smallImg.data[base + 1] = gray
            smallImg.data[base + 2] = gray
            smallImg.data[base + 3] = isNoData ? 0 : 255
          }
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

      let maskBounds = opts.rasterGeoBounds
      if (!maskBounds && geoBounds) {
        maskBounds = {
          west: geoBounds[0][1],
          south: geoBounds[0][0],
          east: geoBounds[1][1],
          north: geoBounds[1][0],
        }
      }
      const g = opts.basinGeometry
      if (
        maskBounds
        && g
        && (g.type === 'Polygon' || g.type === 'MultiPolygon')
      ) {
        applyBasinMaskToCanvas(canvas, maskBounds, g)
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
      this._airRasterReqId = (this._airRasterReqId || 0) + 1
      const reqId = this._airRasterReqId
      const tifUrl = this.getAirTifUrl()
      this.airLoading = true
      this.airProgress = '加载中…'
      this.removeAirLayer()
      try {
        const maskGeom = this.selectedBasinCode ? this.getSelectedBasinGeometry() : null
        const airOpts = { scale: 3, returnBounds: true }
        if (maskGeom && (maskGeom.type === 'Polygon' || maskGeom.type === 'MultiPolygon')) {
          airOpts.basinGeometry = maskGeom
        }
        const kindTint = AIR_KIND_TINT_RGB[this.airKind]
        if (kindTint) {
          airOpts.tintRgb = kindTint
        }
        // 与陆域一致：双线性插值；bounds 取自 TIF；流域掩膜 bounds 在 render 内由 geoBounds 推导
        const result = await this.renderGeoTiffToDataUrl(tifUrl, airOpts)
        if (reqId !== this._airRasterReqId) {
          return
        }
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
        if (this.selectedBasinCode && reqId === this._airRasterReqId) {
          const g = this.getSelectedBasinGeometry()
          if (g) {
            this.$nextTick(() => {
              if (reqId === this._airRasterReqId) {
                this.flyToBasinGeometry(g)
              }
            })
          }
        }
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
      this.updateBasinOutlineLayer()
    },
    async loadLandRaster() {
      if (!window.$zMap || this.type !== 'land') {
        return
      }
      this._landRasterReqId = (this._landRasterReqId || 0) + 1
      const reqId = this._landRasterReqId
      const url = this.getTifUrl()
      this.landLoading = true
      this.removeLandLayer()
      try {
        const maskGeom = this.selectedBasinCode ? this.getSelectedBasinGeometry() : null
        const landOpts = { scale: 3 }
        if (maskGeom && (maskGeom.type === 'Polygon' || maskGeom.type === 'MultiPolygon')) {
          landOpts.basinGeometry = maskGeom
          landOpts.rasterGeoBounds = LAND_RASTER_GEO_BOUNDS
        }
        const dataUrl = await this.renderGeoTiffToDataUrl(url, landOpts)
        if (reqId !== this._landRasterReqId) {
          return
        }
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
        if (this.selectedBasinCode && reqId === this._landRasterReqId) {
          const g = this.getSelectedBasinGeometry()
          if (g) {
            this.$nextTick(() => {
              if (reqId === this._landRasterReqId) {
                this.flyToBasinGeometry(g)
              }
            })
          }
        }
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
        <el-select v-model="type" style="margin-right: 8px;" @change="onTypeChange">
          <el-option label="陆域" value="land" />
          <el-option label="大气" value="air" />
        </el-select>
        <el-select
          v-model="selectedBasinCode"
          filterable
          clearable
          placeholder="全部流域"
          class="basin-select"
          style="min-width: 220px;"
          @clear="selectedBasinCode = ''"
        >
          <el-option
            v-for="item in basinSelectOptions"
            :key="item.value === '' ? '_all' : item.value"
            :label="item.label"
            :value="item.value"
          />
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

  .filter-label {
    font-size: 13px;
    color: var(--el-text-color-regular);
    white-space: nowrap;
  }

  .air-progress {
    margin-left: 8px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}
</style>
