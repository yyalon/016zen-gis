<script>
import SewageOutfalls from '../layer/SewageOutfalls.vue'
import LayerRiverSections from '../layer/RiverSections.vue'
import LeftDrawer from '../LeftDrawer.vue'
import RightDrawer from '../RightDrawer.vue'
import ChartOutfallsStatus from '../chart/OutfallsStatus.vue'
import ChartOutfallsDrainageTrend from '../chart/OutfallsDrainageTrend.vue'
import ChartOutfallsWaterBodyTypes from '../chart/OutfallsWaterBodyTypes.vue'
import OutfallsWaterQualityTarget from '../chart/OutfallsWaterQualityTarget.vue'

export default {
  components: { SewageOutfalls, LayerRiverSections, LeftDrawer, RightDrawer, ChartOutfallsStatus, ChartOutfallsDrainageTrend, ChartOutfallsWaterBodyTypes, OutfallsWaterQualityTarget },
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
