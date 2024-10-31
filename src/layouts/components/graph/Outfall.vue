<script>
import SewageOutfalls from '../layer/SewageOutfalls.vue'
import LeftDrawer from '../LeftDrawer.vue'
import RightDrawer from '../RightDrawer.vue'
import ChartOutfallsStatus from '../chart/OutfallsStatus.vue'
import ChartOutfallsDrainageTrend from '../chart/OutfallsDrainageTrend.vue'
import ChartOutfallsWaterBodyTypes from '../chart/OutfallsWaterBodyTypes.vue'
import OutfallsWaterQualityTarget from '../chart/OutfallsWaterQualityTarget.vue'

export default {
  components: { SewageOutfalls, LeftDrawer, RightDrawer, ChartOutfallsStatus, ChartOutfallsDrainageTrend, ChartOutfallsWaterBodyTypes, OutfallsWaterQualityTarget },
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
    <LeftDrawer :drawer-visible="visible">
      <ChartOutfallsStatus />
      <ChartOutfallsDrainageTrend />
    </LeftDrawer>
    <RightDrawer :drawer-visible="visible">
      <ChartOutfallsWaterBodyTypes />
      <OutfallsWaterQualityTarget />
    </RightDrawer>
  </div>
</template>
