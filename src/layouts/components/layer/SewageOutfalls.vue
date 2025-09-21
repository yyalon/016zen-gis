<script>
import drawerSewageOutfall from '../drawer/SewageOutfall.vue'
import PopupSweageOutfall from '../popup/SweageOutfall.vue'
import apiData from '@/api/modules/data'
import eventBus from '@/utils/eventBus'

let _layer = null

export default {
  components: { DrawerSewageOutfall: drawerSewageOutfall },
  data() {
    return {
      sewageOutfalls: [],
      drawerVisible: false,
      drawerData: {},
      markersMap: null,
      selectCode: null,
    }
  },
  async mounted() {
    eventBus.on('filterparam', async (params) => {
      await this.getData(params)
    })

    eventBus.on('selectOutfallByCode', ({ selectCode }) => {
      this.zoomToMarkerByCode(selectCode)
    })

    await this.showLayer()
  },
  unmounted() {
    if (_layer) {
      _layer.show = false
    }
    eventBus.off('filterparam')
    eventBus.off('selectOutfallByCode')
  },
  methods: {
    async getData(params) {
      const { code, data } = await apiData.getSewageOutfalls(params)
      if (code === 1000) {
        this.sewageOutfalls = data

        _layer.eachGraphic((graphic) => {
          _layer.removeGraphic(graphic)
        })

        this.markersMap = new Map()

        for (let i = 0, len = this.sewageOutfalls.length; i < len; i++) {
          const item = this.sewageOutfalls[i]

          if (item.longitude && item.latitude) {
            const graphic = new window.$ZMap.graphic.Marker({
              latlng: [item.latitude, item.longitude],
              style: {
                image: 'img/marker/sewage_outfall.png',
                horizontalOrigin: window.$ZMap.HorizontalOrigin.CENTER,
                verticalOrigin: window.$ZMap.VerticalOrigin.BOTTOM,
              },
              attr: item,
              id: item.code,
            })

            // 将Marker添加到Map对象中
            this.markersMap.set(item.code, graphic)

            graphic.bindTooltip(null, {
              className: 'custom_tooltp',
            })
            graphic.on(window.$ZMap.EventType.click, (e) => {
              this.drawerData = e.target.attr
              this.drawerVisible = true
            })
            graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
              e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupSweageOutfall, { popupData: e.target.attr }))
            })

            graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
              window.$Utitls.unloadComponentContent(e.target)
            })

            _layer.addGraphic(graphic)
          }
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
      if (_layer) {
        _layer.show = true
      }
      else {
        _layer = new window.$ZMap.layer.ClusterLayer({
          show: false,
          chunkedLoading: true, // 间隔添加数据，以便页面不冻结。
          showCoverageOnHover: false, // 是否显示聚合标记的边界。
          disableClusteringAtZoom: 8, // 此级别下不聚合
        })
        window.$zMap.addLayer(_layer)

        await this.getData()
      }

      setTimeout(() => {
        _layer.show = true
        loading.close()
      }, 500)
    },
    zoomToMarkerByCode(selectCode) {
      if (this.markersMap) {
        if (this.selectCode) {
          const selectedMarker = this.markersMap.get(this.selectCode)
          selectedMarker.setStyle({
            width: 40,
            pulse: false,
            className: '',
          })
          this.selectCode = null
        }
        if (selectCode) {
          const selectedMarker = this.markersMap.get(selectCode)
          if (selectedMarker) {
            this.selectCode = selectCode

            const color = 'rgba(255, 53, 53, 0.8)'

            selectedMarker.setStyle({
              width: 15,
              pulse: true,
              pulseColor: color,
              pulseShadowColor: color,
              className: selectedMarker.options.attr?.status === 2 ? 'blinking-marker' : '',
            })
            window.$zMap.setView(selectedMarker.getLatLng(), 12)
          }
        }
      }
    },
  },
}
</script>

<template>
  <div>
    <DrawerSewageOutfall :drawer-data="drawerData" :visible="drawerVisible" @close="drawerVisible = false" />
  </div>
</template>

<style>
.custom_tooltip {
  width: auto;
}
</style>
