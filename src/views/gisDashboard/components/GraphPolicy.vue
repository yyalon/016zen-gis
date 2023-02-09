<template>
  <panel-right :width="400"
    ><div slot="content">
      <chart-water-quality-realtime> </chart-water-quality-realtime>
      <chart-outfall-trace></chart-outfall-trace></div></panel-right
></template>

<script>
import PanelRight from '@/views/components/PanelRight'
import ChartWaterQualityRealtime from './ChartWaterQualityRealtime'
import ChartOutfallTrace from './ChartOutfallTrace'
export default {
  name: 'GraphPolicy',
  props: {},
  components: {
    PanelRight,
    ChartOutfallTrace,
    ChartWaterQualityRealtime
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
