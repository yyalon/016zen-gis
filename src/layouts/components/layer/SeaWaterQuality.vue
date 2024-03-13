<script>
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import DrawerSeaWaterStation from '../drawer/SeaWaterStation.vue'
import DrawerSeaWaterCharts from '../drawer/SeaWaterCharts.vue'

import PopupSeaWaterStation from '../popup/SeaWaterStation.vue'
import ZFrame from '../ZFrame.vue'
import apiData from '@/api/modules/data'

let stationlayer = null
const layers = {}

let shanghai = null
let jiangsu = null
let zhejiang = null

const seas = [
  { value: 'all', label: '所有海域', name: '所有海域', short: '所有' },
  { value: 'shanghai', label: '上海海域', name: '上海市', short: '上海' },
  { value: 'jiangsu', label: '江苏海域', name: '江苏省', short: '江苏' },
  { value: 'zhejiang', label: '浙江海域', name: '浙江省', short: '浙江' },
]

const legendWQ = {
  1: {
    color: '#73b2ff',
    label: '一类',
    checked: true,
    show: true,
  },
  2: { color: '#b2ddf7', label: '二类', checked: true, show: true },
  3: { color: '#beb1a1', label: '三类', checked: true, show: true },
  4: { color: '#9b856e', label: '四类', checked: true, show: true },
  5: { color: '#7a624a', label: '劣四类', checked: true, show: true },
}

const legendOther = {
  1: {
    color: '#73b2ff',
    label: '一类',
    checked: true,
    show: true,
  },
  2: { color: '#b2ddf7', label: '二类', checked: true, show: true },
  3: { color: '#beb1a1', label: '三类', checked: true, show: true },
  4: { color: '#9b856e', label: '四类', checked: true, show: true },
  5: { color: '#7a624a', label: '五类', checked: true, show: true },
}

const legendE = {
  1: { color: '#ffff0000', label: '正常', checked: true, show: false },
  2: { color: '#ffff00', label: '轻度', checked: true, show: true },
  3: { color: '#ff9900', label: '中度', checked: true, show: true },
  4: { color: '#ff0000', label: '重度', checked: true, show: true },
}

const years = [
  { value: 2017, label: 2017 },
  { value: 2018, label: 2018 },
  { value: 2019, label: 2019 },
  { value: 2020, label: 2020 },
  { value: 2021, label: 2021 },
  { value: 2022, label: 2022 },
  { value: 2023, label: 2023 },
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
  average: '年平均',
}

const objTypes = {
  wq: '水质评价',
  e: '富营养化',
  hxxyl: '化学需氧量',
  hxlsy: '活性磷酸盐',
  rjy: '溶解氧',
  syl: '石油类',
  wjd: '无机氮',
}

const types = [
  { value: 'wq', label: '水质评价' },
  { value: 'e', label: '富营养化' },
  { value: 'hxxyl', label: '化学需氧量' },
  { value: 'hxlsy', label: '活性磷酸盐' },
  { value: 'rjy', label: '溶解氧' },
  { value: 'syl', label: '石油类' },
  { value: 'wjd', label: '无机氮' },
]

const columns = [
  {
    key: 2,
    dataKey: 'sea',
    prop: 'sea',
    title: '海区',
    width: 60,
  },
  {
    key: 3,
    dataKey: 'province',
    prop: 'province',
    title: '省份',
    width: 80,
  },
  {
    key: 4,
    dataKey: 'site',
    prop: 'site',
    title: '点位编码',
    width: 120,
  },
  {
    key: 5,
    dataKey: 'pH',
    prop: 'pH',
    title: 'PH',
    width: 120,
    align: 'center',
    cellRenderer: (scope) => {
      const { rowData, cellData } = scope
      return rowData.pH || '-'
    },
  },
  {
    key: 6,
    dataKey: 'rjy',
    prop: 'rjy',
    title: '溶解氧',
    align: 'center',
    width: 120,
    cellRenderer: (scope) => {
      const { rowData, cellData } = scope
      return rowData.rjy || '-'
    },
  },
  {
    key: 7,
    dataKey: 'hxxyl',
    prop: 'hxxyl',
    title: '化学需氧量',
    align: 'center',
    width: 120,
    cellRenderer: (scope) => {
      const { rowData, cellData } = scope
      return rowData.hxxyl || '-'
    },
  },
  {
    key: 8,
    dataKey: 'wjd',
    prop: 'wjd',
    title: '无机氮',
    align: 'center',
    width: 120,
    cellRenderer: (scope) => {
      const { rowData, cellData } = scope
      return rowData.wjd || '-'
    },
  },
  {
    key: 9,
    dataKey: 'hxlxy',
    prop: 'hxlxy',
    title: '活性磷酸盐',
    align: 'center',
    width: 120,
    cellRenderer: (scope) => {
      const { rowData, cellData } = scope
      return rowData.hxlxy || '-'
    },
  },
  {
    key: 10,
    dataKey: 'syl',
    prop: 'syl',
    title: '石油类',
    align: 'center',
    width: 120,
    cellRenderer: (scope) => {
      const { rowData, cellData } = scope
      return rowData.syl || '-'
    },
  },
  {
    key: 11,
    dataKey: 'szlb',
    prop: 'szlb',
    title: '水质类别',
    align: 'center',
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
    },
  },
  {
    key: 11,
    dataKey: 'eIndex',
    prop: 'eIndex',
    title: '富营养化',
    align: 'center',
    width: 120,
    cellRenderer: (scope) => {
      const { rowData, cellData } = scope
      return legendE[rowData.eLevel]?.label || '-'
    },
  },
]
/*
<el-table-column label="季节" width="80">
  <template #default="scope">
    {{ objSeasons[scope.row.season] }}
  </template>
</el-table-column>  */
export default {
  components: { DrawerSeaWaterStation, DrawerSeaWaterCharts, ZFrame },
  emits: ['refreshSeaWaterQualityChart'],
  data() {
    return {
      seas,
      legendOther,
      legendWQ,
      legendE,
      years,
      seasons,
      objSeasons,
      objTypes,
      types,
      year: 2022,
      season: 'spring',
      type: 'wq',
      sea: 'all',
      seaWaterStations: [],
      seaWaterQualites: [],
      seaWaterQualityAreas: null,
      filteredSeaWaterQualites: [],
      drawerSeaWaterStationVisible: false,
      drawerSeaWaterChartsVisible: false,
      loadingSeaWaterQualites: false,
      drawerData: {},
      chartData: {},
      showList: false,
      showStations: true,
      columns,
    }
  },
  watch: {
    showStations() {
      this.showStationLayer()
    },
    year() {
      this.showLayer()
      this.getSeaWaterQuality()
      this.updateChartData()
    },
    season() {
      this.showLayer()
      this.getSeaWaterQuality()
      this.updateChartData()
    },
    type() {
      for (const key in this.legendOther) {
        this.legendOther[key].checked = true
      }
      for (const key in this.legendWQ) {
        this.legendWQ[key].checked = true
      }
      this.showLayer()
      this.updateChartData()
    },
    sea() {
      this.showLayer()
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
      this.updateChartData()
      this.getSeaWaterQuality()
    },
  },
  async mounted() {
    shanghai = window.$zMap.getLayerById(2000)
    jiangsu = window.$zMap.getLayerById(2001)
    zhejiang = window.$zMap.getLayerById(2002)
    this.sea = 'all'
    this.showStationLayer()
    this.showLayer()
  },
  unmounted() {
    for (const key in layers) {
      layers[key].show = false
    }
    stationlayer.show = false
    this.setOpacity(shanghai, 0.2)
    this.setOpacity(jiangsu, 0.2)
    this.setOpacity(zhejiang, 0.2)
  },
  methods: {
    showCharts() {
      this.drawerSeaWaterChartsVisible = true
    },
    async getData() {
      const { code, data } = await apiData.getSeaWaterStation()
      if (code === 1000) {
        this.seaWaterStations = data
      }
    },
    async getSeaWaterQualityAreas() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载地图数据...',
        spinner: 'el-icon-loading',
        background: '#100d17e3',
      })
      const { code, data } = await apiData.getSeaWaterQualityAreas()
      if (code === 1000) {
        const areas = {}
        data.forEach((item) => {
          const name = `${item.t}-${item.y}-${item.s}`
          if (areas[name]) {
            if (areas[name][item.p]) {
              areas[name][item.p].push({
                value: item.l,
                area: parseFloat(item.a),
              })
            }
            else {
              areas[name][item.p] = [
                {
                  value: item.l,
                  area: parseFloat(item.a),
                },
              ]
            }
          }
          else {
            areas[name] = {}
            areas[name][item.p] = [
              {
                value: item.l,
                area: parseFloat(item.a),
              },
            ]
          }
        })
        this.seaWaterQualityAreas = areas
        this.updateChartData()
      }
      loading.close()
    },
    async getSeaWaterQuality() {
      this.loadingSeaWaterQualites = true
      const query = { keyWord: this.year }

      if (this.season !== 'average') {
        query.season = this.season
      }

      if (this.sea !== 'all') {
        let province = ''
        seas.forEach((sea) => {
          if (sea.value === this.sea) {
            province = sea.short
          }
        })
        query.province = province
      }
      const { code, data } = await apiData.getSeaWaterQuality(query)
      this.loadingSeaWaterQualites = false
      if (code === 1000) {
        this.seaWaterQualites = data.map((item) => {
          return { ...item, year: dayjs(item.minitor_month).year() }
        })
        if (this.season === 'average') {
          const objSeaWaterQualites = {}
          this.seaWaterQualites.forEach((item) => {
            if (objSeaWaterQualites[item.site]) {
              objSeaWaterQualites[item.site].push(item)
            }
            else {
              objSeaWaterQualites[item.site] = [item]
            }
          })
          this.filteredSeaWaterQualites = []
          for (const key in objSeaWaterQualites) {
            const aryYearQualites = objSeaWaterQualites[key]
            const objYearQualites = {
              ...objSeaWaterQualites[key][0],
              ...{
                eIndex: 0,
                hxlxy: 0,
                hxxyl: 0,
                pH: 0,
                rjy: 0,
                syl: 0,
                wjd: 0,
              },
            }
            for (let i = 0; i < aryYearQualites.length; i++) {
              objYearQualites.eIndex += aryYearQualites[i].eIndex
              objYearQualites.hxlxy += aryYearQualites[i].hxlxy
              objYearQualites.hxxyl += aryYearQualites[i].hxxyl
              objYearQualites.pH += aryYearQualites[i].pH
              objYearQualites.rjy += aryYearQualites[i].rjy
              objYearQualites.syl += aryYearQualites[i].syl
              objYearQualites.wjd += aryYearQualites[i].wjd
            }

            objYearQualites.eIndex = objYearQualites.eIndex / aryYearQualites.length
            objYearQualites.hxlxy = objYearQualites.hxlxy / aryYearQualites.length
            objYearQualites.hxxyl = objYearQualites.hxxyl / aryYearQualites.length
            objYearQualites.pH = objYearQualites.pH / aryYearQualites.length
            objYearQualites.rjy = objYearQualites.rjy / aryYearQualites.length
            objYearQualites.syl = objYearQualites.syl / aryYearQualites.length
            objYearQualites.wjd = objYearQualites.wjd / aryYearQualites.length

            objYearQualites.eIndex = objYearQualites.eIndex ? objYearQualites.eIndex.toFixed(5) : '-'

            objYearQualites.hxlxy = objYearQualites.hxlxy ? objYearQualites.hxlxy.toFixed(3) : '-'

            objYearQualites.hxxyl = objYearQualites.hxxyl ? objYearQualites.hxxyl.toFixed(2) : '-'

            objYearQualites.pH = objYearQualites.pH ? objYearQualites.pH.toFixed(2) : '-'

            objYearQualites.rjy = objYearQualites.rjy ? objYearQualites.rjy.toFixed(2) : '-'

            objYearQualites.syl = objYearQualites.syl ? objYearQualites.syl.toFixed(4) : '-'

            objYearQualites.wjd = objYearQualites.wjd ? objYearQualites.wjd.toFixed(3) : '-'

            this.filteredSeaWaterQualites.push(objYearQualites)
          }
        }
        else {
          this.filteredSeaWaterQualites = this.seaWaterQualites.filter(item => item.year === this.year && item.season === this.season)
        }
      }
    },
    async showStationLayer() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载地图数据...',
        spinner: 'el-icon-loading',
        background: '#100d17e3',
      })
      if (stationlayer) {
        stationlayer.show = this.showStations
        loading.close()
      }
      else {
        stationlayer = new window.$ZMap.layer.ClusterLayer({
          show: false,
          maxClusterRadius: 70,
          chunkedLoading: true, // 间隔添加数据，以便页面不冻结。
          showCoverageOnHover: false, // 是否显示聚合标记的边界。
          disableClusteringAtZoom: 10, // 此级别下不聚合
        })
        window.$zMap.addLayer(stationlayer)

        await this.getData()
        await this.getSeaWaterQualityAreas()

        for (let i = 0, len = this.seaWaterStations.length; i < len; i++) {
          const item = this.seaWaterStations[i]
          const graphic = new window.$ZMap.graphic.Marker({
            latlng: [item.lat, item.lon],
            style: {
              width: 24,
              height: 24,
              image: 'img/marker/river.png',
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
            this.drawerSeaWaterStationVisible = true
          })

          graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
            e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupSeaWaterStation, { popupData: e.target.attr }))
          })

          graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
            window.$Utitls.unloadComponentContent(e.target)
          })

          stationlayer.addGraphic(graphic)
        }

        setTimeout(() => {
          stationlayer.show = this.showStations
          loading.close()
        }, 500)
      }
    },
    resetLayerStyle() {
      const name = this.type + this.year + this.season
      const graphics = layers[name].getGraphics()
      if (layers[name]) {
        for (let i = 0; i < graphics.length; i++) {
          const graphic = graphics[i]
          const value = graphic.attr.Value

          let fillColor = ''
          if (this.type === 'wq') {
            fillColor = legendWQ[value]?.checked ? legendWQ[value].color : '#00000000'
          }
          else if (this.type === 'e') {
            fillColor = legendE[value]?.checked ? legendE[value].color : '#00000000'
          }
          else {
            fillColor = legendOther[value]?.checked ? legendOther[value].color : '#00000000'
          }
          graphic.setStyle({ fillColor })
        }
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
      else if (this.type === 'e') {
        this.legendE[value].checked = !this.legendE[value].checked
      }
      else {
        this.legendOther[value].checked = !this.legendOther[value].checked
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
    updateChartData() {
      this.chartData = {
        type: this.type,
        year: this.year,
        season: this.season,
        province: this.sea,
        areas: this.seaWaterQualityAreas,
      }
      this.$emit('refreshSeaWaterQualityChart', this.chartData)
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
              fillColor = legendWQ[attr.Value]?.checked ? legendWQ[attr.Value].color : '#00000000'
            }
            else if (this.type === 'e') {
              fillColor = legendE[attr.Value]?.checked ? legendE[attr.Value].color : '#00000000'
            }
            else {
              fillColor = legendOther[attr.Value]?.checked ? legendOther[attr.Value].color : '#00000000'
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
      const name = `${this.type}${this.year}${this.season}`
      if (layers[name]) {
        this.resetLayerStyle()
        layers[name].show = true
        layers[name].bringToBack()
      }
      else {
        const loading = this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })
        let queryMapServer = null
        queryMapServer = new window.$ZMap.query.QueryGeoServer({
          url: 'http://10.103.10.80/geoserver/sea/ows',
          layer: `sea:${name}`,
        })
        queryMapServer.query({
          success: (result) => {
            const { count, geojson } = result
            if (count > 0) {
              layers[name] = this.createNewGeoLayer(name)
              window.$zMap.addLayer(layers[name])
              layers[name].load({ data: geojson })
              layers[name].show = true
            }
            else {
              ElMessage({
                message: `没有${this.year}${this.objSeasons[this.season]} ${this.objTypes[this.type]}的数据`,
              })
            }
            loading.close()
          },
          error: () => {
            loading.close()
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
        <template v-for="(item, key) in legendWQ" :key="item.color">
          <div v-if="item.show" class="legend-item" :style="{ background: item.color }" @click="checkLegendItem(key)">
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
        </template>
      </div>
      <div v-else-if="type === 'e'" class="legend-e">
        <template v-for="(item, key) in legendE" :key="item.color">
          <div v-if="item.show" class="legend-item" :style="{ background: item.color, display: key === 1 ? 'none' : 'flex' }" @click="checkLegendItem(key)">
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
        </template>
      </div>
      <div v-else class="legend-wq">
        <template v-for="(item, key) in legendOther" :key="item.color">
          <div v-if="item.show" class="legend-item" :style="{ background: item.color }" @click="checkLegendItem(key)">
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
        </template>
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
      <el-switch v-model="showList" active-text="显示列表" style="margin-right: 10px" />
      <el-switch v-model="showStations" active-text="显示点位" style="margin-right: 10px" />
      <el-button type="warning" style="pointer-events: all" @click="showCharts()">
        统计
      </el-button>
    </div>

    <DrawerSeaWaterCharts :drawer-data="chartData" :visible="drawerSeaWaterChartsVisible" @close="drawerSeaWaterChartsVisible = false" />
    <DrawerSeaWaterStation :drawer-data="drawerData" :visible="drawerSeaWaterStationVisible" @close="drawerSeaWaterStationVisible = false" />
    <div v-if="showList" class="sea-station-list">
      <ZFrame width="100%" height="100%">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              v-loading="loadingSeaWaterQualites"
              row-key="id"
              :data="filteredSeaWaterQualites"
              :width="width"
              :height="height"
              :columns="columns"
              :cache="filteredSeaWaterQualites.length"
            />
          </template>
        </el-auto-resizer>
      </ZFrame>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-switch__label) {
  color: white;
}

:deep(.el-loading-mask) {
  background-color: rgb(0 0 0 / 80%);
}

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
