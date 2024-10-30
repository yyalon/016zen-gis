<script>
import LeftDrawer from '../LeftDrawer.vue'
import RightDrawer from '../RightDrawer.vue'
import CockpitRiver from '../chart/CockpitRiver.vue'
import CockpitAtmosphere from '../chart/CockpitAtmosphere.vue'
import CockpitOcean from '../chart/CockpitOcean.vue'
import CockpitMeteorology from '../chart/CockpitMeteorology.vue'
import LayerRiverSections from '../layer/RiverSections.vue'

export default {
  components: {
    LeftDrawer,
    RightDrawer,
    CockpitRiver,
    CockpitAtmosphere,
    CockpitOcean,
    CockpitMeteorology,
    LayerRiverSections,
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
    <LeftDrawer :drawer-visible="visible">
      <CockpitRiver />
      <CockpitAtmosphere />
    </LeftDrawer>
    <RightDrawer :drawer-visible="visible">
      <CockpitOcean />
      <CockpitMeteorology />
    </RightDrawer>
  </div>
</template>
