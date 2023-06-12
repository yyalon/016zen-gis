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
        _layer = new window.$ZMap.layer.GeoJsonLayer({
          id: 1100,
          zIndex: 1100,
          name: '上海市陆域',
          url: 'file/json/land_shanghai.json',
          allowDrillPick: true,
          symbol: {
            styleOptions: {
              fillColor: '#08e129',
              fillOpacity: 0.2,
              outline: true,
              outlineColor: '#08e129',
              outlineOpacity: 0.5,
              outlineWidth: 2,
            },
          },
        })
        window.$zMap.addLayer(_layer)
        _layer.on(window.$ZMap.EventType.mouseover, (event) => {
          const graphic = event.layer
          graphic.setStyle({
            fillOpacity: 0.3,
          })
        })

        _layer.on(window.$ZMap.EventType.mouseout, (event) => {
          const graphic = event.layer
          graphic.setStyle({
            fillOpacity: 0.2,
          })
        })
        _layer.on(window.$ZMap.EventType.load, (e) => {
          const names = []
          e.graphics.forEach((graphic) => {
            if (graphic.center && graphic.attr && graphic.attr.name) {
              if (!names.includes(graphic.attr.name)) {
                names.push(graphic.attr.name)
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
