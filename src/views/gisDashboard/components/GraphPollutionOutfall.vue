<template>
  <panel-right :width="400"
    ><template slot="content">
      <chart-water-status></chart-water-status>
      <chart-pollution-reason></chart-pollution-reason></template></panel-right
></template>

<script>
import PanelRight from '@/views/components/PanelRight'
import ChartWaterStatus from './ChartWaterStatus'
import ChartPollutionReason from './ChartPollutionReason'
export default {
  name: 'GraphPollutionOutfall',
  props: {},
  components: {
    PanelRight,
    ChartPollutionReason,
    ChartWaterStatus
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
