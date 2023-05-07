<script>
import RightDrawer from './RightDrawer.vue'
import ChartOutfallsStatus from './ChartOutfallsStatus.vue'
import ChartKeyMonitoringIndicatorsTrend from './ChartKeyMonitoringIndicatorsTrend.vue'
import ChartKeyMonitoringIndicatorsProportion from './ChartKeyMonitoringIndicatorsProportion.vue'
import ChartOnlineMonitoring from './ChartOnlineMonitoring.vue'

export default {
  components: { RightDrawer, ChartOutfallsStatus, ChartKeyMonitoringIndicatorsTrend, ChartKeyMonitoringIndicatorsProportion, ChartOnlineMonitoring },
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
    22
    <ChartOutfallsStatus />
    <ChartKeyMonitoringIndicatorsTrend />
    <ChartKeyMonitoringIndicatorsProportion />
    <ChartOnlineMonitoring />
  </RightDrawer>
</template>
