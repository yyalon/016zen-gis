<script>
import api from '@/api/modules/data'

const layers = {}

const nameLayers = {}

const riverLevels = [
  { value: '1p', label: '一级河流' },
  { value: '23p', label: '二级,三级河流' },
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
  async mounted() {
    const result = await api.get135RiverSections()
    this.showLayer()
  },
  unmounted() {
    for (const key in layers) {
      layers[key].show = false
    }
    for (const key in nameLayers) {
      nameLayers[key].show = false
    }
  },
  methods: {
    showLayer() {
      const name = `river${this.riverLevel}`
      for (const key in layers) {
        layers[key].show = false
        nameLayers[key].show = false
      }
      if (layers[name]) {
        layers[name].show = true
        nameLayers[name].show = true
      }
      else {
        const loading = this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })

        const nameLayer = new window.$ZMap.layer.GraphicLayer({
          name: `riverName${this.riverLevel}`,
          attr: {
            minZoom: 9,
          },
        })
        const tileLayer = new window.$ZMap.layer.GeoJsonLayer({
          zIndex: 1,
          name: 'layerRiver',
          url: `file/json/${name}.json`,
          symbol: {
            styleOptions: {
              width: 3,
              color: '#0669ff',
              fillColor: '#0669ff',
              fillOpacity: 0.7,
              outlineColor: '#0669ff',
              opacity: 1,
              outlineWidth: 2,
            },
          },
        })
        window.$zMap.addLayer(tileLayer)
        window.$zMap.addLayer(nameLayer)
        tileLayer.on(window.$ZMap.EventType.load, (e) => {
          setTimeout(() => {
            const names = []
            e.graphics.forEach((graphic) => {
              if (graphic.center && graphic.attr && graphic.attr.NAME) {
                if (!names.includes(graphic.attr.NAME)) {
                  names.push(graphic.attr.NAME)
                  const label = new window.$ZMap.graphic.Label({
                    latlng: graphic.center,
                    attr: {
                      minZoom: 9,
                    },
                    style: {
                      text: graphic.attr.NAME,
                      color: '#414141',
                      font_size: 10,
                      font_family: '楷体',
                      border: true,
                      border_width: 1,
                      border_style: '',
                      border_color: '#000000',
                      className: 'label-river-name',
                    },
                  })
                  nameLayer.addGraphic(label)
                }
              }
            })
            tileLayer.show = true
            nameLayer.show = true
            loading.close()
          }, 500)
        })
        layers[name] = tileLayer
        nameLayers[name] = nameLayer
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
