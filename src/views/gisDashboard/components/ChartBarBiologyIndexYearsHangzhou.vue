<template>
  <box1>
    <span slot="title">杭州湾生物多样性指数趋势 </span>
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

const data0 = []
const data1 = []
const data2 = []

for (let i = 0; i < 6; i++) {
  data0.push(_.round(_.random(1.42, 2.95)))
  data1.push(_.round(_.random(1.74, 2.57)))
  data2.push(_.round(_.random(0.2, 0.47)))
}
export default {
  name: 'ChartBarBiologyIndexYearsHangzhou',
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
