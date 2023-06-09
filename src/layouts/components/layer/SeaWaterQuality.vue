<script>
const layers = {}

let shanghai = null
let jiangsu = null
let zhejiang = null

const seas = [
  { value: 'all', label: '所有' },
  { value: 'shanghai', label: '上海' },
  { value: 'jiangsu', label: '江苏' },
  { value: 'zhejiang', label: '浙江' },
]

const legendWQ = [
  { color: '#73b2ff', label: '一类' },
  { color: '#b2ddf7', label: '二类' },
  { color: '#beb1a1', label: '三类' },
  { color: '#9b856e', label: '四类' },
  { color: '#7a624a', label: '劣五类' },
]

const legendE = [
  { color: '#ffff00', label: '轻度富营养化' },
  { color: '#ff9900', label: '中度富营养化' },
  { color: '#ff0000', label: '中毒富营养化' },
]

const years = [
  { value: 2017, label: 2017 },
  { value: 2018, label: 2018 },
  { value: 2019, label: 2019 },
  { value: 2020, label: 2020 },
  { value: 2021, label: 2021 },
  { value: 2022, label: 2022 },
]

const seasons = [
  { value: 'spring', label: '春季' },
  { value: 'summer', label: '夏季' },
  { value: 'winter', label: '冬季' },
]

const types = [
  { value: 'wq', label: '水质评价' },
  { value: 'e', label: '富营养化' },
]

export default {
  props: {

  },
  data() {
    return { seas, legendWQ, legendE, years, seasons, types, year: 2022, season: 'spring', type: 'wq', sea: '' }
  },
  watch: {
    year() {
      this.showLayer()
    },
    season() {
      this.showLayer()
    },
    type() {
      this.showLayer()
    },
    sea() {
      if (this.sea === 'all') {
        window.$zMap.flyHome()
        this.setOpacity(shanghai, 0.01)
        this.setOpacity(jiangsu, 0.01)
        this.setOpacity(zhejiang, 0.01)
      }
      else if (this.sea === 'shanghai') {
        shanghai.flyTo({ height: 200000 })
        this.setOpacity(shanghai, 0.1)
        this.setOpacity(jiangsu, 0.8)
        this.setOpacity(zhejiang, 0.8)
      }
      else if (this.sea === 'zhejiang') {
        zhejiang.flyTo({ height: 1000000 })
        this.setOpacity(shanghai, 0.8)
        this.setOpacity(jiangsu, 0.8)
        this.setOpacity(zhejiang, 0.1)
      }
      else if (this.sea === 'jiangsu') {
        jiangsu.flyTo({ height: 1000000 })
        this.setOpacity(shanghai, 0.8)
        this.setOpacity(jiangsu, 0.1)
        this.setOpacity(zhejiang, 0.8)
      }
    },
  },
  mounted() {
    shanghai = window.$zMap.getLayerById(2000)
    jiangsu = window.$zMap.getLayerById(2001)
    zhejiang = window.$zMap.getLayerById(2002)
    this.sea = 'all'
    this.showLayer()
  },
  unmounted() {
    for (const key in layers) {
      layers[key].show = false
    }
    this.setOpacity(shanghai, 0.3)
    this.setOpacity(jiangsu, 0.3)
    this.setOpacity(zhejiang, 0.3)
  },
  methods: {
    setOpacity(obj, opacity) {
      if (obj) {
        obj.setOptions({
          symbol: {
            styleOptions: {
              opacity,
            },
          },
        })
      }
    },
    showLayer() {
      const name = this.type + this.year + this.season
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
        const tileLayer = new window.$ZMap.layer.WmsLayer({
          name,
          type: 'wms',
          zIndex: 2000,
          url: 'http://139.9.41.23:8078/geoserver/sea/wms',
          layers: `sea:${name}`,
          parameters: {
            tiled: true,
            VERSION: '1.3.0',
            format: 'image/png',
            transparent: true,
          },
          popup: 'all',
          show: true,
        })
        tileLayer.on(window.$ZMap.EventType.load, () => {
          setTimeout(() => {
            tileLayer.show = true
            tileLayer.toTop()
            loading.close()
          }, 500)
        })
        window.$zMap.addLayer(tileLayer)
        layers[name] = tileLayer
      }
    },
  },
}
</script>

<template>
  <div>
    <div class="filters">
      <el-select v-model="year" placeholder="请选择年份">
        <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="season" placeholder="请选择季节">
        <el-option v-for="item in seasons" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="type" placeholder="请选择类型">
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="sea" placeholder="请选择海域">
        <el-option v-for="item in seas" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div class="legend">
      <div v-if="type === 'wq'" class="legend-wq">
        <div v-for="item in legendWQ" :key="item.color" class="legend-item" :style="{ background: item.color }">
          {{ item.label }}
        </div>
      </div>
      <div v-if="type === 'e'" class="legend-e">
        <div v-for="item in legendE" :key="item.color" class="legend-item" :style="{ background: item.color }">
          {{ item.label }}
        </div>
      </div>
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

.legend {
  position: fixed;
  bottom: 100px;
  left: 10px;

  .legend-wq,
  .legend-e {
    display: flex;
    align-items: center;
    flex-direction: column;

    .legend-item {
      width: 120px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      font-size: 13px;
      margin: 5px;
      color: #000;
    }
  }
}
</style>
