<script>
import PopupRiverSection from '../popup/RiverSection.vue'
import apiData from '@/api/modules/data'

const _layers = {}

const sectionTypes = [
  { value: 135, label: '"十三五"国家地表水环境质量监测断面' },
  { value: 145, label: '"十四五"全国重点流域断面' },
]

export default {
  components: {},
  data() {
    return { sectionTypes, sectionType: 145, riverSections: [] }
  },
  watch: {
    sectionType() {
      this.showLayer()
    },
  },
  async mounted() {
    await this.showLayer()
  },
  unmounted() {
    for (const key in _layers) {
      _layers[key].show = false
    }
  },
  methods: {
    async getData() {
      if (this.sectionType === 135) {
        const { code, data } = await apiData.get135RiverSections()
        if (code === 1000) {
          this.riverSections = data
        }
      }
      else {
        const { code, data } = await apiData.get145RiverSections()
        if (code === 1000) {
          this.riverSections = data
        }
      }
    },
    async showLayer() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载地图数据...',
        spinner: 'el-icon-loading',
        background: '#100d17e3',
      })
      for (const key in _layers) {
        _layers[key].show = false
      }
      if (_layers[this.sectionType]) {
        _layers[this.sectionType].show = true
      }
      else {
        _layers[this.sectionType] = new window.$ZMap.layer.ClusterLayer({
          show: false,
          chunkedLoading: true, // 间隔添加数据，以便页面不冻结。
          showCoverageOnHover: false, // 是否显示聚合标记的边界。
          disableClusteringAtZoom: 18, // 此级别下不聚合
        })
        window.$zMap.addLayer(_layers[this.sectionType])

        await this.getData()

        for (let i = 0, len = this.riverSections.length; i < len; i++) {
          const item = this.riverSections[i]
          const graphic = new window.$ZMap.graphic.Marker({
            latlng: [item.latitude, item.longitude],
            style: {
              image: '/img/marker/river.png',
              horizontalOrigin: window.$ZMap.HorizontalOrigin.CENTER,
              verticalOrigin: window.$ZMap.VerticalOrigin.BOTTOM,
            },
            attr: item,
          })

          graphic.bindTooltip(null, {
            className: 'custom_popup',
          })

          graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
            e.target.setTooltipContent(window.$ZMap.loadComponentContent(e.target, PopupRiverSection, { popupData: e.target.attr }))
          })

          graphic.on(window.$ZMap.EventType.popupclose, (e) => {
            window.$ZMap.unloadComponentContent(e.target)
          })

          _layers[this.sectionType].addGraphic(graphic)
        }
      }

      setTimeout(() => {
        _layers[this.sectionType].show = true
        loading.close()
      }, 500)
    },
  },
}
</script>

<template>
  <div>
    <div class="river-sections">
      <el-radio-group v-model="sectionType" size="large">
        <el-radio-button v-for="(item, index) in sectionTypes" :key="index" :label="item.value">
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<style>
.custom_popup {
  min-width: 300px;
  max-width: 400px;
}
</style>

<style lang="scss" scoped>
.river-sections {
  text-align: center;
  pointer-events: auto;
}
</style>
