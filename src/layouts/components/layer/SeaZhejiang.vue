<script>
let _layer = null

export default {
  name: 'LayerSeaZhejiang',
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
        _layer = new window.$ZMap.layer.GeoJsonLayer({
          id: 2002,
          zIndex: 2002,
          name: '浙江省海域',
          url: 'file/json/sea_zhejiang.json',
          allowDrillPick: true,
          symbol: {
            styleOptions: {
              fillColor: '#3388ff',
              fillOpacity: 0.2,
              outline: true,
              outlineColor: '#3388ff',
              outlineWidth: 2,
            },
          },
        })

        window.$zMap.addLayer(_layer)
        _layer.on(window.$ZMap.EventType.load, (e) => {
          e.graphics.forEach((graphic) => {
            if (graphic.center && graphic.attr && graphic.attr.name) {
              const label = new window.$ZMap.graphic.Label({
                latlng: graphic.center,
                style: {
                  text: graphic.attr.name,
                  color: '#ffffff',
                  font_size: 12,
                  font_family: '楷体',
                  border: true,
                  border_width: 1,
                  border_style: '',
                  border_color: '#000000',
                  className: 'label-name',
                },
              })
              _layer.addGraphic(label)
            }
          })
          _layer.show = true
        })
      }
    },
  },
}
</script>

<template>
  <div />
</template>
