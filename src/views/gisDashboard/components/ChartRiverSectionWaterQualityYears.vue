<template>
  <box1>
    <span
      @click="handleClick"
      style="cursor:pointer;user-select: none;"
      slot="title"
      >入海河流断面水质总体达标情况(查看详情)</span
    >
    <div @click="handleClick">
      <Echart
        :options="options"
        style="text-align:center;"
        height="120px"
        width="340px"
      />
    </div>
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'

export default {
  name: 'ChartTNYears',
  components: { Box1, Echart },
  props: {},
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '10px',
          top: '10px',
          right: '10px',
          bottom: '10px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['2016', '2017', '2018', '2019', '2020', '2021']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '总体水质达标断面数',
            type: 'bar',
            barWidth: '5px',
            data: []
          },
          {
            name: '总体水质不达标断面数',
            type: 'bar',
            barWidth: '5px',
            data: []
          }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    const data = []
    const data1 = []
    for (let i = 0; i < 6; i++) {
      data.push(_.round(_.random(3, 8), 0))
      data1.push(9 - data[i])
    }
    this.options.series[0].data = data
    this.options.series[1].data = data1
  },
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
}
</style>
