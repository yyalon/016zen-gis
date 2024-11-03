<script>
import drawerSewageOutfall from '../drawer/SewageOutfall.vue'
import PopupRiverChannel from '../popup/RiverChannel.vue'
import apiData from '@/api/modules/data'

let _layer = null

export default {
  components: { DrawerSewageOutfall: drawerSewageOutfall },
  data() {
    return { riverChannels: [], drawerVisible: false, drawerData: {} }
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
      const { code, data } = await apiData.getRiverChannels()
      if (code === 1000) {
        this.riverChannels = data
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
          disableClusteringAtZoom: 7, // 此级别下不聚合
        })
        window.$zMap.addLayer(_layer)

        await this.getData()

        for (let i = 0, len = this.riverChannels.length; i < len; i++) {
          const item = this.riverChannels[i]
          if (item.JD && item.WD) {
            const graphic = new window.$ZMap.graphic.Point({
              latlng: [item.WD, item.JD],
              style: {
                pixelSize: 3,
                color: '#ff5252',
                opacity: 0.6,
                outline: true,
                outlineWidth: 1,
                outlineColor: '#ff5252',
                outlineOpacity: 1.0,
              },
              attr: item,
            })
            graphic.bindTooltip(null, {
              className: 'custom_tooltip',
            })

            // graphic.on(window.$ZMap.EventType.click, (e) => {
            //   this.drawerData = e.target.attr
            //   this.drawerVisible = true
            // })

            graphic.on(window.$ZMap.EventType.tooltipopen, async (e) => {
              e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupRiverChannel, { popupData: e.target.attr }))
            })

            graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
              window.$Utitls.unloadComponentContent(e.target)
            })

            _layer.addGraphic(graphic)
          }
        }
      }

      setTimeout(() => {
        _layer.show = true
        loading.close()
      }, 500)
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
