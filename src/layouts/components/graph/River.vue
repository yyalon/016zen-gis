<script>
import LeftDrawer from '../LeftDrawer.vue'
import RightDrawer from '../RightDrawer.vue'
import RiverWaterQualityStandard from '../chart/RiverWaterQualityStandard.vue'
import RiverWaterQualityAnalysis from '../chart/RiverWaterQualityAnalysis.vue'
import ChartWaterQualityComplianceStatus from '../chart/WaterQualityComplianceStatus.vue'
import RiverMonitorDetail from '../chart/RiverMonitorDetail.vue'
import ChartMajorPollutantsConcentrationsTrend from '../chart/MajorPollutantsConcentrationsTrend.vue'
import LayerRiverSections from '../layer/RiverSections.vue'

export default {
  components: {
    LayerRiverSections,
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
    <LayerRiverSections v-if="visible" />
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
