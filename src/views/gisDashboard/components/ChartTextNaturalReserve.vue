<template>
  <box1>
    <span slot="title">自然保护区 </span>
    <div style="user-select:none;  ">
      <el-descriptions :column="1">
        <el-descriptions-item label="东海海域共有海上自然保护区"
          ><span class="font-digital data-value">5</span>个
        </el-descriptions-item>
        <el-descriptions-item label="总面积"
          ><span class="font-digital data-value">2340</span>平方公里
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartTextNaturalReserve',
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
