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
      chartDataWQ: {}, chartDataE: {},
    }
  },
  methods: {
    refreshSeaWaterQualityProportion(chartData) {
      this.chartDataWQ = chartData
    },
    refreshSeaEutrophicationProportion(chartData) {
      this.chartDataE = chartData
    },
  },
}
</script>

<template>
  <div>
    <LayerSeaWaterQuality
      v-if="visible" @refresh-sea-water-quality-proportion="refreshSeaWaterQualityProportion"
      @refresh-sea-eutrophication-proportion="refreshSeaEutrophicationProportion"
    />
    <RightDrawer :drawer-visible="visible">
      <ChartSeaWaterQualityProportion :chart-data="chartDataWQ" /> <br>
      <ChartSeaEutrophicationProportion v-if="visible" :chart-data="chartDataE" />
    </RightDrawer>
  </div>
</template>
