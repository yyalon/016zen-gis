<script>
import RightDrawer from '../RightDrawer.vue'
import ChartRiverWaterQualityProportion from '../chart/RiverWaterQualityProportion.vue'
import ChartWaterQualityComplianceStatus from '../chart/WaterQualityComplianceStatus.vue'
import ChartNitrogenComplianceStatus from '../chart/NitrogenComplianceStatus.vue'
import ChartMajorPollutantsConcentrationsTrend from '../chart/MajorPollutantsConcentrationsTrend.vue'
import LayerRiverSections from '../layer/RiverSections.vue'

export default {
  components: {
    LayerRiverSections,
    LayerRivers,
    RightDrawer,
    ChartRiverWaterQualityProportion,
    ChartWaterQualityComplianceStatus,
    ChartNitrogenComplianceStatus,
    ChartMajorPollutantsConcentrationsTrend,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div>
    <LayerRivers v-if="visible" />
    <LayerRiverSections v-if="visible" />
    <RightDrawer :drawer-visible="visible">
      <ChartRiverWaterQualityProportion />
      <ChartWaterQualityComplianceStatus />
      <ChartNitrogenComplianceStatus />
      <ChartMajorPollutantsConcentrationsTrend />
    </RightDrawer>
  </div>
</template>
