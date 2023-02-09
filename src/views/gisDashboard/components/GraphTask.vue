<template>
  <panel-right :width="400"
    ><div slot="content">
      <chart-water-status> </chart-water-status>
      <chart-water-status> </chart-water-status></div></panel-right
></template>

<script>
import PanelRight from '@/views/components/PanelRight'
import ChartWaterStatus from './ChartWaterStatus'
export default {
  name: 'GraphTask',
  props: {},
  components: {
    PanelRight,
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
