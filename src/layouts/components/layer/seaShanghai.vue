<script>
let _layer = null

export default {
  name: 'LayerSeaShanghai',
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
          id: 2000,
          zIndex: 2000,
          name: '上海市海域',
          url: '/file/json/sea_shanghai.json',
          symbol: {
            styleOptions: {
              fillColor: '#3388ff',
              fillOpacity: 0.2,
              outline: true,
              outlineColor: '#3388ff',
              outlineOpacity: 0.5,
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
          setTimeout(() => {
            _layer.show = true
          }, 1000)
        })
      }
    },
  },
}
</script>

<template>
  <div />
</template>
