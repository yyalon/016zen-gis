<script>
import ChartSeaWaterQualityProportion from '../chart/SeaWaterQualityProportion.vue'
import ChartSeaEutrophicationProportion from '../chart/SeaEutrophicationProportion.vue'
import ChartSeaWaterGoodQualitySeasonColumn from '../chart/SeaWaterGoodQualitySeasonColumn.vue'

// import ChartSeaWaterGoodQualityProvinceColumn from '../chart/SeaWaterGoodQualityProvinceColumn.vue'
import ChartSeaWaterQualityStationProportionColumn from '../chart/SeaWaterQualityStationProportionColumn.vue'

import LayerSeaWaterQuality from '../layer/SeaWaterQuality.vue'
import RightDrawer from '../RightDrawer.vue'

export default {
  components: {
    RightDrawer,
    LayerSeaWaterQuality,
    ChartSeaWaterQualityProportion,
    ChartSeaEutrophicationProportion,
    ChartSeaWaterGoodQualitySeasonColumn,
    // ChartSeaWaterGoodQualityProvinceColumn,
    ChartSeaWaterQualityStationProportionColumn,
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
      <ChartSeaWaterQualityProportion v-if="showChart" :chart-data="chartData" /> <br>
      <ChartSeaEutrophicationProportion v-if="showChart" :chart-data="chartData" /><br>
      <ChartSeaWaterQualityStationProportionColumn v-if="showChart" :chart-data="chartData" /><br>
      <!-- <ChartSeaWaterQualityColumn :chart-data="chartData" /><br /> -->
      <!-- <ChartSeaWaterGoodQualityProvinceColumn v-if="showChart" :chart-data="chartData" /><br /> -->
      <ChartSeaWaterGoodQualitySeasonColumn v-if="showChart" :chart-data="chartData" />
    </RightDrawer>
  </div>
</template>
