<template>
  <box1>
    <span slot="title">入海排口溯源情况</span>
    <el-descriptions title="" :column="2">
      <el-descriptions-item label="排口类型"> </el-descriptions-item>
      <el-descriptions-item label="入海方式"> </el-descriptions-item>
      <el-descriptions-item label="污水排放方式"> </el-descriptions-item>
      <el-descriptions-item label="收纳水体"> </el-descriptions-item>
      <el-descriptions-item label="环境保护要求"> </el-descriptions-item>
    </el-descriptions>
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartOutfallTrace',
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
::v-deep .box-content {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.data-value {
  font-size: 20px;
  color: #ffc162;
  line-height: 1.2;
}
</style>
