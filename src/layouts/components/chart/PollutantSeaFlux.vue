<script>
import * as echarts from 'echarts'
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

export default {
  name: 'PollutantSeaFlux',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            rotate: 20,
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
          name: '排放量（万吨）',
        },
      },
      type: 'tn',
      chartData: {},
    }
  },
  watch: {
    type() {
      this.update()
    },
  },
  async mounted() {
    const response = await fetch('/pollutant/chart3_sea_flux.json')
    this.chartData = await response.json()
    this.update()
  },
  methods: {
    update() {
      const data = this.chartData[this.type]
      const types = data.map(item => item.type)
      const values = data.map(item => item.total)
      const title = this.type === 'tn' ? '总氮' : '总磷'

      this.options.xAxis.data = types
      this.options.yAxis.name = `${title}排放量（万吨）`
      this.options.series = [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          barWidth: '50%',
        },
      ]
    },
  },
}
</script>

<template>
  <ZFrame title="入海通量分类统计（2022年）">
    <div style="text-align: right;">
      <el-radio-group v-model="type" is-button>
        <el-radio-button label="总氮" value="tn" />
        <el-radio-button label="总磷" value="tp" />
      </el-radio-group>
    </div>
    <Echart :options="options" height="320px" width="410px" />
  </ZFrame>
</template>
