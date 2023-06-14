<script>
import SewageOutfalls from '../layer/SewageOutfalls.vue'
import RightDrawer from '../RightDrawer.vue'
import ChartOutfallsStatus from '../chart/OutfallsStatus.vue'
import ChartKeyMonitoringIndicatorsTrend from '../chart/KeyMonitoringIndicatorsTrend.vue'
import ChartKeyMonitoringIndicatorsProportion from '../chart/KeyMonitoringIndicatorsProportion.vue'
import ChartOnlineMonitoring from '../chart/OnlineMonitoring.vue'

export default {
  components: { SewageOutfalls, RightDrawer, ChartOutfallsStatus, ChartKeyMonitoringIndicatorsTrend, ChartKeyMonitoringIndicatorsProportion, ChartOnlineMonitoring },
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
    <SewageOutfalls v-if="visible" />
    <RightDrawer :drawer-visible="visible">
      <ChartOutfallsStatus />
      <ChartKeyMonitoringIndicatorsTrend />
      <ChartKeyMonitoringIndicatorsProportion />
      <ChartOnlineMonitoring />
    </RightDrawer>
  </div>
</template>
