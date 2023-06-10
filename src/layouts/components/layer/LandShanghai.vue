<script>
let _layer = null

export default {
  name: 'LayerLandShanghai',
  mounted() {
    this.showLayer()
  },
  unmounted() {
    if (_layer) {
      _layer.show = false
    }
  },
  methods: {
    showLayer() {
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

        _layer = new window.$ZMap.layer.GeoJsonLayer({
          id: 1100,
          zIndex: 1100,
          name: '上海市陆域',
          url: 'file/json/land_shanghai.json',
          allowDrillPick: true,
          symbol: {
            styleOptions: {
              fill: true,
              color: '#08e129',
              opacity: 0.1,
              outline: true,
              outlineStyle: {
                color: '#08e129',
                width: 2,
                opacity: 0.9,
              },
              label: {
                text: '{name}',
                opacity: 1,
                font_size: 20,
                color: '#ffffff',

                font_family: '微软雅黑',
                outline: true,
                outlineColor: '#000000',
                outlineWidth: 4,

                background: false,
                backgroundColor: '#000000',
                backgroundOpacity: 0.1,

                font_weight: 'normal',
                font_style: 'normal',

                scaleByDistance: true,
                scaleByDistance_far: 2000000,
                scaleByDistance_farValue: 0.4,
                scaleByDistance_near: 1000,
                scaleByDistance_nearValue: 1,

                distanceDisplayCondition: true,
                distanceDisplayCondition_far: 1000000,
                distanceDisplayCondition_near: 0,
                visibleDepth: false,
              },
            },
          },
        })

        _layer.on(window.$ZMap.EventType.load, () => {
          setTimeout(() => {
            _layer.show = true
            loading.close()
          }, 1000)
        })
        setTimeout(() => {
          window.$zMap.addLayer(_layer)
        }, 1000)
      }
    },
  },
}
</script>

<template>
  <div />
</template>
