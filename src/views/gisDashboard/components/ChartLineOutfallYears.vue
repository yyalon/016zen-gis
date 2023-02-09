<template>
  <box1>
    <span slot="title">直排海污染源污水及主要监控指标排放量 </span>
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

export default {
  name: 'ChartLineOutfallYears',
  components: { Box1, Echart },
  props: {},
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        //   data: [
        //     '污水量（亿吨）',
        //     '化学需氧量（万吨）',
        //     '石油类（百吨）',
        //     '氨氮（千吨）',
        //     '总氮（千吨）',
        //     '总磷（百吨）'
        //   ]
        // },
        grid: {
          left: '10px',
          top: '10px',
          right: '10px',
          bottom: '10px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2016', '2017', '2018', '2019', '2020', '2021']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '污水量（亿吨）',
            type: 'line',
            data: [62, 61, 83, 80, 90, 70, 72]
          },
          {
            name: '化学需氧量（万吨）',
            type: 'line',
            data: [20, 18, 17, 18, 19, 16, 15]
          },
          {
            name: '石油类（百吨）',
            type: 'line',
            data: [4, 6, 3, 5, 4, 3]
          },
          {
            name: '氨氮（千吨）',
            type: 'line',
            data: [18, 10, 5, 6, 5, 4, 4]
          },
          {
            name: '总氮（千吨）',
            type: 'line',
            data: [64, 56, 50, 50, 45, 45]
          },
          {
            name: '总磷（百吨）',
            type: 'line',
            data: [28, 21, 15, 14, 17, 15]
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
