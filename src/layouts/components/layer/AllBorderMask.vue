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
        let loading = this.$loading({
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
          show: false,
          interactive: false,
          symbol: {
            styleOptions: {
              fill: true,
              fillColor: '#C0C0C0',
              fillOpacity: 0.6,
              outline: true,
              outlineColor: 'green',
              outlineWidth: 20,
              outlineOpacity: 0.2,
            },
          },
        })

        _layer.on(window.$ZMap.EventType.load, (e) => {
          loading = this.$loading({
            lock: true,
            text: '正在加载地图数据...',
            spinner: 'el-icon-loading',
            background: '#100d17e3',
          })
          setTimeout(() => {
            if (!buffered) {
              buffered = true
              const bufferedGeoJSON = featureCollection([buffer(e.geojson, 20, { units: 'kilometers' })])
              _layer.load({ data: bufferedGeoJSON, mask: true })
            }
            else {
              _layer.show = true
              loading.close()
            }
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
