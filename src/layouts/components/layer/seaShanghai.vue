<script>
let layerSeaShanghai = null

export default {
  name: 'LayerSeaShanghai',
  props: {

  },
  data() {
    return {}
  },
  watch: {
  },
  mounted() {
    this.showLayer()
  },
  unmounted() {
    if (layerSeaShanghai) {
      layerSeaShanghai.show = false
    }
  },
  methods: {
    showLayer() {
      if (layerSeaShanghai) {
        layerSeaShanghai.show = true
      }
      else {
        const loading = this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })

        const layer = new window.$ZMap.layer.GeoJsonLayer({
          name: '上海市海域',
          url: 'file/json/sea_shanghai.json',
          symbol: {
            styleOptions: {
              fill: true,
              randomColor: true, // 随机色
              opacity: 0.3,
              outline: true,
              outlineStyle: {
                color: 'blue',
                width: 3,
                opacity: 1,
              },
              // 高亮时的样式
              highlight: {
                opacity: 0.9,
              },
              label: {
                // 面中心点，显示文字的配置
                text: '{name}', // 对应的属性名称
                opacity: 1,
                font_size: 40,
                color: '#ffffff',

                font_family: '楷体',
                outline: true,
                outlineColor: '#000000',
                outlineWidth: 3,

                background: false,
                backgroundColor: '#000000',
                backgroundOpacity: 0.1,

                font_weight: 'normal',
                font_style: 'normal',

                scaleByDistance: true,
                scaleByDistance_far: 20000000,
                scaleByDistance_farValue: 0.1,
                scaleByDistance_near: 1000,
                scaleByDistance_nearValue: 1,
                clampToGround: true,
              },
            },
          },
          flyTo: true,
        })
        layer.on(window.$ZMap.EventType.load, () => {
          setTimeout(() => {
            layer.show = true
            loading.close()
          }, 1000)
        })
        window.$zMap.addLayer(layer)
        layerSeaShanghai = layer
      }
    },
  },
}
</script>
