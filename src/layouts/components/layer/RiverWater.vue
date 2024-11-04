<script>
import DrawerRiverSection from '../drawer/RiverSection.vue'
import PopupRiverSection from '../popup/RiverSection.vue'

import apiData from '@/api/modules/data'
import eventBus from '@/utils/eventBus'

let _layer = null

export default {
  components: { DrawerRiverSection },
  data() {
    return { riverSections: [], drawerVisible: false, drawerData: {}, markersMap: null, selectCode: null }
  },
  async mounted() {
    eventBus.on('selectRiverByCode', ({ selectCode }) => {
      this.zoomToMarkerByCode(selectCode)
    })

    await this.showLayer()
  },
  unmounted() {
    if (_layer) {
      _layer.show = false
    }
  },
  methods: {
    async getData() {
      const allRivers = await apiData.getRiverSections()
      if (allRivers && allRivers.code === 1000) {
        this.riverSections = allRivers.data
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

        this.markersMap = new Map()

        this.riverSections.forEach((riverSection) => {
          const arr = ['Ⅰ', 'Ⅱ', 'Ⅲ']
          // const compliant = arr.includes(riverSection?.level2018)
          // let noDabiao = false
          // if (parseFloat(riverSection.N2023) > parseFloat(riverSection.N2025) || romanToInt(riverSection.W2023) > romanToInt(riverSection.W2025)) {
          //   // 不达标
          //   noDabiao = true
          // }
          let image = 'img/marker/river.png'
          if (riverSection.status === '1') {
            image = 'img/marker/river_red.png'
          }
          else if (riverSection.status === '2') {
            image = 'img/marker/river_red_blinking.gif'
          }
          // const compliant = this.dictWaterQuality[riverSection.code]?.compliant
          const graphic = new window.$ZMap.graphic.Marker({
            latlng: [riverSection.latitude, riverSection.longitude],
            style: {
              image,
              horizontalOrigin: window.$ZMap.HorizontalOrigin.CENTER,
              verticalOrigin: window.$ZMap.VerticalOrigin.BOTTOM,
            },
            attr: riverSection,
            id: riverSection.code,
          })

          // 将Marker添加到Map对象中
          this.markersMap.set(riverSection.code, graphic)

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
    zoomToMarkerByCode(selectCode) {
      if (this.markersMap) {
        if (this.selectCode) {
          const selectedMarker = this.markersMap.get(this.selectCode)
          selectedMarker.setStyle({
            opacity: 1,
          })
        }
        const selectedMarker = this.markersMap.get(selectCode)
        if (selectedMarker) {
          this.selectCode = selectCode
          selectedMarker.setStyle({
            opacity: 0.5,
          })
          window.$zMap.setView(selectedMarker.getLatLng(), 10)
        }
      }
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
