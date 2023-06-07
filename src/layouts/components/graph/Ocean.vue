<script>
import ChartSeaWaterQualityProportion from '../chart/SeaWaterQualityProportion.vue'
import ChartEutrophicWaterAreaTrend from '../chart/EutrophicWaterAreaTrend.vue'
import LayerSeaWaterQuality from '../layer/SeaWaterQuality.vue'
import LayerSeaShanghai from '../layer/seaShanghai.vue'
import RightDrawer from '../RightDrawer.vue'

export default {
  components: {
    RightDrawer,
    LayerSeaWaterQuality,
    ChartSeaWaterQualityProportion,
    ChartEutrophicWaterAreaTrend,
    LayerSeaShanghai,
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
    <LayerSeaWaterQuality v-if="visible" />
    <RightDrawer :drawer-visible="visible">
      <ChartSeaWaterQualityProportion />
      <ChartEutrophicWaterAreaTrend />
    </RightDrawer>
    <LayerSeaShanghai />
  </div>
</template>
