<script>
import RightDrawer from './RightDrawer.vue'
import ChartRiverWaterQualityProportion from './ChartRiverWaterQualityProportion.vue'
import ChartWaterQualityComplianceStatus from './ChartWaterQualityComplianceStatus.vue'
import ChartNitrogenComplianceStatus from './ChartNitrogenComplianceStatus.vue'
import ChartMajorPollutantsConcentrationsTrend from './ChartMajorPollutantsConcentrationsTrend.vue'

export default {
  components: {
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
  <RightDrawer :drawer-visible="visible">
    <ChartRiverWaterQualityProportion />
    <ChartWaterQualityComplianceStatus />
    <ChartNitrogenComplianceStatus />
    <ChartMajorPollutantsConcentrationsTrend />
  </RightDrawer>
</template>
