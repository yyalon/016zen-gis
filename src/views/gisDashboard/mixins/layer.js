export default {
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.initLayer()
    })
  },
  beforeDestroy() {
    if (this.graphicLayer) {
      this.graphicLayer.clear()
      this.$zMap.removeLayer(this.graphicLayer, true)
      this.graphicLayer = null
    }

    this.$zMap.Event.$emit('CLOSE_POPUP')
  },
  methods: {
    addIcon(item) {
      const entity = {
        ...{
          style: {
            image: this.$ZMap.Util.getCircleImage(' ', {
              color: item.color ? item.color : 'blue',
              radius: item.radius ? item.radius : 14
            }),
            scale: 1,
            scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 600000, 0.3),
            horizontalOrigin: this.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM
            // clampToGround: true
          },
          tooltipOptions: { offsetY: -40 }
        },
        ...item
      }
      const icon = new this.$ZMap.graphic.BillboardPrimitive(entity)
      this.graphicLayer.addGraphic(icon)
    },
    initLayer() {
      this.graphicLayer = new this.$ZMap.layer.GraphicLayer()
      this.$zMap.addLayer(this.graphicLayer)
    }
  }
}
