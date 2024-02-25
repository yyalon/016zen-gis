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
    <LayerRiverSections v-if="visible" />
    <RightDrawer :drawer-visible="visible">
      <ChartRiverWaterQualityProportion /> <br />
      <ChartWaterQualityComplianceStatus /><br />
      <ChartNitrogenComplianceStatus /><br />
      <ChartMajorPollutantsConcentrationsTrend />
    </RightDrawer>
  </div>
</template>
