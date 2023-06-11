<script>
import { buffer, featureCollection } from '@turf/turf'

let _layer = null
let buffered = false

export default {
  name: 'LayerAllBorder',
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
          id: 3001,
          name: '全域边界',
          url: 'file/json/all_border.json',
          mask: true,
          symbol: {
            styleOptions: {
              fill: true,
              color: '#444444',
              opacity: 0.3,
              outline: true,
              outlineStyle: {
                color: '#444444',
                width: 4,
                opacity: 0.3,
              },
            },
          },
        })

        _layer.on(window.$ZMap.EventType.load, (e) => {
          setTimeout(() => {
            _layer.show = true
            if (!buffered) {
              buffered = true
              const bufferedGeoJSON = featureCollection([buffer(e.geojson, 10, { units: 'kilometers' })])
              _layer.load({ data: bufferedGeoJSON, mask: true })
            }
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
