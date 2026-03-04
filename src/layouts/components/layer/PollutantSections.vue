<script>
import { fromUrl } from 'geotiff'

// 陆域栅格范围（与 /file/pollutant/land/*.tif.xml 中 nativeExtBox 一致）
const LAND_RASTER_BOUNDS = [
  [27.044745, 118.023019], // southWest [lat, lng]
  [31.178078, 122.948019], // northEast [lat, lng]
]

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

export default {
  data() {
    return {
      type: 'land',
      landType: 'tn',
      months,
      landMonth: 1,
      landLayer: null,
      loading: false,
    }
  },
  watch: {
    landType() {
      this.loadLandRaster()
    },
    landMonth() {
      this.loadLandRaster()
    },
  },
  mounted() {
    if (this.type === 'land' && window.$zMap) {
      this.loadLandRaster()
    }
  },
  beforeUnmount() {
    this.removeLandLayer()
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
    onTypeChange() {
      if (this.type === 'land' && window.$zMap) {
        this.loadLandRaster()
      }
      else {
        this.removeLandLayer()
      }
    },
    async loadLandRaster() {
      if (!window.$zMap || this.type !== 'land') {
        return
      }
      const url = this.getTifUrl()
      this.loading = true
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
        this.loading = false
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
          <el-select v-model="landMonth" style="margin-left: 8px;" :loading="loading">
            <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
}
</style>
