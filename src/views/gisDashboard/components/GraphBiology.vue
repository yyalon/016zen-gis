<template>
  <panel-right :width="400"
    ><div slot="content">
      <chart-text-natural-reserve></chart-text-natural-reserve>
      <chart-text-red-tide></chart-text-red-tide>
      <chart-bar-biology-index-years-hangzhou>
      </chart-bar-biology-index-years-hangzhou>
      <chart-bar-biology-index-years-changjiang>
      </chart-bar-biology-index-years-changjiang></div></panel-right
></template>

<script>
import { getRedTides, getNaturalReserves } from '@/api/data'
import PanelRight from '@/views/components/PanelRight'
import ChartTextBiology from './ChartTextBiology'
import ChartTextNaturalReserve from './ChartTextNaturalReserve'
import ChartTextRedTide from './ChartTextRedTide'
import ChartBarBiologyIndexYearsChangjiang from './ChartBarBiologyIndexYearsChangjiang'
import ChartBarBiologyIndexYearsHangzhou from './ChartBarBiologyIndexYearsHangzhou'
import ChartWaterStatus from './ChartWaterStatus'
import layer from '../mixins/layer'

export default {
  name: 'GraphBiology',
  props: {},
  components: {
    PanelRight,
    ChartTextBiology,
    ChartTextNaturalReserve,
    ChartTextRedTide,
    ChartBarBiologyIndexYearsChangjiang,
    ChartBarBiologyIndexYearsHangzhou,
    ChartWaterStatus
  },
  mixins: [layer],
  data() {
    return {}
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    getData() {
      this.getRedTides()
      this.getNaturalReserves()
    },
    getRedTides() {
      getRedTides().then(res => {
        res.forEach(item => {
          const data = {
            position: [item.longitude, item.latitude, 0],
            layer: 'redTide',
            tooltip: `发生地点：${item.position}<br>面积：${item.area ||
              ''}平方公里`
          }
          data.attr = {
            scope: {
              showPopup: false
            }
          }
          data.image = window.config.iconUrl + 'icon_red_tide_center.png'
          this.addIcon(data)
        })
      })
    },
    getNaturalReserves() {
      getNaturalReserves().then(res => {
        res.forEach(item => {
          const data = {
            position: [item.longitude, item.latitude, 0],
            layer: 'naturalReserves',
            tooltip: `名称：${item.name}<br>面积：${item.area || ''}平方公里`
          }
          data.attr = {
            scope: {
              showPopup: false
            }
          }
          data.image = window.config.iconUrl + 'icon_nature_reserve.png'
          this.addIcon(data)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
