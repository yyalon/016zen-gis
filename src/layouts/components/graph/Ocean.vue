<script>
import ChartSeaWaterQualityProportion from '../chart/SeaWaterQualityProportion.vue'
import ChartEutrophicWaterAreaTrend from '../chart/EutrophicWaterAreaTrend.vue'
import RightDrawer from '../RightDrawer.vue'

export default {
  components: {
    RightDrawer,
    ChartSeaWaterQualityProportion,
    ChartEutrophicWaterAreaTrend,
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
    <ChartSeaWaterQualityProportion />
    <ChartEutrophicWaterAreaTrend />
  </RightDrawer>
</template>
