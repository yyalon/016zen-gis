<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

export default {
  name: 'ChartOutfallsDrainageTrend',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {},
          },
        ],
      },
      radio1: '总氮',
    }
  },
}
</script>

<template>
  <ZFrame title="入海排污口排水趋势">
    <el-radio-group v-model="radio1" is-button>
      <el-radio-button label="排水量" />
      <el-radio-button label="化学需氧量" />
      <el-radio-button label="总氮" />
      <el-radio-button label="总磷" />
    </el-radio-group>
    <Echart :options="options" height="232px" width="410px" />
  </ZFrame>
</template>
