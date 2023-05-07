<script>
import RightDrawer from './RightDrawer.vue'
import ChartSeaWaterQualityProportion from './ChartSeaWaterQualityProportion.vue'
import ChartEutrophicWaterAreaTrend from './ChartEutrophicWaterAreaTrend.vue'

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
