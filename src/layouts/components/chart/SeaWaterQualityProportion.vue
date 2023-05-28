<script>
import ZFrame from '../ZFrame.vue'

export default {
  name: 'ChartSeaWaterQualityProportion',
  components: { ZFrame },
}
</script>

<template>
  <ZFrame :height="220" title="东海海域水质类别面积占比" />
</template>
