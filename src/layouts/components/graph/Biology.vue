<script>
import RightDrawer from '../RightDrawer.vue'
import ChartRiverWaterQualityProportion from '../chart/RiverWaterQualityProportion.vue'
import ChartWaterQualityComplianceStatus from '../chart/WaterQualityComplianceStatus.vue'
import ChartNitrogenComplianceStatus from '../chart/NitrogenComplianceStatus.vue'
import ChartMajorPollutantsConcentrationsTrend from '../chart/MajorPollutantsConcentrationsTrend.vue'

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
