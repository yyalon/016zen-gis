<script>
import dayjs from 'dayjs'
import DrawerSeaWaterStation from '../drawer/SeaWaterStation.vue'
import PopupSeaWaterStation from '../popup/SeaWaterStation.vue'
import ZFrame from '../ZFrame.vue'
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
  1: { color: '#ffff0000', label: '正常', checked: true },
  2: { color: '#ffff00', label: '轻度', checked: true },
  3: { color: '#ff9900', label: '中度', checked: true },
  4: { color: '#ff0000', label: '重度', checked: true },
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
  { value: 'autumn', label: '秋季' },
  { value: 'average', label: '年平均' },
]

const objSeasons = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
}

const types = [
  { value: 'wq', label: '水质评价' },
  { value: 'e', label: '富营养化' },
]

const columns = [{
  key: 2,
  dataKey: 'sea',
  prop: 'sea',
  title: '海区',
  width: 60,
}, {
  key: 3,
  dataKey: 'province',
  prop: 'province',
  title: '省份',
  width: 80,
}, {
  key: 4,
  dataKey: 'site',
  prop: 'site',
  title: '点位编码',
  width: 120,
}, {
  key: 5,
  dataKey: 'pH',
  prop: 'pH',
  title: 'PH',
  width: 120,
}, {
  key: 6,
  dataKey: 'rjy',
  prop: 'rjy',
  title: '溶解氧',
  width: 120,
}, {
  key: 7,
  dataKey: 'hxxyl',
  prop: 'hxxyl',
  title: '化学需氧量',
  width: 120,
}, {
  key: 8,
  dataKey: 'wjd',
  prop: 'wjd',
  title: '无机氮',
  width: 120,
}, {
  key: 9,
  dataKey: 'hxlxy',
  prop: 'hxlxy',
  title: '活性磷酸盐',
  width: 120,
}, {
  key: 10,
  dataKey: 'syl',
  prop: 'syl',
  title: '石油类',
  width: 120,
}, {
  key: 11,
  dataKey: 'szlb',
  prop: 'szlb',
  title: '水质类别',
  width: 120,
  cellRenderer: (scope) => {
    const { rowData, cellData } = scope
    return h(
      'ElTag',
      {
        hit: true,
        effect: 'dark',
        color: legendWQ[rowData.wqLevel].color,
      },
      { default: () => cellData },
    )
  }

  ,
}]
/*
<el-table-column label="季节" width="80">
  <template #default="scope">
    {{ objSeasons[scope.row.season] }}
  </template>
</el-table-column>  */
export default {
  components: { DrawerSeaWaterStation, ZFrame },
  emits: ['refreshSeaWaterQualityProportion', 'refreshSeaEutrophicationProportion'],
  data() {
    return {
      seas,
      legendWQ,
      legendE,
      years,
      seasons,
      objSeasons,
      types,
      year: 2022,
      season: 'spring',
      type: 'wq',
      sea: '',
      seaWaterStations: [],
      seaWaterQualites: [],
      filteredSeaWaterQualites: [],
      drawerVisible: false,
      loadingSeaWaterQualites: false,
      drawerData: {},
      showList: false,
      columns,
    }
  },
  watch: {
    year() {
      this.showLayer()
      this.getSeaWaterQuality()
    },
    season() {
      this.showLayer()
      if (this.season !== 'average') {
        this.getSeaWaterQuality()
      }
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
    this.getSeaWaterQuality()
    this.showStationLayer()
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
    async getSeaWaterQuality() {
      this.loadingSeaWaterQualites = true
      const { code, data } = await apiData.getSeaWaterQuality({ keyWord: this.year, season: this.season })
      this.loadingSeaWaterQualites = false
      if (code === 1000) {
        this.seaWaterQualites = data.map((item) => {
          return { ...item, year: dayjs(item.minitor_month).year() }
        })
        this.filteredSeaWaterQualites = this.seaWaterQualites.filter(item => item.year === this.year && item.season === this.season)
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
    updateChartData(type) {
      const name = `${type}${this.year}${this.season}`
      const graphics = layers[name].getGraphics()
      const areas = {}
      graphics.forEach((graphic) => {
        if (graphic.area && graphic.attr && graphic.attr.Value) {
          areas[graphic.attr.Value] = areas[graphic.attr.Value] ? (areas[graphic.attr.Value] + graphic.area) : graphic.area
        }
      })
      const objLegend = (type === 'wq') ? legendWQ : legendE
      const eventName = (type === 'wq') ? 'refreshSeaWaterQualityProportion' : 'refreshSeaEutrophicationProportion'
      const chartData = {
        year: this.year,
        season: this.season,
        areas: Object.entries(areas).map(([key, value]) => ({ label: objLegend[key].label, value })),
      }
      this.$emit(eventName, chartData)
    },
    createNewGeoLayer(name) {
      return new window.$ZMap.layer.GeoJsonLayer({
        show: false,
        name,
        zIndex: 100,
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
    },
    showLayer() {
      for (const key in this.legendE) {
        this.legendE[key].checked = true
      }
      for (const key in this.legendWQ) {
        this.legendWQ[key].checked = true
      }

      for (const key in layers) {
        layers[key].show = false
      }
      this.sea = 'all'
      const name = `${this.type}${this.year}${this.season}`
      if (layers[name]) {
        this.resetLayerStyle()
        layers[name].show = true
        this.updateChartData('wq')
        this.updateChartData('e')
      }
      else {
        const loading = this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })
        const wqName = `wq${this.year}${this.season}`
        let queryMapServer = new window.$ZMap.query.QueryGeoServer({
          url: 'http://139.9.41.23:8078/geoserver/sea/ows',
          layer: `sea:${wqName}`,
        })

        queryMapServer.query({
          success: (result) => {
            const { count, geojson } = result
            if (count > 0) {
              layers[wqName] = this.createNewGeoLayer(wqName)
              window.$zMap.addLayer(layers[wqName])
              layers[wqName].load({ data: geojson })
              if (name === wqName) {
                layers[wqName].show = true
              }
              this.updateChartData('wq')
              loading.close()
            }
          },
        })

        const eName = `e${this.year}${this.season}`
        queryMapServer = new window.$ZMap.query.QueryGeoServer({
          url: 'http://139.9.41.23:8078/geoserver/sea/ows',
          layer: `sea:${eName}`,
        })

        queryMapServer.query({
          success: (result) => {
            const { count, geojson } = result
            if (count > 0) {
              layers[eName] = this.createNewGeoLayer(eName)
              window.$zMap.addLayer(layers[eName])
              layers[eName].load({ data: geojson })
              if (name === eName) {
                layers[eName].show = true
              }

              this.updateChartData('e')
              loading.close()
            }
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
        <div
          v-for="(item, key) in legendWQ" :key="item.color" class="legend-item" :style="{ background: item.color }"
          @click="checkLegendItem(key)"
        >
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
        <div
          v-for="(item, key) in legendE" :key="item.color" class="legend-item"
          :style="{ background: item.color, display: key === 1 ? 'none' : 'flex' }" @click="checkLegendItem(key)"
        >
          <div class="icon">
            <el-icon v-if="item.checked">
              <svg-icon name="ep:circle-check-filled" />
            </el-icon>
            <el-icon v-if="!item.checked">
              <svg-icon name="ep:circle-check" />
            </el-icon>
          </div>
          {{ item.label }}富营养化
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

      <el-switch v-model="showList" active-text="显示列表" />
    </div>
    <DrawerSeaWaterStation :drawer-data="drawerData" :visible="drawerVisible" @close="drawerVisible = false" />
    <div v-if="showList" class="sea-station-list">
      <ZFrame width="100%" height="100%">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              v-loading="loadingSeaWaterQualites" row-key="id" :data="filteredSeaWaterQualites" :width="width"
              :height="height" :columns="columns" :cache="filteredSeaWaterQualites.length"
            />
          </template>
        </el-auto-resizer>
      </ZFrame>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.work-zone {
  display: flex;

  .sea-station-list {
    position: absolute;
    left: 146px;
    top: 150px;
    width: 1200px;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    pointer-events: all;
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
        opacity: 0.8;
      }

      .icon {
        height: 30px;
        width: 30px;
        display: flex;
        align-items: center;
        font-size: 16px;
        justify-content: center;
        color: #3b3b3b;
        background-color: rgb(255 255 255 / 17.8%);
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
