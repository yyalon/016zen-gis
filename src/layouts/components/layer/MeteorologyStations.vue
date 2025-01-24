<script>
import drawerMeteorologyStation from '../drawer/MeteorologyStation.vue'
import PopupMeteorologyStation from '../popup/MeteorologyStation.vue'
import apiData from '@/api/modules/data'
import eventBus from '@/utils/eventBus'

let _layer = null

export default {
  components: { DrawerMeteorologyStation: drawerMeteorologyStation },
  data() {
    return {
      meteorologyStations: [],
      drawerVisible: false,
      drawerData: {},
      selectedMarker: null,
      code: null,
    }
  },
  async mounted() {
    eventBus.on('selecMeteorolog', ({ code }) => {
      this.zoomToMarker(code)
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
      const { code, data } = await apiData.getMeteorologyStations()
      if (code === 1000) {
        this.meteorologyStations = data
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
        this.markersMap = new Map()
        _layer = new window.$ZMap.layer.ClusterLayer({
          show: false,
          chunkedLoading: true, // 间隔添加数据，以便页面不冻结。
          showCoverageOnHover: false, // 是否显示聚合标记的边界。
          disableClusteringAtZoom: 7, // 此级别下不聚合
        })
        window.$zMap.addLayer(_layer)

        await this.getData()

        for (let i = 0, len = this.meteorologyStations.length; i < len; i++) {
          const item = this.meteorologyStations[i]

          if (item.LON && item.LAT) {
            const graphic = new window.$ZMap.graphic.Point({
              latlng: [item.LAT, item.LON],
              style: {
                pixelSize: 6,
                color: '#00ffff',
                opacity: 0.6,
                outline: true,
                outlineWidth: 1,
                outlineColor: '#00ff00',
                outlineOpacity: 1.0,
              },
              attr: item,
            })

            graphic.bindTooltip(null, {
              className: 'custom_tooltip',
            })

            graphic.on(window.$ZMap.EventType.click, (e) => {
              this.drawerData = e.target.attr
              this.drawerVisible = true
            })

            graphic.on(window.$ZMap.EventType.tooltipopen, async (e) => {
              e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupMeteorologyStation, { popupData: e.target.attr }))
            })

            graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
              window.$Utitls.unloadComponentContent(e.target)
            })

            _layer.addGraphic(graphic)
            this.markersMap.set(item.STATION_NAME, graphic)
          }
        }
      }

      setTimeout(() => {
        _layer.show = true
        loading.close()
      }, 500)
    },
    zoomToMarker(code) {
      if (this.markersMap) {
        if (this.code) {
          const selectedMarker = this.markersMap.get(this.code)
          selectedMarker.setStyle({
            pixelSize: 3,
            color: '#00ffff',
            opacity: 0.6,
            outline: true,
            outlineWidth: 1,
            outlineColor: '#00ff00',
            outlineOpacity: 1.0,
          })
          this.code = null
        }
        if (code) {
          const selectedMarker = this.markersMap.get(code)

          if (selectedMarker) {
            this.code = code
            const color = 'rgba(255, 53, 53, 0.8)'
            selectedMarker.setStyle({
              pixelSize: 10,
              color: '#00ffff',
              opacity: 0.6,
              outline: true,
              outlineWidth: 1,
              outlineColor: color,
              outlineOpacity: 1.0,
            })
            window.$zMap.setView(selectedMarker.getLatLng(), 10)
          }
        }
      }
    },
  },
}
</script>

<template>
  <div>
    <DrawerMeteorologyStation :drawer-data="drawerData" :visible="drawerVisible" @close="drawerVisible = false" />
  </div>
</template>

<style>
.custom_tooltip {
  width: auto;
}
</style>
