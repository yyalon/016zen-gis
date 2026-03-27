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

/**
 * 陆域 TN 总量（t）分级设色，与钱塘江流域专题图例一致（离散档、无渐变）。
 * 每档上界 inclusive：v <= max 落入该档（末档 max 为 Infinity）。
 */
const LAND_TN_CLASSES = [
  { max: 0.020, r: 30, g: 58, b: 138, label: '0 – 0.020' },
  { max: 0.080, r: 14, g: 116, b: 144, label: '0.021 – 0.080' },
  { max: 0.200, r: 34, g: 139, b: 72, label: '0.081 – 0.200' },
  { max: 0.400, r: 210, g: 175, b: 44, label: '0.201 – 0.400' },
  { max: 2.000, r: 217, g: 92, b: 24, label: '0.401 – 2.000' },
  { max: Infinity, r: 192, g: 38, b: 38, label: '2.001 – 18.660' },
]

const LAND_TN_PALETTE = LAND_TN_CLASSES.map(({ max, r, g, b }) => ({ max, r, g, b }))

/**
 * 陆域 TP 总量（t）分级设色，与钱塘江流域专题图例一致；色序与 TN 相同（蓝→红）。
 */
const LAND_TP_CLASSES = [
  { max: 0.004, r: 30, g: 58, b: 138, label: '0 – 0.004' },
  { max: 0.022, r: 14, g: 116, b: 144, label: '0.005 – 0.022' },
  { max: 0.053, r: 34, g: 139, b: 72, label: '0.023 – 0.053' },
  { max: 0.096, r: 210, g: 175, b: 44, label: '0.054 – 0.096' },
  { max: 0.296, r: 217, g: 92, b: 24, label: '0.097 – 0.296' },
  { max: Infinity, r: 192, g: 38, b: 38, label: '0.297 – 2.199' },
]

const LAND_TP_PALETTE = LAND_TP_CLASSES.map(({ max, r, g, b }) => ({ max, r, g, b }))

function landDiscreteColorForValue(v, palette) {
  for (let i = 0; i < palette.length; i++) {
    if (v <= palette[i].max) {
      return palette[i]
    }
  }
  return palette[palette.length - 1]
}

// 大气 TIF 范围：仅当 GeoTIFF 无法解析 bbox 时回退（正常情况用 TIF 自身 bounds）
const AIR_RASTER_BOUNDS = [
  [27.044745, 118.023019], // southWest [lat, lng]
  [31.178078, 122.948019], // northEast [lat, lng]
]

// 大气 TIF 目录（仅用 TIF 加载）
const AIR_CSV_BASE = '/file/pollutant/air'

/** mars2d ImageLayer 默认为 tilePane，会整体压在 GeoJsonLayer（overlayPane）之下；与陆海域同 pane 才能被 zIndex 控制叠置 */
const POLLUTANT_MAP_OVERLAY_PANE = 'overlayPane'
/**
 * 须低于 overlayPane 内常见区划/矢量（多为 zIndex≥1，如 ThreeLevelAreas 360、ControlUnit 1），且勿对栅格 bringToFront。
 */
const POLLUTANT_RASTER_Z_INDEX = 0

/** pipelines/inventory-1km 等导出的米制 Albers 与脚本 preprocess 默认一致 */
const CHINA_ALBERS_PROJ
  = '+proj=aea +lat_1=25 +lat_2=47 +lat_0=36 +lon_0=105 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'

function bboxLooksLikeWgs84Degrees(minX, minY, maxX, maxY) {
  return (
    [minX, minY, maxX, maxY].every(Number.isFinite)
    && minX >= -180
    && maxX <= 180
    && minY >= -90
    && maxY <= 90
    && maxX > minX
    && maxY > minY
  )
}

/**
 * geotiff getBoundingBox → Leaflet 用的 [[south,west],[north,east]]（WGS84 经纬度）
 */
async function geoTiffBBoxToLatLngBounds(bbox) {
  const [minX, minY, maxX, maxY] = bbox
  if (bboxLooksLikeWgs84Degrees(minX, minY, maxX, maxY)) {
    return [[minY, minX], [maxY, maxX]]
  }
  try {
    const proj4 = (await import('proj4')).default
    const corners = [
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
    ]
    const ll = corners.map(([x, y]) => proj4(CHINA_ALBERS_PROJ, 'WGS84', [x, y]))
    const lons = ll.map(c => c[0])
    const lats = ll.map(c => c[1])
    const west = Math.min(...lons)
    const east = Math.max(...lons)
    const south = Math.min(...lats)
    const north = Math.max(...lats)
    return [[south, west], [north, east]]
  }
  catch (e) {
    console.warn('PollutantSections: 投影转 WGS84 失败（需安装 proj4: pnpm install）', e)
    return [
      [AIR_RASTER_BOUNDS[0][0], AIR_RASTER_BOUNDS[0][1]],
      [AIR_RASTER_BOUNDS[1][0], AIR_RASTER_BOUNDS[1][1]],
    ]
  }
}

/** GDAL 常见 float32 空值；与 geotiff.js 读出的值对齐 */
const LEGACY_GDAL_FLOAT_NODATA = -3.4028234663852886e38

/** 与 scripts/air_inventory_1km.py normalize_loose_numeric_str 一致：引号 / 科学计数 / Unicode 减号 */
function normalizeLooseNumericString(raw) {
  let s = String(raw).trim().replace(/^\uFEFF/, '')
  while (s.length >= 2 && ((s[0] === '\'' && s[s.length - 1] === '\'') || (s[0] === '"' && s[s.length - 1] === '"'))) {
    s = s.slice(1, -1).trim()
  }
  while (s.length >= 2 && s[0] === '\'' && /[0-9+\-.]/.test(s[1])) {
    s = s.slice(1).trim()
  }
  while (s.length >= 2 && s[0] === '"' && /[0-9+\-.]/.test(s[1])) {
    s = s.slice(1).trim()
  }
  return s.replace(/\u2212/g, '-').replace(/\u2013/g, '-').trim()
}

function parseLooseFloatFromString(raw) {
  const t = normalizeLooseNumericString(raw)
  if (!t) {
    return NaN
  }
  return Number.parseFloat(t)
}

function readGeoTiffNoData(image) {
  try {
    if (typeof image.getGDALNoData === 'function') {
      const v = image.getGDALNoData()
      if (typeof v === 'number' && Number.isFinite(v)) {
        return v
      }
      if (typeof v === 'string' && v !== '') {
        const n = parseLooseFloatFromString(v)
        if (Number.isFinite(n)) {
          return n
        }
      }
    }
  }
  catch (_) { /* ignore */ }
  const raw = image.fileDirectory?.GDAL_NODATA
  if (raw != null && raw !== '') {
    const n = parseLooseFloatFromString(raw)
    if (Number.isFinite(n)) {
      return n
    }
  }
  return LEGACY_GDAL_FLOAT_NODATA
}

/** 与 gdal NoData 比较（极大 sentinels 允许极小数值漂移） */
function isGeoTiffNoData(v, noData) {
  if (!Number.isFinite(v)) {
    return true
  }
  if (noData == null || !Number.isFinite(noData)) {
    return false
  }
  if (v === noData) {
    return true
  }
  if (Math.abs(noData) >= 3e38) {
    return Math.abs(v - noData) < 1e31
  }
  const eps = 1e-9 * (Math.abs(v) + Math.abs(noData) + 1)
  return Math.abs(v - noData) <= eps
}

/**
 * 大气排放栅格统一设色：连续彩虹色带（低值深蓝 → 高值红）。
 * 地图像元配色为 t = clamp(v / cMax, 0, 1) 经下列 stops 分段线性插值，与图例 CSS 渐变色条一致，不按 stats breaks 分档。
 */
const AIR_JET_STOPS = [
  { t: 0, r: 0, g: 0, b: 139 },
  { t: 0.15, r: 0, g: 0, b: 255 },
  { t: 0.35, r: 0, g: 255, b: 255 },
  { t: 0.5, r: 0, g: 255, b: 0 },
  { t: 0.65, r: 255, g: 255, b: 0 },
  { t: 0.82, r: 255, g: 140, b: 0 },
  { t: 1, r: 200, g: 0, b: 0 },
]

function airJetRgbComponents(t) {
  const u = Math.max(0, Math.min(1, t))
  if (u <= AIR_JET_STOPS[0].t) {
    const s = AIR_JET_STOPS[0]
    return { r: s.r, g: s.g, b: s.b }
  }
  for (let i = 0; i < AIR_JET_STOPS.length - 1; i++) {
    const a = AIR_JET_STOPS[i]
    const b = AIR_JET_STOPS[i + 1]
    if (u <= b.t) {
      const f = (u - a.t) / (b.t - a.t)
      return {
        r: Math.round(a.r + (b.r - a.r) * f),
        g: Math.round(a.g + (b.g - a.g) * f),
        b: Math.round(a.b + (b.b - a.b) * f),
      }
    }
  }
  const last = AIR_JET_STOPS[AIR_JET_STOPS.length - 1]
  return { r: last.r, g: last.g, b: last.b }
}

/**
 * 排放像元值 → 连续 Jet RGB（t = (v - cMin) / (cMax - cMin)，与图例渐变色条一致，不按 stats breaks 分档）
 */
function airEmissionRgbForValue(v, cMin, cMax) {
  const span = cMax - cMin
  if (!Number.isFinite(v) || !(span > 0)) {
    return airJetRgbComponents(0)
  }
  const t = Math.max(0, Math.min(1, (v - cMin) / span))
  return airJetRgbComponents(t)
}

/** 图例左侧竖条：分段堆叠近似连续彩虹带（与部分环境下 CSS linear-gradient 不生效时仍稳定） */
const AIR_LEGEND_VBAR_SEGMENT_COUNT = 28

/** 归一化强度 t1∈[0,1] → 品牌色（仅在不走排放 Jet 时保留；当前大气只用 Jet） */
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
      /** 当前大气栅格动态范围，用于图例（与 canvas 着色一致） */
      airStats: null,
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
    landLegendTitle() {
      if (this.type !== 'land') {
        return ''
      }
      return this.landType === 'tn' ? '总排放 TN（t）' : '总排放 TP（t）'
    },
    landLegendRows() {
      if (this.type !== 'land') {
        return []
      }
      if (this.landType === 'tn') {
        return LAND_TN_CLASSES
      }
      if (this.landType === 'tp') {
        return LAND_TP_CLASSES
      }
      return []
    },
    airLegendTitleText() {
      if (this.type !== 'air') {
        return ''
      }
      const kind = this.kinds.find(k => k.value === this.airKind)?.label || this.airKind
      const src = this.types.find(t => t.value === this.airType)?.label || this.airType
      return `${kind} · ${src}`
    },
    /** 左侧色条：自上而下高→低，与地图 Jet 连续映射一致 */
    airLegendVBarBands() {
      const n = AIR_LEGEND_VBAR_SEGMENT_COUNT
      const list = []
      for (let i = 0; i < n; i++) {
        const tMid = 1 - (i + 0.5) / n
        list.push(airJetRgbComponents(tMid))
      }
      return list
    },
    /**
     * 色条右侧刻度：自上而下高→低。刻度与文案仅来自 stats.json breaks / breaks_formatted；
     * 竖向位置按 value / airStats.max（与地图色标上界 valid_max 一致）。
     */
    airLegendBreakTicks() {
      if (this.type !== 'air' || !this.airStats) {
        return []
      }
      const st = this.airStats
      const vMax = st.max
      const br = st.breaks
      const bf = st.breaksFormatted
      if (
        !Array.isArray(br)
        || br.length === 0
        || !Array.isArray(bf)
        || bf.length !== br.length
        || !Number.isFinite(vMax)
        || vMax <= 0
      ) {
        return []
      }
      const rows = []
      for (let i = br.length - 1; i >= 0; i--) {
        const v = Number(br[i])
        const topPct = (1 - Math.max(0, Math.min(v, vMax)) / vMax) * 100
        rows.push({
          label: String(bf[i]),
          topPct,
        })
      }
      return rows
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
      this.$nextTick(() => {
        this.flyToAirLayerInitialZoom()
      })
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
    /** 仅将流域高亮置顶；栅格不显式 bringToFront，以免压盖行政区面（依赖 zIndex） */
    syncPollutantLayerZOrder() {
      if (!window.$zMap) {
        return
      }
      try {
        if (this.basinOutlineLayer && typeof this.basinOutlineLayer.bringToFront === 'function') {
          this.basinOutlineLayer.bringToFront()
        }
      }
      catch (e) {
        console.warn('PollutantSections: syncPollutantLayerZOrder failed', e)
      }
    },
    /** 未选流域时，切换到大气后的初始视口：保持中心，缩放 6 级 */
    flyToAirLayerInitialZoom() {
      if (!window.$zMap || this.selectedBasinCode) {
        return
      }
      const map = window.$zMap
      const targetZ = 6
      try {
        const inner = map._map || map._leaflet || map
        if (inner && typeof inner.getCenter === 'function' && typeof inner.setView === 'function') {
          inner.setView(inner.getCenter(), targetZ)
          return
        }
        if (typeof map.setView === 'function' && typeof map.getCenter === 'function') {
          map.setView(map.getCenter(), targetZ)
        }
      }
      catch (e) {
        console.warn('PollutantSections: flyToAirLayerInitialZoom failed', e)
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
        zIndex: 8010,
        pane: POLLUTANT_MAP_OVERLAY_PANE,
        name: 'pollutantBasinHighlight',
        symbol: {
          styleOptions: {
            width: 2,
            color: '#4a8cc9',
            fillColor: '#b8daf5',
            fillOpacity: 0.38,
            outlineColor: '#4a8cc9',
            outlineWidth: 2,
            opacity: 1,
          },
        },
      })
      window.$zMap.addLayer(layer)
      layer.on(window.$ZMap.EventType.load, () => {
        this.syncPollutantLayerZOrder()
      })
      layer.load({ data: fc })
      layer.show = true
      this.basinOutlineLayer = layer
      this.$nextTick(() => {
        this.syncPollutantLayerZOrder()
      })
      // 缩放到流域在「栅格加载完成」后再做，避免与 loadLandRaster / loadAirRaster 并发导致 ImageLayer 被盖掉或未带上掩膜
    },
    /** 根据 landType(tn/tp) 和 landMonth(1-12) 得到 tif 文件名 */
    getTifUrl() {
      const prefix = this.landType === 'tp' ? 'TP' : 'TN'
      return `/file/pollutant/land/${prefix}Mon${this.landMonth}_all.tif`
    },
    /** 按 ImageLayer 构造时的 name 从地图上摘掉残留（避免 this.landLayer 与地图不同步） */
    _removePollutantRasterByName(map, layerName) {
      if (!map) {
        return
      }
      const inner = typeof map.eachLayer === 'function' ? map : (map._map || map._leaflet || map)
      if (!inner || typeof inner.eachLayer !== 'function') {
        return
      }
      const victims = []
      try {
        inner.eachLayer((ly) => {
          const n = ly && (ly.options?.name ?? ly.config?.name)
          if (n === layerName) {
            victims.push(ly)
          }
        })
      }
      catch (e) {
        console.warn('PollutantSections: eachLayer failed', e)
        return
      }
      for (const ly of victims) {
        try {
          if (typeof map.removeLayer === 'function') {
            map.removeLayer(ly)
          }
          else if (typeof inner.removeLayer === 'function') {
            inner.removeLayer(ly)
          }
        }
        catch (_) { /* 已移除 */ }
      }
    },
    removeLandLayer() {
      const map = window.$zMap
      const ref = this.landLayer
      this.landLayer = null
      if (ref && map) {
        try {
          map.removeLayer(ref)
        }
        catch (_) { /* 可能已不在地图上 */ }
        if (ref._urlRevoke && typeof URL.revokeObjectURL === 'function') {
          URL.revokeObjectURL(ref._urlRevoke)
        }
      }
      if (map) {
        this._removePollutantRasterByName(map, 'landPollutantRaster')
      }
    },
    /** 双线性插值采样：用周围 4 格点加权得到平滑值，避免块状 */
    sampleBilinear(data, width, height, x, y, noData, threshold, emissionRaster) {
      const x0 = Math.max(0, Math.min(width - 1, Math.floor(x)))
      const y0 = Math.max(0, Math.min(height - 1, Math.floor(y)))
      const x1 = Math.max(0, Math.min(width - 1, x0 + 1))
      const y1 = Math.max(0, Math.min(height - 1, y0 + 1))
      const dx = x - x0
      const dy = y - y0
      const valid = (v) => {
        if (isGeoTiffNoData(v, noData)) {
          return false
        }
        // 大气：仅正值参与插值；0 / 负值与无数据一样视为空
        return emissionRaster ? (Number.isFinite(v) && v > 0) : v > threshold
      }
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
     * opts.renderStyle === 'blocks'：每格方形像元（与陆域 TN 专题图一致），建议配合 opts.landPalette
     * opts.landPalette === 'tn' | 'tp'：陆域总氮/总磷固定六级分级设色（t，断点与专题图一致）
     * opts.uniformColor：有数据的格点统一用同一灰色点亮，无过渡色
     * opts.quantizeLevels：灰阶分级数（如 5），有值时无平滑过渡，仅离散几档灰
     * opts.interpolate + opts.scale：双线性插值放大，适合陆域栅格
     * opts.returnBounds：为 true 时返回 { dataUrl, bounds }，bounds 来自 TIF 的 getBoundingBox，保证叠加范围正确
     * opts.basinGeometry + opts.rasterGeoBounds：按流域多边形裁剪栅格（与 opts.returnBounds 解析出的范围或显式 bounds 一致）
     * opts.tintRgb：{ r, g, b } 备用品牌色（当前大气 emissionRaster 统一用 Jet 彩虹色带）
     * opts.emissionColorMax：大气排放色标上界（必选；优先与 stats.json valid_max 一致，图例同比例尺）
     * 大气像元：NoData、≤0 不参与设色，画布 alpha=0（透明）
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
          geoBounds = await geoTiffBBoxToLatLngBounds(bbox)
        }
      }
      /** returnBounds 时始终有可叠片范围，避免只返回字符串导致大气 stats 丢失 */
      const boundsForLayer = opts.returnBounds
        ? (geoBounds || AIR_RASTER_BOUNDS)
        : geoBounds
      const rasters = await image.readRasters()
      const data = rasters[0]
      const noData = readGeoTiffNoData(image)
      const dataThreshold = 1e-6
      const emissionRaster = opts.emissionRaster === true
      const emissionColorMaxOpt = opts.emissionColorMax
      if (emissionRaster) {
        const req = Number(emissionColorMaxOpt)
        if (!Number.isFinite(req) || req <= 0) {
          throw new Error('PollutantSections: emissionRaster 须传入有效的 opts.emissionColorMax（来自 stats.json）')
        }
      }
      let min = Infinity
      let max = -Infinity
      let validPixelCount = 0
      for (let i = 0; i < data.length; i++) {
        const v = data[i]
        const inRange = !isGeoTiffNoData(v, noData)
          && (emissionRaster ? (Number.isFinite(v) && v > 0) : v > dataThreshold)
        if (inRange) {
          validPixelCount++
          if (v < min) {
            min = v
          }
          if (v > max) {
            max = v
          }
        }
      }
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        min = 0
        max = 1
      }
      else if (max <= min) {
        max = min + 1e-12
      }
      const range = max - min

      /** 大气排放：色标 [0, emissionColorMax]，由 loadAirRaster 传入（一般为 stats valid_max；无则用 legend 上界） */
      let cMin = min
      let cMax = max
      if (emissionRaster) {
        cMin = 0
        cMax = Number(emissionColorMaxOpt)
      }
      if (cMax <= cMin) {
        cMax = cMin + 1e-12
      }
      const cRange = cMax - cMin
      let statsForReturn = { min, max }
      if (emissionRaster) {
        statsForReturn = { min: 0, max: cMax }
      }
      const scale = Math.max(1, Math.min(4, Number(opts.scale) || 1))
      const outW = width * scale
      const outH = height * scale
      const canvas = document.createElement('canvas')
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')
      const useUniformColor = opts.uniformColor === true
      const uniformGray = 20
      const quantizeLevels = emissionRaster
        ? 0
        : Math.max(0, Math.min(16, Number(opts.quantizeLevels) || 0))
      const tint = (opts.tintRgb && typeof opts.tintRgb.r === 'number') ? opts.tintRgb : null
      let landDiscretePalette = null
      if (opts.landPalette === 'tn') {
        landDiscretePalette = LAND_TN_PALETTE
      }
      else if (opts.landPalette === 'tp') {
        landDiscretePalette = LAND_TP_PALETTE
      }
      if (opts.renderStyle === 'dots' || opts.renderStyle === 'blocks') {
        ctx.clearRect(0, 0, outW, outH)
        const useBlocks = opts.renderStyle === 'blocks'
        for (let gy = 0; gy < height; gy++) {
          for (let gx = 0; gx < width; gx++) {
            const v = data[gy * width + gx]
            const valid = !isGeoTiffNoData(v, noData)
              && (emissionRaster ? (Number.isFinite(v) && v > 0) : v > dataThreshold)
            if (!valid) {
              continue
            }
            if (landDiscretePalette && !tint) {
              const { r, g, b } = landDiscreteColorForValue(v, landDiscretePalette)
              ctx.fillStyle = `rgb(${r},${g},${b})`
            }
            else {
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
              if (emissionRaster) {
                const { r, g, b } = useUniformColor
                  ? airJetRgbComponents(0.5)
                  : airEmissionRgbForValue(v, cMin, cMax)
                ctx.fillStyle = `rgb(${r},${g},${b})`
              }
              else if (tint) {
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
        let maskBounds = opts.rasterGeoBounds
        if (!maskBounds && boundsForLayer) {
          maskBounds = {
            west: boundsForLayer[0][1],
            south: boundsForLayer[0][0],
            east: boundsForLayer[1][1],
            north: boundsForLayer[1][0],
          }
        }
        const g = opts.basinGeometry
        if (maskBounds && g && (g.type === 'Polygon' || g.type === 'MultiPolygon')) {
          applyBasinMaskToCanvas(canvas, maskBounds, g)
        }
        const dataUrlDots = canvas.toDataURL('image/png')
        if (opts.returnBounds) {
          return { dataUrl: dataUrlDots, bounds: boundsForLayer, stats: statsForReturn }
        }
        return dataUrlDots
      }
      const useInterpolate = opts.interpolate !== false && scale > 1
      const imgData = ctx.createImageData(outW, outH)
      if (useInterpolate) {
        for (let j = 0; j < outH; j++) {
          for (let i = 0; i < outW; i++) {
            const x = (i + 0.5) / scale - 0.5
            const y = (j + 0.5) / scale - 0.5
            const { v, hasData } = this.sampleBilinear(
              data,
              width,
              height,
              x,
              y,
              noData,
              dataThreshold,
              emissionRaster,
            )
            const emissionShow = emissionRaster && hasData && Number.isFinite(v) && v > 0
            const t1 = emissionShow
              ? Math.max(0, Math.min(1, (v - cMin) / cRange))
              : ((hasData && !emissionRaster)
                  ? Math.max(
                    0,
                    Math.min(1, (v - min) / range),
                  )
                  : 0)
            const gray = Math.round(t1 * 255)
            const idx = (j * outW + i) * 4
            if (emissionRaster) {
              if (emissionShow) {
                const { r, g, b } = airEmissionRgbForValue(v, cMin, cMax)
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
            else if (tint) {
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
          const isNoData = isGeoTiffNoData(v, noData)
            || (emissionRaster ? (!Number.isFinite(v) || v <= 0) : v <= dataThreshold)
          const t1 = isNoData
            ? 0
            : Math.max(
              0,
              Math.min(1, (v - (emissionRaster ? cMin : min)) / (emissionRaster ? cRange : range)),
            )
          const gray = Math.round(t1 * 255)
          const base = i * 4
          if (emissionRaster) {
            if (isNoData) {
              smallImg.data[base] = 0
              smallImg.data[base + 1] = 0
              smallImg.data[base + 2] = 0
              smallImg.data[base + 3] = 0
            }
            else {
              const { r, g, b } = airEmissionRgbForValue(v, cMin, cMax)
              smallImg.data[base] = r
              smallImg.data[base + 1] = g
              smallImg.data[base + 2] = b
              smallImg.data[base + 3] = 255
            }
          }
          else if (tint) {
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
      if (!maskBounds && boundsForLayer) {
        maskBounds = {
          west: boundsForLayer[0][1],
          south: boundsForLayer[0][0],
          east: boundsForLayer[1][1],
          north: boundsForLayer[1][0],
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
      if (opts.returnBounds) {
        return { dataUrl, bounds: boundsForLayer, stats: statsForReturn }
      }
      return dataUrl
    },
    /** 大气 TIF 路径：按月份选 Mon1/Mon4/Mon7/Mon10 目录下的 {airKind}_{airType}.tif */
    getAirTifUrl() {
      return `${AIR_CSV_BASE}/${this.airMonFolder}/${this.airKind}_${this.airType}.tif`
    },
    /** 读取当季 stats.json 中与当前物种·源对应的图层项（含 legend） */
    async fetchAirStatsLayerEntry() {
      const url = `${AIR_CSV_BASE}/${this.airMonFolder}/stats.json`
      try {
        const res = await fetch(url, { credentials: 'same-origin' })
        if (!res.ok) {
          return null
        }
        const manifest = await res.json()
        const fname = `${this.airKind}_${this.airType}.tif`
        const layer = (manifest.layers || []).find(L => L && L.file === fname)
        return layer || null
      }
      catch (e) {
        console.warn('PollutantSections: stats.json', url, e)
        return null
      }
    },
    removeAirLayer() {
      const map = window.$zMap
      const ref = this.airLayer
      this.airLayer = null
      if (ref && map) {
        try {
          map.removeLayer(ref)
        }
        catch (_) { /* 可能已不在地图上 */ }
        if (ref._urlRevoke && typeof URL.revokeObjectURL === 'function') {
          URL.revokeObjectURL(ref._urlRevoke)
        }
      }
      if (map) {
        this._removePollutantRasterByName(map, 'airPollutantRaster')
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
      this.airStats = null
      this.removeAirLayer()
      this.removeLandLayer()
      try {
        const prefLayer = await this.fetchAirStatsLayerEntry()
        const maskGeom = this.selectedBasinCode ? this.getSelectedBasinGeometry() : null
        const airOpts = { scale: 4, returnBounds: true, emissionRaster: true, interpolate: true }
        if (maskGeom && (maskGeom.type === 'Polygon' || maskGeom.type === 'MultiPolygon')) {
          airOpts.basinGeometry = maskGeom
        }
        const leg = prefLayer && prefLayer.legend
        /** 着色上界：优先 TIF 统计 valid_max，与图例顶端比例尺一致；兜底再用 legend 显示上界 */
        let emissionCap = NaN
        if (prefLayer) {
          const vm = Number(prefLayer.valid_max)
          if (Number.isFinite(vm) && vm > 0) {
            emissionCap = vm
          }
        }
        if (!Number.isFinite(emissionCap) && leg) {
          const fromDisp = Number(leg.display_max_125)
          const br = leg.breaks
          const lastBreak = (Array.isArray(br) && br.length)
            ? Number(br[br.length - 1])
            : NaN
          const cm = (Number.isFinite(fromDisp) && fromDisp > 0)
            ? fromDisp
            : ((Number.isFinite(lastBreak) && lastBreak > 0) ? lastBreak : NaN)
          if (Number.isFinite(cm) && cm > 0) {
            emissionCap = cm
          }
        }
        if (Number.isFinite(emissionCap) && emissionCap > 0) {
          airOpts.emissionColorMax = emissionCap
        }
        // 双线性插值；色标 [0, emissionColorMax] 与 stats valid_max / 图例比例尺一致（若有）
        const result = await this.renderGeoTiffToDataUrl(tifUrl, airOpts)
        if (reqId !== this._airRasterReqId || this.type !== 'air') {
          return
        }
        const dataUrl = (typeof result === 'string') ? result : result.dataUrl
        const rasterStats = (typeof result === 'object' && result.stats) ? result.stats : null
        if (
          prefLayer
          && leg
          && Array.isArray(leg.breaks)
          && leg.breaks.length > 0
          && Array.isArray(leg.breaks_formatted)
          && leg.breaks_formatted.length === leg.breaks.length
        ) {
          const cmOpt = Number(airOpts.emissionColorMax)
          const fromLeg = Number(leg.display_max_125)
          const brLast = Number(leg.breaks[leg.breaks.length - 1])
          let cap = (Number.isFinite(cmOpt) && cmOpt > 0)
            ? cmOpt
            : ((Number.isFinite(fromLeg) && fromLeg > 0)
                ? fromLeg
                : ((Number.isFinite(brLast) && brLast > 0) ? brLast : NaN))
          if (!Number.isFinite(cap) || cap <= 0) {
            cap = (rasterStats && Number(rasterStats.max)) || 1
          }
          this.airStats = {
            min: typeof leg.display_min === 'number' ? leg.display_min : 0,
            max: cap,
            breaks: leg.breaks,
            breaksFormatted: leg.breaks_formatted,
          }
        }
        else if (rasterStats) {
          this.airStats = rasterStats
        }
        else {
          this.airStats = null
        }
        if (!this.airStats) {
          console.warn('PollutantSections: 大气栅格无有效像元或统计失败', tifUrl)
          return
        }
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
          zIndex: POLLUTANT_RASTER_Z_INDEX,
          pane: POLLUTANT_MAP_OVERLAY_PANE,
        })
        window.$zMap.addLayer(this.airLayer)
        this.$nextTick(() => {
          this.syncPollutantLayerZOrder()
        })
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
        else if (reqId === this._airRasterReqId) {
          this.$nextTick(() => {
            this.flyToAirLayerInitialZoom()
          })
        }
      }
      catch (err) {
        console.warn('PollutantSections: load air raster failed', tifUrl, err)
        this.airStats = null
      }
      finally {
        this.airLoading = false
        this.airProgress = ''
      }
    },
    onTypeChange() {
      if (this.type === 'land' && window.$zMap) {
        this.airStats = null
        this.loadLandRaster()
      }
      else {
        this.removeLandLayer()
      }
      if (this.type === 'air' && window.$zMap) {
        this.loadAirRaster()
        this.$nextTick(() => {
          this.flyToAirLayerInitialZoom()
        })
      }
      else {
        this.removeAirLayer()
        this.airStats = null
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
      this.removeAirLayer()
      try {
        const maskGeom = this.selectedBasinCode ? this.getSelectedBasinGeometry() : null
        const landOpts = {
          scale: 3,
          renderStyle: 'blocks',
          landPalette: this.landType,
        }
        if (maskGeom && (maskGeom.type === 'Polygon' || maskGeom.type === 'MultiPolygon')) {
          landOpts.basinGeometry = maskGeom
          landOpts.rasterGeoBounds = LAND_RASTER_GEO_BOUNDS
        }
        const dataUrl = await this.renderGeoTiffToDataUrl(url, landOpts)
        if (reqId !== this._landRasterReqId || this.type !== 'land') {
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
          opacity: 0.95,
          zIndex: POLLUTANT_RASTER_Z_INDEX,
          pane: POLLUTANT_MAP_OVERLAY_PANE,
        })
        window.$zMap.addLayer(this.landLayer)
        this.$nextTick(() => {
          this.syncPollutantLayerZOrder()
        })
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
    <div
      v-if="type === 'land'"
      class="land-legend land-legend--map-corner"
    >
      <div class="land-legend-title">
        {{ landLegendTitle }}
      </div>
      <div
        v-for="(row, idx) in landLegendRows"
        :key="idx"
        class="land-legend-row"
      >
        <span
          class="land-legend-swatch"
          :style="{
            backgroundColor: `rgb(${row.r}, ${row.g}, ${row.b})`,
          }"
        />
        <span class="land-legend-label">{{ row.label }}</span>
      </div>
    </div>
    <div
      v-else-if="type === 'air' && airStats"
      class="land-legend land-legend--map-corner air-emission-legend"
    >
      <div class="land-legend-title">
        {{ airLegendTitleText }}
      </div>
      <div class="air-legend-vertical-box">
        <div class="air-legend-bar-and-ticks">
          <div class="air-legend-vbar-track">
            <div class="air-legend-vbar air-legend-vbar--stacked">
              <div
                v-for="(b, bidx) in airLegendVBarBands"
                :key="bidx"
                class="air-legend-vbar-seg"
                :style="{
                  backgroundColor: `rgb(${b.r}, ${b.g}, ${b.b})`,
                }"
              />
            </div>
          </div>
          <div class="air-legend-break-axis">
            <div
              v-for="(row, idx) in airLegendBreakTicks"
              :key="idx"
              class="air-legend-break-tick"
              :style="{ top: `${row.topPct}%` }"
            >
              <span class="air-legend-break-tick-line" />
              <span class="air-legend-break-tick-label">{{ row.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="type === 'air' && !airStats && !airLoading"
      class="land-legend land-legend--map-corner air-emission-legend air-emission-legend--empty"
    >
      <div class="land-legend-title">
        {{ airLegendTitleText || '大气排放' }}
      </div>
      <div class="air-legend-empty-hint">
        当前 TIF 无有效像元或加载失败；请确认文件为含数据的栅格，米制 Albers 已自动转 WGS84 叠加（需依赖 proj4）。
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
  flex-direction: column;

  .filters {
    pointer-events: all;
  }

  .filter-label {
    font-size: 13px;
    color: var(--el-text-color-regular);
    white-space: nowrap;
  }

  .land-legend {
    padding: 10px 12px;
    max-width: 240px;

    &.air-emission-legend {
      max-width: 292px;
    }
    font-size: 12px;
    line-height: 1.45;
    color: var(--el-text-color-regular);
    background: rgba(255, 255, 255, 0.94);
    border-radius: 6px;
    border: 1px solid var(--el-border-color-lighter);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  /* 地图可视区右下角：避开右侧抽屉（499px）与顶栏 */
  .land-legend--map-corner {
    position: fixed;
    right: 528px;
    bottom: 32px;
    z-index: 2100;
    pointer-events: auto;
    margin: 0;
  }

  .land-legend-title {
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 13px;
  }

  .land-legend-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .land-legend-swatch {
    flex-shrink: 0;
    width: 22px;
    height: 14px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .air-progress {
    margin-left: 8px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  .air-legend-vertical-box {
    margin-top: 6px;
  }

  .air-legend-bar-and-ticks {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 220px;
    column-gap: 0;
  }

  .air-legend-vbar-track {
    flex-shrink: 0;
    padding: 2px 0;
    display: flex;
    align-items: stretch;
  }

  .air-legend-vbar {
    width: 20px;
    height: 220px;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.14);
    box-sizing: border-box;

    &--stacked {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  .air-legend-vbar-seg {
    flex: 1;
    min-height: 0;
  }

  .air-legend-empty-hint {
    margin-top: 6px;
    font-size: 11px;
    line-height: 1.4;
    color: var(--el-text-color-secondary);
  }

  .air-legend-break-axis {
    position: relative;
    flex: 1;
    min-width: 0;
    height: 220px;
    /* 紧贴色条：与 vbar 之间不再留空 */
    margin-left: 0;
  }

  .air-legend-break-tick {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    transform: translateY(-50%);
    font-size: 11px;
    line-height: 1.2;
  }

  .air-legend-break-tick-line {
    flex-shrink: 0;
    width: 12px;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.42);
  }

  .air-legend-break-tick-label {
    font-variant-numeric: tabular-nums;
    color: var(--el-text-color-regular);
    word-break: break-all;
  }
}
</style>
