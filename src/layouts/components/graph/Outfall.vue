<script>
import RightDrawer from '../RightDrawer.vue'
import ChartOutfallsStatus from '../chart/OutfallsStatus.vue'
import ChartKeyMonitoringIndicatorsTrend from '../chart/KeyMonitoringIndicatorsTrend.vue'
import ChartKeyMonitoringIndicatorsProportion from '../chart/KeyMonitoringIndicatorsProportion.vue'
import ChartOnlineMonitoring from '../chart/OnlineMonitoring.vue'

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
