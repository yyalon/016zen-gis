<script>
import DrawerRiverSection from '../drawer/RiverSection.vue'
import PopupRiverSection from '../popup/RiverSection.vue'

import apiData from '@/api/modules/data'

import { romanToInt } from '@/utils'

let _layer = null

export default {
  components: { DrawerRiverSection },
  data() {
    return { riverSections: [], drawerVisible: false, drawerData: {} }
  },
  async mounted() {
    await this.showLayer()
  },
  unmounted() {
    if (_layer) {
      _layer.show = false
    }
  },
  methods: {
    async getData() {
      this.loadingRiverSections = true
      const res = await apiData.getWaterQuality()
      if (res && res.code === 1000) {
        this.riverSections = res.data
      }

      const allRivers = await apiData.getRiverSections()
      if (res && res.code === 1000) {
        this.riverSections = this.riverSections.concat(allRivers.data)
      }
    },
    async showLayer() {
      this.loading = this.$loading({
        lock: true,
        text: '正在加载地图数据...',
        spinner: 'el-icon-loading',
        background: '#100d17e3',
      })
      if (_layer) {
        _layer.show = true
      }
      else {
        _layer = new window.$ZMap.layer.ClusterLayer({
          show: false,
          chunkedLoading: true, // 间隔添加数据，以便页面不冻结。
          showCoverageOnHover: false, // 是否显示聚合标记的边界。
          disableClusteringAtZoom: 18, // 此级别下不聚合
        })
        window.$zMap.addLayer(_layer)

        await this.getData()

        this.riverSections.forEach((riverSection) => {
          const arr = ['Ⅰ', 'Ⅱ', 'Ⅲ']
          // const compliant = arr.includes(riverSection?.level2018)
          let noDabiao = false
          if (parseFloat(riverSection.N2023) > parseFloat(riverSection.N2025) || romanToInt(riverSection.W2023) > romanToInt(riverSection.W2025)) {
            // 不达标
            noDabiao = true
          }
          // const compliant = this.dictWaterQuality[riverSection.code]?.compliant
          const graphic = new window.$ZMap.graphic.Marker({
            latlng: [riverSection.latitude, riverSection.longitude],
            style: {
              image: !noDabiao ? 'img/marker/river.png' : 'img/marker/river_red.png',
              horizontalOrigin: window.$ZMap.HorizontalOrigin.CENTER,
              verticalOrigin: window.$ZMap.VerticalOrigin.BOTTOM,
            },
            attr: riverSection,
          })

          graphic.bindTooltip(null, {
            className: 'custom_tooltp',
          })

          graphic.on(window.$ZMap.EventType.click, (e) => {
            this.drawerData = e.target.attr
            this.drawerVisible = true
          })

          graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
            e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupRiverSection, { popupData: e.target.attr }))
          })

          graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
            window.$Utitls.unloadComponentContent(e.target)
          })

          _layer.addGraphic(graphic)
        })
        if (this.riverSections.length > 0) {
          window.$zMap.fitBounds(_layer.getBounds(), { padding: [80, 80], duration: 5 })
        }
      }

      setTimeout(() => {
        _layer.show = true
        this.loading.close()
      }, 500)
    },
  },
}
</script>

<template>
  <div>
    <DrawerRiverSection :drawer-data="drawerData" :visible="drawerVisible" @close="drawerVisible = false" />
  </div>
</template>

<style>
.custom_tooltip {
  width: auto;
}
</style>
