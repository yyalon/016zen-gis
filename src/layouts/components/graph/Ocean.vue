<script>
import ChartSeaWaterQualityProportion from '../chart/SeaWaterQualityProportion.vue'
import ChartSeaEutrophicationProportion from '../chart/SeaEutrophicationProportion.vue'
import LayerSeaWaterQuality from '../layer/SeaWaterQuality.vue'
import RightDrawer from '../RightDrawer.vue'

export default {
  components: {
    RightDrawer,
    LayerSeaWaterQuality,
    ChartSeaWaterQualityProportion,
    ChartSeaEutrophicationProportion,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chartData: {},
    }
  },
  methods: {
    refreshSeaWaterQualityChart(chartData) {
      this.chartData = chartData
    },
  },
}
</script>

<template>
  <div>
    <LayerSeaWaterQuality v-if="visible" @refresh-sea-water-quality-chart="refreshSeaWaterQualityChart" />
    <RightDrawer :drawer-visible="visible">
      <ChartSeaWaterQualityProportion v-if="visible" :chart-data="chartData" /> <br />
      <ChartSeaEutrophicationProportion v-if="visible" :chart-data="chartData" /><br />
      <ChartSeaEutrophicationProportion v-if="visible" :chart-data="chartData" /><br />
      <ChartSeaEutrophicationProportion v-if="visible" :chart-data="chartData" />
    </RightDrawer>
  </div>
</template>
