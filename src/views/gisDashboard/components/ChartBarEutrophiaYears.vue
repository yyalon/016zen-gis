<template>
  <box1>
    <span slot="title">我国海域富营养化状态海域面积 </span>
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
  [3, 3.8, 2.9, 3.5, 3.6, 3.9, 2.8, 2.7, 1.7, 2, 1],
  [3, 3.8, 2.9, 3.5, 3.6, 3.9, 2.8, 2.7, 1.7, 2, 1],
  [3, 3.8, 2.9, 3.5, 3.6, 3.9, 2.8, 2.7, 1.7, 2, 1]
]
var data0 = oridata[0]
var data1 = oridata[1]
var data2 = oridata[2]
export default {
  name: 'ChartBarEutrophiaYears',
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
          data: ['重度富营养化', '中度富营养化', '轻度富营养化']
        },

        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: [
              '2011',
              '2012',
              '2013',
              '2014',
              '2015',
              '2016',
              '2017',
              '2018',
              '2019',
              '2020',
              '2021'
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
            name: '重度富营养化',
            type: 'bar',
            stack: 'total',
            barWidth: '6px',
            data: data2
          },
          {
            name: '中度富营养化',
            type: 'bar',
            stack: 'total',
            barWidth: '6px',
            data: data1
          },
          {
            name: '轻度富营养化',
            type: 'bar',
            stack: 'total',
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
