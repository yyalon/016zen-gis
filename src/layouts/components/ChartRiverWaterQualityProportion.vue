<script>
import ZFrame from './ZFrame.vue'

export default {
  name: 'ChartRiverWaterQualityProportion',
  components: { ZFrame },
}
</script>

<template>
  <ZFrame :height="220" title="入海河流断面水质类别面积占比" />
</template>
