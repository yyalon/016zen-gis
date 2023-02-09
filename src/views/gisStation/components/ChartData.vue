<template>
  <box1>
    <span slot="title">实时数据</span>
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartData',
  components: { Box1, Echart },
  props: {},
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.box1 {
  height: 90%;
}
</style>
