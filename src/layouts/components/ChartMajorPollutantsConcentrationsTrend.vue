<script>
import ZFrame from './ZFrame.vue'

export default {
  name: 'ChartMajorPollutantsConcentrationsTrend',
  components: { ZFrame },
}
</script>

<template>
  <ZFrame :height="220" title="主要污染物浓度趋势图" />
</template>
