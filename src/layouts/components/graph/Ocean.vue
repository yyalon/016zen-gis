<script>
import SeaWaterQualityStandard from '../chart/SeaWaterQualityStandard.vue'
import SeaWaterQualityAnalysis from '../chart/SeaWaterQualityAnalysis.vue'
import ChartSeaWaterGoodQualitySeasonColumn from '../chart/SeaWaterGoodQualitySeasonColumn.vue'
import ChartSeaStationEutrophicationProportion from '../chart/SeaStationEutrophicationProportion.vue'

import LayerSeaWaterQuality from '../layer/SeaWaterQuality.vue'
import LeftDrawer from '../LeftDrawer.vue'
import RightDrawer from '../RightDrawer.vue'

export default {
  components: {
    LeftDrawer,
    RightDrawer,
    LayerSeaWaterQuality,
    SeaWaterQualityStandard,
    SeaWaterQualityAnalysis,
    ChartSeaWaterGoodQualitySeasonColumn,
    ChartSeaStationEutrophicationProportion,
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
    <LeftDrawer :drawer-visible="visible">
      <SeaWaterQualityStandard />
      <SeaWaterQualityAnalysis />
    </LeftDrawer>
    <RightDrawer :drawer-visible="visible" @open="showChart = true">
      <ChartSeaWaterGoodQualitySeasonColumn v-if="showChart" :chart-data="chartData" />
      <ChartSeaStationEutrophicationProportion />
    </RightDrawer>
  </div>
</template>
