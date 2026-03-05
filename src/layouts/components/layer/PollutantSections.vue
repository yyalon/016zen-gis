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
    /** 将 GeoTIFF 栅格数据绘制到 canvas，返回 PNG data URL（灰阶，与行政图不冲突） */
    async renderGeoTiffToDataUrl(tifUrl) {
      const tiff = await fromUrl(tifUrl)
      const image = await tiff.getImage()
      const width = image.getWidth()
      const height = image.getHeight()
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
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      const imgData = ctx.createImageData(width, height)
      for (let i = 0; i < data.length; i++) {
        const v = data[i]
        const isNoData = v === noData || !isFinite(v) || v <= dataThreshold
        const t1 = isNoData ? 0 : Math.max(0, Math.min(1, (v - min) / range))
        const gray = Math.round(t1 * 255)
        const alpha = isNoData ? 0 : 255
        imgData.data[i * 4] = gray
        imgData.data[i * 4 + 1] = gray
        imgData.data[i * 4 + 2] = gray
        imgData.data[i * 4 + 3] = alpha
      }
      ctx.putImageData(imgData, 0, 0)
      return canvas.toDataURL('image/png')
    },
    /** 大气预生成 TIF 路径，命名 {airKind}_{airType}.tif */
    getAirTifUrl() {
      return `${AIR_CSV_BASE}/${this.airKind}_${this.airType}.tif`
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
        const dataUrl = await this.renderGeoTiffToDataUrl(tifUrl)
        const bounds = window.$ZMap.L.latLngBounds(
          window.$ZMap.L.latLng(AIR_RASTER_BOUNDS[0][0], AIR_RASTER_BOUNDS[0][1]),
          window.$ZMap.L.latLng(AIR_RASTER_BOUNDS[1][0], AIR_RASTER_BOUNDS[1][1]),
        )
        this.airLayer = new window.$ZMap.layer.ImageLayer({
          url: dataUrl,
          bounds,
          name: 'airPollutantRaster',
          opacity: 0.5,
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
