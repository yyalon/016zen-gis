<template>
  <box1>
    <span slot="title">生物多样性指数趋势 </span>
    <Echart
      :options="options"
      style="text-align:center;"
      height="160px"
      width="340px"
    />
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'

var oridata = [
  [1.65, 1.24, 1.97, 1.42, 2.95, 1.84],
  [1.74, 1.84, 1.86, 1.71, 2.57, 2.49],
  [0.36, 0.25, 0.36, 0.2, 0.47, 0.25]
]
var data0 = oridata[0]
var data1 = oridata[1]
var data2 = oridata[2]
export default {
  name: 'ChartBarBiologyIndexYears',
  components: { Box1, Echart },
  props: {},
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '10px',
          top: '30px',
          right: '10px',
          bottom: '10px',
          containLabel: true
        },
        legend: {
          data: ['底栖生物', '浮游动物', '浮游植物']
        },

        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['2016', '2017', '2018', '2019', '2020', '2021']
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitArea: { show: true }
          }
        ],
        series: [
          {
            name: '底栖生物',
            type: 'bar',
            barWidth: '6px',
            data: data2
          },
          {
            name: '浮游动物',
            type: 'bar',
            barWidth: '6px',
            data: data1
          },
          {
            name: '浮游植物',
            type: 'bar',
            barWidth: '6px',
            data: data0
          }
        ]
      }
    }
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
  color: white;
  font-size: 14px;
}
.data-value {
  font-size: 20px;
  color: #ffc162;
  line-height: 1.2;
}
</style>
