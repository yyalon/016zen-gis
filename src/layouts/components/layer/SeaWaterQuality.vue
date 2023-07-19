<script>
import DrawerSeaWaterStation from '../drawer/SeaWaterStation.vue'
import PopupSeaWaterStation from '../popup/SeaWaterStation.vue'
import apiData from '@/api/modules/data'

let stationlayer = null
const layers = {}

let shanghai = null
let jiangsu = null
let zhejiang = null

const seas = [
  { value: 'all', label: '所有海域' },
  { value: 'shanghai', label: '上海海域' },
  { value: 'jiangsu', label: '江苏海域' },
  { value: 'zhejiang', label: '浙江海域' },
]

const legendWQ = {
  1:
    { color: '#73b2ff', label: '一类', checked: true },
  2:
    { color: '#b2ddf7', label: '二类', checked: true },
  3:
    { color: '#beb1a1', label: '三类', checked: true },
  4:
    { color: '#9b856e', label: '四类', checked: true },
  5:
    { color: '#7a624a', label: '劣四类', checked: true },
}

const legendE = {
  2: { color: '#ffff00', label: '轻度富营养化', checked: true },
  3: { color: '#ff9900', label: '中度富营养化', checked: true },
  4: { color: '#ff0000', label: '重度富营养化', checked: true },
}

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
  components: { PopupSeaWaterStation, DrawerSeaWaterStation },
  data() {
    return {
      seas,
      legendWQ,
      legendE,
      years,
      seasons,
      types,
      year: 2022,
      season: 'spring',
      type: 'wq',
      sea: '',
      seaWaterStations: [],
      drawerVisible: false,
      drawerData: {},
    }
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
        this.setOpacity(shanghai, 0)
        this.setOpacity(jiangsu, 0)
        this.setOpacity(zhejiang, 0)
      }
      else if (this.sea === 'shanghai') {
        window.$zMap.fitBounds(shanghai.getBounds(), { padding: [40, 40], duration: 5 })
        this.setOpacity(shanghai, 0.01)
        this.setOpacity(jiangsu, 0.8)
        this.setOpacity(zhejiang, 0.8)
      }
      else if (this.sea === 'zhejiang') {
        window.$zMap.fitBounds(zhejiang.getBounds(), { padding: [40, 40], duration: 5 })
        this.setOpacity(zhejiang, 0.01)
        this.setOpacity(shanghai, 0.8)
        this.setOpacity(jiangsu, 0.8)
      }
      else if (this.sea === 'jiangsu') {
        window.$zMap.fitBounds(jiangsu.getBounds(), { padding: [40, 40], duration: 5 })
        this.setOpacity(jiangsu, 0.01)
        this.setOpacity(shanghai, 0.8)
        this.setOpacity(zhejiang, 0.8)
      }
    },
  },
  async mounted() {
    shanghai = window.$zMap.getLayerById(2000)
    jiangsu = window.$zMap.getLayerById(2001)
    zhejiang = window.$zMap.getLayerById(2002)
    this.sea = 'all'
    this.showLayer()
    await this.showStationLayer()
  },
  unmounted() {
    this.setOpacity(shanghai, 0.2)
    this.setOpacity(jiangsu, 0.2)
    this.setOpacity(zhejiang, 0.2)
  },
  methods: {
    async getData() {
      const { code, data } = await apiData.getSeaWaterStation()
      if (code === 1000) {
        this.seaWaterStations = data
      }
    },
    async showStationLayer() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载地图数据...',
        spinner: 'el-icon-loading',
        background: '#100d17e3',
      })
      stationlayer = new window.$ZMap.layer.ClusterLayer({
        show: false,
        maxClusterRadius: 70,
        chunkedLoading: true, // 间隔添加数据，以便页面不冻结。
        showCoverageOnHover: false, // 是否显示聚合标记的边界。
        disableClusteringAtZoom: 10, // 此级别下不聚合
      })
      window.$zMap.addLayer(stationlayer)

      await this.getData()

      for (let i = 0, len = this.seaWaterStations.length; i < len; i++) {
        const item = this.seaWaterStations[i]
        const graphic = new window.$ZMap.graphic.Marker({
          latlng: [item.lat, item.lon],
          style: {
            width: 24,
            height: 24,
            image: '/img/marker/river.png',
            horizontalOrigin: window.$ZMap.HorizontalOrigin.CENTER,
            verticalOrigin: window.$ZMap.VerticalOrigin.BOTTOM,
          },
          attr: item,
        })

        graphic.bindTooltip(null, {
          className: 'custom_tooltp',
        })

        graphic.on(window.$ZMap.EventType.click, (e) => {
          this.drawerData = e.target.attr
          this.drawerVisible = true
        })

        graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
          e.target.setTooltipContent(window.$ZMap.loadComponentContent(e.target, PopupSeaWaterStation, { popupData: e.target.attr }))
        })

        graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
          window.$ZMap.unloadComponentContent(e.target)
        })

        stationlayer.addGraphic(graphic)
      }

      setTimeout(() => {
        stationlayer.show = true
        loading.close()
      }, 500)
    },
    resetLayerStyle() {
      const name = this.type + this.year + this.season
      const graphics = layers[name].getGraphics()
      for (let i = 0; i < graphics.length; i++) {
        const graphic = graphics[i]
        const value = graphic.attr.Value

        let fillColor = ''
        if (this.type === 'wq') {
          fillColor = (legendWQ[value] && legendWQ[value].checked) ? legendWQ[value].color : '#00000000'
        }
        else {
          fillColor = (legendE[value] && legendE[value].checked) ? legendE[value].color : '#00000000'
        }
        graphic.setStyle({ fillColor })
      }
    },
    checkLegendItem(value) {
      const loading = this.$loading({
        lock: true,
        text: '正在加载地图数据...',
        spinner: 'el-icon-loading',
        background: '#100d17e3',
      })
      if (this.type === 'wq') {
        this.legendWQ[value].checked = !this.legendWQ[value].checked
      }
      else {
        this.legendE[value].checked = !this.legendE[value].checked
      }
      this.resetLayerStyle()
      loading.close()
    },
    setOpacity(obj, opacity) {
      if (obj) {
        obj.load({
          url: obj.options.url,
          symbol: {
            styleOptions: {
              fillOpacity: opacity,
            },
          },
        })
      }
    },
    showLayer() {
      for (const key in this.legendE) {
        this.legendE[key].checked = true
      }
      for (const key in this.legendWQ) {
        this.legendWQ[key].checked = true
      }
      const name = this.type + this.year + this.season
      for (const key in layers) {
        layers[key].show = false
      }
      if (layers[name]) {
        this.resetLayerStyle()
        layers[name].show = true
      }
      else {
        const loading = this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })
        const queryMapServer = new window.$ZMap.query.QueryGeoServer({
          url: 'http://139.9.41.23:8078/geoserver/sea/ows',
          layer: `sea:${name}`,
        })

        queryMapServer.query({
          success: (result) => {
            const { count, geojson } = result
            if (count > 0) {
              layers[name] = new window.$ZMap.layer.GeoJsonLayer({
                name,
                symbol: {
                  type: 'polygon',
                  styleOptions: {
                    fill: true,
                    fillColor: 'white',
                    fillOpacity: 1,
                    outline: true,
                    outlineWidth: 1,
                    outlineOpacity: 0.5,
                    outlineColor: 'white',
                  },
                  callback: (attr) => {
                    let fillColor = ''
                    if (this.type === 'wq') {
                      fillColor = (legendWQ[attr.Value] && legendWQ[attr.Value].checked) ? legendWQ[attr.Value].color : '#00000000'
                    }
                    else {
                      fillColor = (legendE[attr.Value] && legendE[attr.Value].checked) ? legendE[attr.Value].color : '#00000000'
                    }
                    return {
                      fillColor,
                    }
                  },
                },
              })
              window.$zMap.addLayer(layers[name])
              layers[name].load({ data: geojson })
              loading.close()
            }
          },
          error: (error, msg) => {
          },
        })
      }
    },
  },
}
</script>

<template>
  <div class="work-zone">
    <div class="legend">
      <div v-if="type === 'wq'" class="legend-wq">
        <div v-for="(item, key) in legendWQ" :key="item.color" class="legend-item" :style="{ background: item.color }"
          @click="checkLegendItem(key)">
          <div class="icon">
            <el-icon v-if="item.checked">
              <svg-icon name="ep:circle-check-filled" />
            </el-icon>
            <el-icon v-if="!item.checked">
              <svg-icon name="ep:circle-check" />
            </el-icon>
          </div>
          <div class="name">
            {{ item.label }}
          </div>
        </div>
      </div>
      <div v-if="type === 'e'" class="legend-e">
        <div v-for="(item, key) in legendE" :key="item.color" class="legend-item" :style="{ background: item.color }"
          @click="checkLegendItem(key)">
          <div class="icon">
            <el-icon v-if="item.checked">
              <svg-icon name="ep:circle-check-filled" />
            </el-icon>
            <el-icon v-if="!item.checked">
              <svg-icon name="ep:circle-check" />
            </el-icon>
          </div>
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="filters">
      <el-select v-model="sea" placeholder="请选择海域">
        <el-option v-for="item in seas" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="year" placeholder="请选择年份">
        <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="season" placeholder="请选择季节">
        <el-option v-for="item in seasons" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="type" placeholder="请选择类型">
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <DrawerSeaWaterStation :drawer-data="drawerData" :visible="drawerVisible" @close="drawerVisible = false" />
  </div>
</template>

<style lang="scss" scoped>
.work-zone {
  display: flex;
}

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
  margin-left: 10px;
  margin-top: 5px;

  .legend-wq,
  .legend-e {
    display: flex;
    align-items: center;
    flex-direction: column;

    .legend-item {
      display: flex;
      width: 120px;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      font-size: 13px;
      margin: 5px;
      color: #000;
      cursor: pointer;
      pointer-events: all;

      &:hover {
        opacity: .8;
      }

      .icon {
        height: 30px;
        width: 30px;
        display: flex;
        align-items: center;
        font-size: 16px;
        justify-content: center;
        color: #3b3b3b;
        background-color: rgba(255, 255, 255, 0.178);
      }

      .name {
        flex: 1;
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
