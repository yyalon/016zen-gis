<template>
  <panel-right :width="400"
    ><template slot="content">
      <chart-pie-sea-water-quality-levels></chart-pie-sea-water-quality-levels>
      <chart-bar-eutrophia-years></chart-bar-eutrophia-years>
      <chart-line-sea-main-factors>
      </chart-line-sea-main-factors></template></panel-right
></template>

<script>
import { getGjzWaterQualityStations } from '@/api/data'
import PanelRight from '@/views/components/PanelRight'

import ChartPieSeaWaterQualityLevels from './ChartPieSeaWaterQualityLevels'
import ChartLineSeaMainFactors from './ChartLineSeaMainFactors'

import ChartBarEutrophiaYears from './ChartBarEutrophiaYears'
import ChartWaterQuality from './ChartWaterQuality'
import ChartWaterStatus from './ChartWaterStatus'
import layer from '../mixins/layer'
export default {
  name: 'GraphWaterQuality',
  props: {},
  components: {
    PanelRight,
    ChartLineSeaMainFactors,
    ChartBarEutrophiaYears,
    ChartPieSeaWaterQualityLevels,
    ChartWaterQuality,
    ChartWaterStatus
  },
  mixins: [layer],
  data() {
    return {
      graphicLayer: null
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.getGjzWaterQualityStations()
    })
  },
  methods: {
    getGjzWaterQualityStations() {
      getGjzWaterQualityStations({
        sea: '东海',
        year: 2022
      }).then(res => {
        res.forEach(item => {
          item.level = Math.floor(Math.random() * (6 - 1)) + 1
          const data = {
            level: item.level,
            position: [
              parseFloat(item.longitude),
              parseFloat(item.latitude),
              0
            ],
            layer: 'waterQualityMonitoringSection',
            tooltip: `点位代码${item.code}<br>所属省市： ${item.province}${item.city}<br>海域：${item.sea}`
          }
          data.attr = {
            scope: {
              showPopup: true,
              popupData: {
                type: 'riverSection',
                ...item
              },
              'popup-component': require(`@/components/WaterQualityPopup`)
                .default
            }
          }
          if (item.level) {
            data.image = window.config.iconUrl + `water_${item.level}.png`
          } else {
            data.image = window.config.iconUrl + 'water_3.png'
          }
          data.highlight = {
            scale: 0.12
          }
          data.style = {
            image: data.image,
            scale: 0.08,
            horizontalOrigin: this.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM,
            scaleByDistance: true,
            scaleByDistance_far: 200000,
            scaleByDistance_farValue: 0.8,
            scaleByDistance_near: 150000,
            scaleByDistance_nearValue: 1.3,
            clampToGround: true
          }
          this.addIcon(data)
        })
        this.graphicLayer.flyTo()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
