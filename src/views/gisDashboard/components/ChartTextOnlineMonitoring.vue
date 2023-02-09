<template>
  <box1>
    <span
      style="user-select:none; cursor:pointer;"
      slot="title"
      @click="handleClick"
      >在线监测(点击查看)</span
    >
    <div @click="handleClick" style="user-select:none; cursor:pointer;">
      <el-descriptions :column="1">
        <el-descriptions-item label="在线监测污染源总数">
          <span class="font-digital data-value">157</span
          >家</el-descriptions-item
        >
      </el-descriptions>
      <el-descriptions :column="2">
        <el-descriptions-item label="工业企业">
          <span class="font-digital data-value">123</span
          >家</el-descriptions-item
        >
        <el-descriptions-item label="污水处理厂">
          <span class="font-digital data-value">34</span
          >家</el-descriptions-item
        >
      </el-descriptions>
    </div>
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartTextOnlineMonitoring',
  components: { Box1, Echart },
  props: {},
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    handleClick() {
      this.$emit('click-text')
    }
  }
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
