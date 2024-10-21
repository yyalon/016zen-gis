<script>
import PopupControlUnit from '../popup/ControlUnit.vue'

let _layer = null

export default {
  async mounted() {
    this.showLayer()
  },
  unmounted() {
    if (_layer) {
      _layer.show = false
    }
  },
  methods: {
    showLayer() {
      const name = 'controlUnit'
      if (_layer) {
        _layer.show = true
      }
      else {
        const loading = this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })

        const tileLayer = new window.$ZMap.layer.GeoJsonLayer({
          zIndex: 1,
          name: 'layerControlUnit',
          url: '/file/json/controlUnit1.json',
          symbol: {
            styleOptions: {
              width: 3,
              color: '#ffff56',
              fillColor: '#ffff56',
              fillOpacity: 0.2,
              outlineColor: '#ffff56',
              opacity: 1,
              outlineWidth: 2,
            },
          },
        })
        window.$zMap.addLayer(tileLayer)
        tileLayer.on(window.$ZMap.EventType.load, (e) => {
          setTimeout(() => {
            const names = []
            e.graphics.forEach((graphic) => {
              console.log(graphic)
              graphic.bindTooltip(null, {
                className: 'custom_tooltip',
              })
              graphic.on(window.$ZMap.EventType.tooltipopen, async (e) => {
                e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupControlUnit, { popupData: e.target.attr }))
              })

              graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
                window.$Utitls.unloadComponentContent(e.target)
              })
            })
            tileLayer.show = true
            loading.close()
          }, 500)
        })
        _layer = tileLayer
      }
    },
  },
}
</script>

<template>
  <div />
</template>

<style>
.label-river-name {
  background: #ffc500cf;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>

<style lang="scss" scoped>
.filters {
  padding: 10px;

  :deep(.el-select) {
    margin-right: 10px;
    min-width: 140px;

    &:hover .el-input__wrapper {
      box-shadow: none;
      border: 1px solid #72b3f0;
    }

    .el-input__wrapper {
      border: 1px solid #64b4ff;
      background: #070e14;
      color: #64b4ff;
      box-shadow: none;
    }

    .el-input__inner {
      cursor: pointer;
      color: #64b4ff;
    }
  }
}
</style>
