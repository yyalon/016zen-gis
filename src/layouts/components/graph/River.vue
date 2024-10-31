<script>
import LeftDrawer from '../LeftDrawer.vue'
import RightDrawer from '../RightDrawer.vue'
import RiverWaterQualityStandard from '../chart/RiverWaterQualityStandard.vue'
import RiverWaterQualityAnalysis from '../chart/RiverWaterQualityAnalysis.vue'
import ChartWaterQualityComplianceStatus from '../chart/WaterQualityComplianceStatus.vue'
import RiverMonitorDetail from '../chart/RiverMonitorDetail.vue'
import ChartMajorPollutantsConcentrationsTrend from '../chart/MajorPollutantsConcentrationsTrend.vue'

export default {
  components: {
    LeftDrawer,
    RightDrawer,
    RiverWaterQualityStandard,
    RiverWaterQualityAnalysis,
    ChartWaterQualityComplianceStatus,
    RiverMonitorDetail,
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
    <ChartMajorPollutantsConcentrationsTrend v-if="visible" />
    <LeftDrawer :drawer-visible="visible">
      <RiverWaterQualityStandard />
      <RiverWaterQualityAnalysis />
    </LeftDrawer>
    <RightDrawer :drawer-visible="visible">
      <ChartWaterQualityComplianceStatus />
      <RiverMonitorDetail />
    </RightDrawer>
  </div>
</template>
