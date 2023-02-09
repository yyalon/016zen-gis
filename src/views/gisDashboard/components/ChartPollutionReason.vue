<template>
  <box1>
    <span slot="title">污染溯源 </span>
    <el-descriptions title="" :column="2">
      <el-descriptions-item label="入海河流"
        ><span class="font-digital data-value">27</span>条
      </el-descriptions-item>
      <el-descriptions-item label="入海排口"
        ><span class="font-digital data-value">127</span
        >个</el-descriptions-item
      >
      <el-descriptions-item label="港口"
        ><span class="font-digital data-value">27</span>个</el-descriptions-item
      >
      <el-descriptions-item label="渔业养殖场"
        ><span class="font-digital data-value">327</span
        >个</el-descriptions-item
      >
      <el-descriptions-item label="海上污染源"
        ><span class="font-digital data-value">46</span>个</el-descriptions-item
      >
      <el-descriptions-item label="海域异常现象"
        ><span class="font-digital data-value">赤潮</span></el-descriptions-item
      >
    </el-descriptions>
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartPollutionReason',
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
