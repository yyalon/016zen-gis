<template>
  <box1>
    <span slot="title">不同类型直排海污染源污水及主要监控指标排放比例 </span>
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
  [30, 132, 101, 134, 90, 230, 210, 230, 410, 210],
  [30, 182, 191, 234, 290, 330, 310, 330, 234, 290],
  [60, 232, 201, 154, 190, 330, 410, 154, 330, 182]
]
var data0 = []
var data1 = []
var data2 = []
var total
for (var i = 0, l = oridata[0].length; i < l; i++) {
  total = oridata[0][i] + oridata[1][i] + oridata[2][i]
  data0.push(Math.round((oridata[0][i] / total) * 100))
  data1.push(Math.round((oridata[1][i] / total) * 100))
  data2.push(100 - data0[data0.length - 1] - data1[data1.length - 1])
}
export default {
  name: 'ChartBarOutfallYears',
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
          data: ['工业污染源', '生活污染源', '综合排污口']
        },

        calculable: true,
        xAxis: [
          {
            boundaryGap: false,
            type: 'category',
            data: [
              '污水量',
              '化学需氧量',
              '石油类',
              '氨氮',
              '总氮',
              '总磷',
              '六价铬',
              '铅',
              '汞',
              '镉'
            ]
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
            name: '工业污染源',
            type: 'bar',
            stack: '总量',
            barWidth: '6px',
            data: data0
          },
          {
            name: '生活污染源',
            type: 'bar',
            stack: '总量',
            barWidth: '6px',
            data: data1
          },
          {
            name: '综合排污口',
            type: 'bar',
            stack: '总量',
            barWidth: '6px',
            data: data2
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
