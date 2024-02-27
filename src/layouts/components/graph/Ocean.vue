<script>
import ChartSeaWaterQualityProportion from '../chart/SeaWaterQualityProportion.vue'
import ChartSeaEutrophicationProportion from '../chart/SeaEutrophicationProportion.vue'
import ChartSeaWaterQualityColumn from '../chart/SeaWaterQualityColumn.vue'
import ChartSeaWaterGoodQualityProvinceColumn from '../chart/SeaWaterGoodQualityProvinceColumn.vue'

import LayerSeaWaterQuality from '../layer/SeaWaterQuality.vue'
import RightDrawer from '../RightDrawer.vue'

export default {
  components: {
    RightDrawer,
    LayerSeaWaterQuality,
    ChartSeaWaterQualityProportion,
    ChartSeaEutrophicationProportion,
    ChartSeaWaterQualityColumn,
    ChartSeaWaterGoodQualityProvinceColumn,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showChart: false,
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
    <RightDrawer :drawer-visible="visible" @open="showChart = true">
      <ChartSeaWaterQualityProportion v-if="showChart" :chart-data="chartData" /> <br />
      <ChartSeaEutrophicationProportion v-if="showChart" :chart-data="chartData" /><br />
      <!-- <ChartSeaWaterQualityColumn :chart-data="chartData" /><br /> -->
      <ChartSeaWaterGoodQualityProvinceColumn v-if="showChart" :chart-data="chartData" />
    </RightDrawer>
  </div>
</template>
