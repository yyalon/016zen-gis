<template>
  <box1>
    <span slot="title">赤潮 </span>
    <div style="user-select:none;  ">
      <el-descriptions :column="1">
        <el-descriptions-item label="东海海域2022年度共发生赤潮"
          ><span class="font-digital data-value">5</span>次
        </el-descriptions-item>
        <el-descriptions-item label="总面积"
          ><span class="font-digital data-value">4907</span>平方公里
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </box1>
</template>
<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartTextRedTide',
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
