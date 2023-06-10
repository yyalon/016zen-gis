<script>
const layers = {}

const riverLevels = [
  { value: 1, label: '一级河流' },
  { value: 23, label: '二级,三级河流' },
  { value: 4, label: '四级河流' },
  { value: 5, label: '五级河流' },
]

export default {
  data() {
    return { riverLevels, riverLevel: 4 }
  },
  watch: {
    riverLevel() {
      this.showLayer()
    },
  },
  mounted() {
    this.showLayer()
  },
  unmounted() {
    for (const key in layers) {
      layers[key].show = false
    }
  },
  methods: {
    showLayer() {
      const name = `river${this.riverLevel}`
      for (const key in layers) {
        layers[key].show = false
      }
      if (layers[name]) {
        layers[name].show = true
      }
      else {
        const loading = this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })
        const tileLayer = new window.$ZMap.layer.GeoJsonLayer({
          zIndex: 4001,
          name: '河流',
          url: `file/json/${name}.json`,
          tooltip(event) {
            const attr = event.graphic?.attr
            if (attr.NAME) {
              return attr.NAME
            }
          },
          symbol: {
            styleOptions: {
              width: 2,
              arcType: window.$Cesium.ArcType.GEODESIC,
              fill: true,
              color: '#0000ff',
              opacity: 0.4,
              distanceDisplayCondition: true,
              distanceDisplayCondition_far: 1000000,
              distanceDisplayCondition_near: 0,
              highlight: {
                type: window.$ZMap.EventType.mouseOver,
                width: 6,
                opacity: 0.8,
              },
              label: {
                text: '{NAME}',
                opacity: 1,
                font_size: 12,
                color: '#000',

                font_family: '微软雅黑',
                outline: false,
                outlineColor: '#3388cc',
                outlineWidth: 2,

                background: true,
                backgroundColor: '#fff',
                backgroundOpacity: 0.8,

                font_weight: 'normal',
                font_style: 'normal',

                // scaleByDistance: true,
                // scaleByDistance_far: 2000000,
                // scaleByDistance_farValue: 0,
                // scaleByDistance_near: 300000,
                // scaleByDistance_nearValue: 1,

                distanceDisplayCondition: true,
                distanceDisplayCondition_far: 500000,
                distanceDisplayCondition_near: 0,
                visibleDepth: false,
              },
            },
          },
        })
        tileLayer.on(window.$ZMap.EventType.load, () => {
          setTimeout(() => {
            tileLayer.show = true
            loading.close()
          }, 500)
        })
        setTimeout(() => {
          window.$zMap.addLayer(tileLayer)
        }, 1000)
        layers[name] = tileLayer
      }
    },
  },
}
</script>

<template>
  <div>
    <div class="filters">
      <el-select v-model="riverLevel" placeholder="请选择河流等级">
        <el-option v-for="item in riverLevels" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filters {
  padding: 10px;

  :deep .el-select {
    margin-right: 10px;
    width: 140px;

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
