<script>
import { ElLoading } from 'element-plus'
import { fromUrl } from 'geotiff'
import { applyBasinMaskToCanvas } from '@/utils/basinMask'
import eventBus from '@/utils/eventBus'

/** 与 layouts/index 约定：陆域→浅色二维底图，大气→蓝色二维底图，default→恢复全局默认 */
const POLLUTANT_BASEMAP_EVENT = 'pollutantBasemap'

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
 * 图例 landLegendRows 直接使用本表同一套 rgb，上色 landDiscreteColorForValue(..., LAND_TN_PALETTE)，与图例一致。
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
 * 图例与栅格同上，共用本表 + LAND_TP_PALETTE。
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

/** mars2d ImageLayer 默认 tilePane；污染源栅格用 overlayPane，Leaflet 中 overlayPane 高于 tilePane，故可压在 tilePane 内的大气深蓝底图之上且仍低于同 pane 内高 zIndex 区划层 */
const POLLUTANT_MAP_OVERLAY_PANE = 'overlayPane'
/**
 * 须低于 overlayPane 内常见区划/矢量（如 ThreeLevelAreas 360、ControlUnit 1）；大气深蓝底图在 tilePane 时不与之比 zIndex。
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
 * 大气排放栅格（NO/NO₂）：连续彩虹色带（低值深蓝 → 高值红）。
 * t = clamp(v / cMax, 0, 1) 经下列 stops 分段线性插值；NH₃ 单独使用 NH3_JET_STOPS，与 2022 专题图工业源 7 档色相一致。
 * 图例：NO/NO₂ 竖条用 AIR_JET_STOPS；刻度位置 t=v/max 与栅格 t=v/emissionColorMax（max 同 getAirFixedLegendMeta）。
 * NH₃ 栅格用 nh3ValueToNormT 与图例 breakNormT 一致；顶台溢出色与 airLegendVBarStyle 中 plateauRgb 一致。
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

/**
 * NH₃ 专用色标：在 t = 0, 1/6, …, 1 上对 Matplotlib 3.8 `jet`（_jet_data）逐通道插值取样的整型 RGB，
 * 与专题图 / ArcGIS 常见 Jet 一致；段间仍线性插值。NO/NO₂ 仍用 AIR_JET_STOPS。
 */
const NH3_JET_STOPS = [
  { t: 0, r: 0, g: 0, b: 128 },
  { t: 1 / 6, r: 0, g: 42, b: 255 },
  { t: 2 / 6, r: 0, g: 212, b: 255 },
  { t: 0.5, r: 123, g: 255, b: 123 },
  { t: 4 / 6, r: 255, g: 230, b: 0 },
  { t: 5 / 6, r: 255, g: 72, b: 0 },
  { t: 1, r: 128, g: 0, b: 0 },
]

function jetRgbFromStops(stops, t) {
  const u = Math.max(0, Math.min(1, t))
  if (!stops.length) {
    return { r: 0, g: 0, b: 0 }
  }
  if (u <= stops[0].t) {
    const s = stops[0]
    return { r: s.r, g: s.g, b: s.b }
  }
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]
    if (u <= b.t) {
      const denom = b.t - a.t
      const f = denom > 0 ? (u - a.t) / denom : 0
      return {
        r: Math.round(a.r + (b.r - a.r) * f),
        g: Math.round(a.g + (b.g - a.g) * f),
        b: Math.round(a.b + (b.b - a.b) * f),
      }
    }
  }
  const last = stops[stops.length - 1]
  return { r: last.r, g: last.g, b: last.b }
}

/**
 * 图例竖条：与栅格相同的 stops，to top = 低 t 在下、高 t 在上。
 * topPlateauPct>0 时 Jet 占 (100−p)%，顶端 p% 为平顶饱和色；须配合 CSS background-size/repeat 铺满色条。
 */
function airLegendLinearGradientToTop(stops, { topPlateauPct = 0, rampTopT = 1, plateauRgb = null } = {}) {
  const p = Math.max(0, Math.min(25, topPlateauPct))
  const mt = Math.max(1e-6, Math.min(1, rampTopT))
  const inner = 100 - p
  const topC = jetRgbFromStops(stops, mt)
  const segs = []
  for (const s of stops) {
    if (s.t > mt + 1e-9) {
      continue
    }
    const posNum = (s.t / mt) * inner
    segs.push({ pos: posNum, css: `rgb(${s.r},${s.g},${s.b}) ${posNum.toFixed(3)}%` })
  }
  const innerNum = inner
  const topCss = `rgb(${topC.r},${topC.g},${topC.b}) ${innerNum.toFixed(3)}%`
  if (segs.length && Math.abs(segs[segs.length - 1].pos - innerNum) < 1e-4) {
    segs[segs.length - 1].css = topCss
  }
  else {
    segs.push({ pos: innerNum, css: topCss })
  }
  const strParts = segs.map(x => x.css)
  if (p > 0) {
    const pl = plateauRgb || topC
    strParts.push(`rgb(${pl.r},${pl.g},${pl.b}) 100%`)
  }
  return `linear-gradient(to top, ${strParts.join(', ')})`
}

function airJetRgbComponents(t) {
  return jetRgbFromStops(AIR_JET_STOPS, t)
}

function nh3JetRgbComponents(t) {
  return jetRgbFromStops(NH3_JET_STOPS, t)
}

/**
 * 排放像元值 → Jet RGB。NH₃：nh3Piecewise 在 breaks 间对 breakNormT 插值；overflowRgb 且 v>cMax 时用顶台色。
 */
function airEmissionRgbForValue(v, cMin, cMax, useNh3ReferenceJet = false, nh3Piecewise = null) {
  const span = cMax - cMin
  const jetLow = useNh3ReferenceJet ? nh3JetRgbComponents(0) : airJetRgbComponents(0)
  if (!Number.isFinite(v) || !(span > 0)) {
    return jetLow
  }
  if (
    useNh3ReferenceJet
    && nh3Piecewise
    && Array.isArray(nh3Piecewise.breaks)
    && nh3Piecewise.breaks.length > 0
    && Array.isArray(nh3Piecewise.breakNormT)
    && nh3Piecewise.breakNormT.length === nh3Piecewise.breaks.length
  ) {
    const ov = nh3Piecewise.overflowRgb
    if (
      ov
      && typeof ov.r === 'number'
      && typeof ov.g === 'number'
      && typeof ov.b === 'number'
      && v > cMax
    ) {
      return { r: Math.round(ov.r), g: Math.round(ov.g), b: Math.round(ov.b) }
    }
    const tMap = nh3ValueToNormT(v, cMax, nh3Piecewise.breaks, nh3Piecewise.breakNormT)
    return nh3JetRgbComponents(tMap)
  }
  const t = Math.max(0, Math.min(1, (v - cMin) / span))
  return useNh3ReferenceJet ? nh3JetRgbComponents(t) : airJetRgbComponents(t)
}

/** 与 .air-legend-vbar 同高；色条不用 border 占高，避免渐变按 padding-box 变矮、刻度却仍按 220px 算导致与参考图错位 */
const AIR_LEGEND_VBAR_HEIGHT_PX = 220
const AIR_LEGEND_VBAR_INSET_PCT = 0

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

/**
 * 大气排放：物种×六源固定图例（显式 breaks / breaksFormatted；不用 stats.json）。
 *
 * NH₃ 固定图例对齐《2022 年大气 NH₃ 行业排放空间分布》专题图右侧竖条（色标 + 断点数值）。
 * 参考图刻度与数字画在色条内侧、居中对齐；本组件为色条 + 外侧刻度线 + 文案，数值与断点与参考一致。
 *
 * | 应用排放源     | 参考子图   | max     | 刻度 |
 * |---------------|-----------|---------|------|
 * | 工业源         | 工业源     | 0.6     | 0.0…0.6 步长 0.1 |
 * | 能源及电厂源   | 能源及电厂 | 0.0004  | 五位小数至 0.00040 |
 * | 居民源         | 居民源     | 0.6     | 同工业 |
 * | 交通源         | 交通源     | 0.08    | 0.00…0.08 步长 0.01 |
 * | 农业源         | 农业源     | 6       | 整数 0…6 |
 * | 港口和船舶源   | 自然源     | 0.04    | 0.00…0.04 步长 0.01；顶台饱和略高（NH3_LEGEND_TOP_PLATEAU_PCT_SHIP） |
 *
 * 单位：µg/m²/s（与 emitgrid.ctl 一致）。
 */
/** 7 档：断点在色带上均匀分布（0, 1/6, …, 1） */
const NH3_LEGEND_NORM_T_7 = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1]
/** 9 档：0, 1/8, …, 1 */
const NH3_LEGEND_NORM_T_9 = [0, 1 / 8, 2 / 8, 3 / 8, 4 / 8, 5 / 8, 6 / 8, 7 / 8, 1]
/** 5 档：0, 0.25, …, 1 */
const NH3_LEGEND_NORM_T_5 = [0, 0.25, 0.5, 0.75, 1]
/** 顶台区高度（占色条 %），与参考图 max 刻度下方～条顶之间的饱和段一致 */
const NH3_LEGEND_TOP_PLATEAU_PCT_STANDARD = 8
/** NH₃ 港口和船舶源（自然源档）：专题图顶台占比更大，约 10%～15% 色条高 */
const NH3_LEGEND_TOP_PLATEAU_PCT_SHIP = 12
/** NO / NO₂ 图例顶台（《2022 年大气 NO₂ 行业排放空间分布》竖条顶饱和深红） */
const NO_NO2_LEGEND_TOP_PLATEAU_PCT = NH3_LEGEND_TOP_PLATEAU_PCT_STANDARD
/** 港口和船舶栅格 v>cMax 时略深饱和色（与图例顶台同色带衔接） */
const NH3_SHIP_OVERFLOW_RGB = { r: 92, g: 0, b: 28 }

/** 专题图「自然源」图例（max 0.04、五档）；本应用由港口和船舶源（Ship）沿用 */
const NH3_AIR_LEGEND_NATURAL = {
  max: 0.04,
  breaks: [0, 0.01, 0.02, 0.03, 0.04],
  breaksFormatted: ['0.00', '0.01', '0.02', '0.03', '0.04'],
  breakNormT: NH3_LEGEND_NORM_T_5,
}

const NH3_AIR_LEGEND_INDUSTRY_DOMESTIC = {
  max: 0.6,
  breaks: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
  breaksFormatted: ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6'],
  breakNormT: NH3_LEGEND_NORM_T_7,
  nh3LegendTopPlateauPct: NH3_LEGEND_TOP_PLATEAU_PCT_STANDARD,
}

/** 能源及电厂源与陆域交通源同档（2022 年 NO₂ 行业排放专题图：0–1.4，步长 0.2） */
const NO_NO2_AIR_ENERGY_TRAFFIC = {
  max: 1.4,
  breaks: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4],
  breaksFormatted: ['0.0', '0.2', '0.4', '0.6', '0.8', '1.0', '1.2', '1.4'],
}

/**
 * NO / NO₂ 固定图例：与《2022 年大气 NO₂ 行业排放空间分布》六子图右侧竖条一致（色带 AIR_JET_STOPS；顶台见 getAirFixedLegendMeta）。
 * | 应用排放源   | 参考子图     | max   | 刻度 |
 * |-------------|-------------|-------|------|
 * | 工业源       | 工业源       | 2     | 0.00…2.00 步长 0.25 |
 * | 能源及电厂源 | 能源及电厂   | 1.4   | 0.0…1.4 步长 0.2 |
 * | 居民源       | 居民源       | 0.3   | 0.00…0.30 步长 0.05 |
 * | 交通源       | 陆域交通源   | 1.4   | 同能源 |
 * | 农业源       | 农业源       | 0.025 | 0.000…0.025 步长 0.005 |
 * | 港口和船舶源 | 港口和船舶   | 1.75  | 0.00…1.75 步长 0.25 |
 */
const NO_NO2_AIR_LEGEND_BY_SOURCE = {
  Industry: {
    max: 2,
    breaks: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    breaksFormatted: ['0.00', '0.25', '0.50', '0.75', '1.00', '1.25', '1.50', '1.75', '2.00'],
  },
  Energy: NO_NO2_AIR_ENERGY_TRAFFIC,
  Domestic: {
    max: 0.3,
    breaks: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3],
    breaksFormatted: ['0.00', '0.05', '0.10', '0.15', '0.20', '0.25', '0.30'],
  },
  Traffic: NO_NO2_AIR_ENERGY_TRAFFIC,
  Agriculture: {
    max: 0.025,
    breaks: [0, 0.005, 0.01, 0.015, 0.02, 0.025],
    breaksFormatted: ['0.000', '0.005', '0.010', '0.015', '0.020', '0.025'],
  },
  Ship: {
    max: 1.75,
    breaks: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75],
    breaksFormatted: ['0.00', '0.25', '0.50', '0.75', '1.00', '1.25', '1.50', '1.75'],
  },
}

const AIR_FIXED_AIR_LEGEND_BY_KIND_AND_SOURCE = {
  NH3: {
    Industry: NH3_AIR_LEGEND_INDUSTRY_DOMESTIC,
    Energy: {
      max: 0.0004,
      breaks: [
        0,
        0.00005,
        0.0001,
        0.00015,
        0.0002,
        0.00025,
        0.0003,
        0.00035,
        0.0004,
      ],
      breaksFormatted: [
        '0.00000',
        '0.00005',
        '0.00010',
        '0.00015',
        '0.00020',
        '0.00025',
        '0.00030',
        '0.00035',
        '0.00040',
      ],
      breakNormT: NH3_LEGEND_NORM_T_9,
      nh3LegendTopPlateauPct: NH3_LEGEND_TOP_PLATEAU_PCT_STANDARD,
    },
    Domestic: { ...NH3_AIR_LEGEND_INDUSTRY_DOMESTIC },
    /** 交通源：参考图 0.00～0.08、步长 0.01（九档） */
    Traffic: {
      max: 0.08,
      breaks: [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08],
      breaksFormatted: [
        '0.00',
        '0.01',
        '0.02',
        '0.03',
        '0.04',
        '0.05',
        '0.06',
        '0.07',
        '0.08',
      ],
      breakNormT: NH3_LEGEND_NORM_T_9,
      nh3LegendTopPlateauPct: NH3_LEGEND_TOP_PLATEAU_PCT_STANDARD,
    },
    Agriculture: {
      max: 6,
      breaks: [0, 1, 2, 3, 4, 5, 6],
      breaksFormatted: ['0', '1', '2', '3', '4', '5', '6'],
      breakNormT: NH3_LEGEND_NORM_T_7,
      nh3LegendTopPlateauPct: NH3_LEGEND_TOP_PLATEAU_PCT_STANDARD,
    },
    Ship: {
      ...NH3_AIR_LEGEND_NATURAL,
      nh3LegendTopPlateauPct: NH3_LEGEND_TOP_PLATEAU_PCT_SHIP,
      nh3OverflowRgb: NH3_SHIP_OVERFLOW_RGB,
    },
  },
  NO: NO_NO2_AIR_LEGEND_BY_SOURCE,
  NO2: NO_NO2_AIR_LEGEND_BY_SOURCE,
}

function getAirFixedLegendEntry(kind, sourceType) {
  return AIR_FIXED_AIR_LEGEND_BY_KIND_AND_SOURCE[kind]?.[sourceType] || null
}

function getAirFixedEmissionColorMax(kind, sourceType) {
  const e = getAirFixedLegendEntry(kind, sourceType)
  const v = e && e.max
  return (Number.isFinite(v) && v > 0) ? v : NaN
}

/** NH₃：解析断点在固定色带上的归一化位置；未配置时与 breaks[i]/max 线性对应 */
function resolveNh3BreakNormT(e) {
  if (!e || !Array.isArray(e.breaks) || e.breaks.length === 0) {
    return null
  }
  const br = e.breaks
  const mx = e.max
  if (Array.isArray(e.breakNormT) && e.breakNormT.length === br.length) {
    return e.breakNormT.map(t => Math.max(0, Math.min(1, Number(t))))
  }
  if (!Number.isFinite(mx) || mx <= 0) {
    return br.map(() => 0)
  }
  return br.map(b => Math.max(0, Math.min(1, b / mx)))
}

/** NH₃：数值 v → 固定色带上的 t∈[0,1]，在相邻断点间对 breakNormT 线性插值；v>vmax 映射到 t=1（图例顶台 / Jet 顶色） */
function nh3ValueToNormT(v, vmax, breaks, breakNormT) {
  if (!breaks.length || !breakNormT || breakNormT.length !== breaks.length) {
    return Math.max(0, Math.min(1, vmax > 0 ? v / vmax : 0))
  }
  if (Number.isFinite(v) && Number.isFinite(vmax) && v > vmax) {
    return 1
  }
  const vn = Math.max(0, Math.min(v, vmax))
  const n = breaks.length
  if (vn <= breaks[0]) {
    return breakNormT[0]
  }
  if (vn >= breaks[n - 1]) {
    return breakNormT[n - 1]
  }
  for (let i = 0; i < n - 1; i++) {
    const b1 = breaks[i + 1]
    if (vn <= b1) {
      const b0 = breaks[i]
      const span = b1 - b0
      const f = span > 0 ? (vn - b0) / span : 0
      return breakNormT[i] + f * (breakNormT[i + 1] - breakNormT[i])
    }
  }
  return breakNormT[n - 1]
}

/** 固定图例元数据（breaks 与 breaksFormatted 等长；NH₃ 带 breakNormT 供刻度与上色） */
function getAirFixedLegendMeta(kind, sourceType) {
  const e = getAirFixedLegendEntry(kind, sourceType)
  if (
    !e
    || !Array.isArray(e.breaks)
    || !Array.isArray(e.breaksFormatted)
    || e.breaks.length !== e.breaksFormatted.length
    || e.breaks.length === 0
  ) {
    return null
  }
  const meta = {
    min: 0,
    max: e.max,
    breaks: e.breaks,
    breaksFormatted: e.breaksFormatted,
  }
  if (kind === 'NH3') {
    meta.breakNormT = resolveNh3BreakNormT(e)
    const pl = e.nh3LegendTopPlateauPct
    meta.legendTopPlateauPct = (
      Number.isFinite(pl) && pl >= 0
    )
      ? Math.max(0, Math.min(25, pl))
      : 0
    if (e.nh3OverflowRgb && typeof e.nh3OverflowRgb.r === 'number') {
      meta.nh3OverflowRgb = e.nh3OverflowRgb
    }
  }
  else if (kind === 'NO' || kind === 'NO2') {
    meta.legendTopPlateauPct = NO_NO2_LEGEND_TOP_PLATEAU_PCT
  }
  return meta
}

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
      kinds,
      airKind: 'NH3',
      types,
      airType: 'Industry',
      seasons,
      airSeason: 'Mon4',
      airLayer: null,
      /** 大气栅格请求中（仅用于图例空态，不用于筛选区 loading） */
      airLoading: false,
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
    /** 左侧渐变色条：Jet 主段 + legendTopPlateauPct 顶台饱和（NH₃ / NO / NO₂ 与专题图一致） */
    airLegendVBarStyle() {
      if (this.type !== 'air') {
        return {}
      }
      const stops = this.airKind === 'NH3' ? NH3_JET_STOPS : AIR_JET_STOPS
      const o = (
        this.airStats
        && Number.isFinite(this.airStats.legendTopPlateauPct)
      )
        ? this.airStats.legendTopPlateauPct
        : 0
      const ov = this.airStats?.nh3OverflowRgb
      const plateauRgb = (
        this.airKind === 'NH3'
        && ov
        && typeof ov.r === 'number'
        && typeof ov.g === 'number'
        && typeof ov.b === 'number'
      )
        ? { r: ov.r, g: ov.g, b: ov.b }
        : null
      /** 顶台颜色与 airEmissionRgbForValue 中 v>cMax 的 overflowRgb 一致（如 NH₃ 船舶源） */
      const grad = airLegendLinearGradientToTop(stops, {
        topPlateauPct: o,
        rampTopT: 1,
        plateauRgb,
      })
      return {
        backgroundColor: 'transparent',
        backgroundImage: grad,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }
    },
    /**
     * 色条右侧刻度：自上而下高→低。NH₃ 刻度沿分段归一；NO/NO₂ 用 v/max；有顶台时 max 在顶台下沿。
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
      const bnt = (
        this.airKind === 'NH3'
        && Array.isArray(st.breakNormT)
        && st.breakNormT.length === br.length
      )
        ? st.breakNormT
        : null
      const k = AIR_LEGEND_VBAR_INSET_PCT
      const o = Number.isFinite(this.airStats.legendTopPlateauPct)
        ? this.airStats.legendTopPlateauPct
        : 0
      const inner = 100 - 2 * k - o
      const tEps = 1e-6
      const rows = []
      for (let i = br.length - 1; i >= 0; i--) {
        const v = Number(br[i])
        const vn = Math.max(0, Math.min(v, vMax))
        const tShow = Math.max(0, Math.min(1, bnt ? bnt[i] : (vn / vMax)))
        const topFrac = 1 - tShow

        let tickStyle
        let tickClass = ''
        if (tShow <= tEps) {
          tickStyle = {
            top: 'auto',
            bottom: `${k}%`,
            transform: 'translateY(50%)',
          }
          tickClass = 'air-legend-break-tick--edge-bottom'
        }
        else if (tShow >= 1 - tEps) {
          /* 主段顶 = 顶台下沿；整行垂直居中对齐交界 */
          tickStyle = {
            top: `${k + o}%`,
            bottom: 'auto',
            transform: 'translateY(-50%)',
          }
          tickClass = 'air-legend-break-tick--edge-top'
        }
        else {
          tickStyle = {
            top: `${k + o + topFrac * inner}%`,
            bottom: 'auto',
            transform: 'translateY(-50%)',
          }
        }
        rows.push({
          label: String(bf[i]),
          tickStyle,
          tickClass,
        })
      }
      return rows
    },
  },
  watch: {
    type() {
      this.emitPollutantBasemapForType()
    },
    landType() {
      this.loadLandRaster()
      if (this.type === 'land') {
        this.emitPollutantBasemapForType()
      }
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
    this.$nextTick(() => this.emitPollutantBasemapForType())
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
    eventBus.emit(POLLUTANT_BASEMAP_EVENT, { mode: 'default' })
    this._forceClosePollutantDataLoading()
    this.removeLandLayer()
    this.removeAirLayer()
    this.removeBasinOutlineLayer()
  },
  methods: {
    /** 污染源栅格：全屏加载；新请求会关掉上一请求的遮罩，避免叠两层 */
    _beginPollutantDataLoading() {
      const prev = this._pollutantDataLoading
      if (prev) {
        try {
          prev.inst.close()
        }
        catch (_) { /* noop */ }
      }
      const token = (this._pollutantDataLoadingGen = (this._pollutantDataLoadingGen || 0) + 1)
      const inst = ElLoading.service({
        lock: true,
        text: '加载中…',
        background: 'rgba(7, 14, 20, 0.85)',
      })
      this._pollutantDataLoading = { token, inst }
      return token
    },
    _endPollutantDataLoading(token) {
      const cur = this._pollutantDataLoading
      if (!cur || cur.token !== token) {
        return
      }
      try {
        cur.inst.close()
      }
      catch (_) { /* noop */ }
      this._pollutantDataLoading = null
    },
    _forceClosePollutantDataLoading() {
      const cur = this._pollutantDataLoading
      if (!cur) {
        return
      }
      try {
        cur.inst.close()
      }
      catch (_) { /* noop */ }
      this._pollutantDataLoading = null
    },
    /** 与 default.json 中 basemaps.name 一致：陆域 TN/TP 浅色二维、大气=污染源大气深蓝 */
    emitPollutantBasemapForType() {
      if (this.type === 'air') {
        eventBus.emit(POLLUTANT_BASEMAP_EVENT, { mode: 'air' })
      }
      else {
        eventBus.emit(POLLUTANT_BASEMAP_EVENT, {
          mode: 'land',
          landType: this.landType === 'tp' ? 'tp' : 'tn',
        })
      }
    },
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
     * opts.emissionColorMax：大气排放色标上界（必选；NH3/NO/NO2 由物种×六源固定上界传入，图例同比例尺）
     * opts.useNh3ReferenceJet：NH₃ 时使用固定 NH3_JET 色带
     * opts.nh3Piecewise：{ breaks, breakNormT, overflowRgb? } 将数值映射到色带；overflowRgb 时 v>cMax 用顶台色；缺省则 t=v/max
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
      const useNh3RefJet = emissionRaster && opts.useNh3ReferenceJet === true
      const nh3Piecewise = (
        useNh3RefJet
        && opts.nh3Piecewise
        && Array.isArray(opts.nh3Piecewise.breaks)
        && opts.nh3Piecewise.breaks.length > 0
        && Array.isArray(opts.nh3Piecewise.breakNormT)
        && opts.nh3Piecewise.breakNormT.length === opts.nh3Piecewise.breaks.length
      )
        ? opts.nh3Piecewise
        : null
      const emissionColorMaxOpt = opts.emissionColorMax
      if (emissionRaster) {
        const req = Number(emissionColorMaxOpt)
        if (!Number.isFinite(req) || req <= 0) {
          throw new Error('PollutantSections: emissionRaster 须传入有效的 opts.emissionColorMax')
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

      /** 大气排放：色标 [0, emissionColorMax]，由 loadAirRaster 传入物种×六源固定上界 */
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
                  ? (useNh3RefJet ? nh3JetRgbComponents(0.5) : airJetRgbComponents(0.5))
                  : airEmissionRgbForValue(v, cMin, cMax, useNh3RefJet, nh3Piecewise)
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
                const { r, g, b } = airEmissionRgbForValue(v, cMin, cMax, useNh3RefJet, nh3Piecewise)
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
              const { r, g, b } = airEmissionRgbForValue(v, cMin, cMax, useNh3RefJet, nh3Piecewise)
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
      const loadToken = this._beginPollutantDataLoading()
      this.airLoading = true
      this.airStats = null
      this.removeAirLayer()
      this.removeLandLayer()
      try {
        const emissionCap = getAirFixedEmissionColorMax(this.airKind, this.airType)
        const fixedLeg = getAirFixedLegendMeta(this.airKind, this.airType)
        if (!Number.isFinite(emissionCap) || emissionCap <= 0 || !fixedLeg) {
          console.warn('PollutantSections: 无固定大气色标/图例配置', this.airKind, this.airType)
          return
        }
        const maskGeom = this.selectedBasinCode ? this.getSelectedBasinGeometry() : null
        const airOpts = {
          scale: 4,
          returnBounds: true,
          emissionRaster: true,
          interpolate: true,
          emissionColorMax: emissionCap,
          useNh3ReferenceJet: this.airKind === 'NH3',
          nh3Piecewise: (
            this.airKind === 'NH3'
            && Array.isArray(fixedLeg.breakNormT)
            && fixedLeg.breakNormT.length === fixedLeg.breaks.length
          )
            ? {
                breaks: fixedLeg.breaks,
                breakNormT: fixedLeg.breakNormT,
                overflowRgb: fixedLeg.nh3OverflowRgb || null,
              }
            : null,
        }
        if (maskGeom && (maskGeom.type === 'Polygon' || maskGeom.type === 'MultiPolygon')) {
          airOpts.basinGeometry = maskGeom
        }
        const result = await this.renderGeoTiffToDataUrl(tifUrl, airOpts)
        if (reqId !== this._airRasterReqId || this.type !== 'air') {
          return
        }
        const dataUrl = (typeof result === 'string') ? result : result.dataUrl
        if (!dataUrl) {
          console.warn('PollutantSections: 大气栅格渲染无数据', tifUrl)
          return
        }
        const airLegendExtras = {}
        if (Number.isFinite(fixedLeg.legendTopPlateauPct)) {
          airLegendExtras.legendTopPlateauPct = fixedLeg.legendTopPlateauPct
        }
        if (this.airKind === 'NH3') {
          if (Array.isArray(fixedLeg.breakNormT)) {
            airLegendExtras.breakNormT = fixedLeg.breakNormT
          }
          if (fixedLeg.nh3OverflowRgb) {
            airLegendExtras.nh3OverflowRgb = fixedLeg.nh3OverflowRgb
          }
        }
        this.airStats = {
          min: fixedLeg.min,
          max: fixedLeg.max,
          breaks: fixedLeg.breaks,
          breaksFormatted: fixedLeg.breaksFormatted,
          ...airLegendExtras,
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
        this._endPollutantDataLoading(loadToken)
        this.airLoading = false
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
      const loadToken = this._beginPollutantDataLoading()
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
        this._endPollutantDataLoading(loadToken)
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
          <el-select v-model="landMonth" style="margin-left: 8px;">
            <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
        <template v-else>
          <el-select v-model="airSeason" style="margin-right: 8px;">
            <el-option v-for="item in seasons" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="airKind">
            <el-option v-for="item in kinds" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="airType" style="margin-left: 8px;">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
            <div
              class="air-legend-vbar air-legend-vbar--gradient"
              :style="airLegendVBarStyle"
            />
          </div>
          <div class="air-legend-break-axis">
            <div
              v-for="(row, idx) in airLegendBreakTicks"
              :key="idx"
              class="air-legend-break-tick"
              :class="row.tickClass"
              :style="row.tickStyle"
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

  .air-legend-vertical-box {
    margin-top: 6px;
  }

  /* 高度须与脚本中 AIR_LEGEND_VBAR_HEIGHT_PX 一致（NH3 刻度 inset 计算） */
  .air-legend-bar-and-ticks {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 220px;
    column-gap: 0;
  }

  .air-legend-vbar-track {
    flex-shrink: 0;
    display: flex;
    align-items: stretch;
  }

  .air-legend-vbar {
    width: 20px;
    height: 220px; /* AIR_LEGEND_VBAR_HEIGHT_PX */
    border: 1px solid rgba(0, 0, 0, 0.14);
    box-sizing: border-box;

    &--gradient {
      border-radius: 0;
      flex-shrink: 0;
      /* 不用 border 占高度，渐变与右侧刻度同属 220px，避免 padding-box 比色条「矮 2px」 */
      border: none;
      box-sizing: border-box;
      background-origin: border-box;
      background-position: center;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.14);
    }
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
    height: 220px; /* AIR_LEGEND_VBAR_HEIGHT_PX */
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
    font-size: 11px;
    line-height: 1.2;
  }

  .air-legend-break-tick--edge-top {
    align-items: center;
  }

  .air-legend-break-tick--edge-bottom {
    align-items: center;
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
