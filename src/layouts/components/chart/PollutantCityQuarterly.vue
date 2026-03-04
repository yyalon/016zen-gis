<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

export default {
  name: 'PollutantCityQuarterly',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: ['Q1', 'Q2', 'Q3', 'Q4'],
          top: 5,
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
        },
        yAxis: {
          type: 'value',
          name: '排放量',
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
    const response = await fetch('/pollutant/chart1_city_quarterly.json')
    this.chartData = await response.json()
    this.update()
  },
  methods: {
    update() {
      const data = this.chartData[this.type]
      const cities = data.map(item => item.city)
      const title = this.type === 'tn' ? '总氮' : '总磷'

      this.options.xAxis.data = cities
      this.options.yAxis.name = `${title}排放量`
      this.options.series = [
        {
          name: 'Q1',
          type: 'bar',
          data: data.map(item => item.s1),
          itemStyle: { color: '#5470c6' },
        },
        {
          name: 'Q2',
          type: 'bar',
          data: data.map(item => item.s2),
          itemStyle: { color: '#91cc75' },
        },
        {
          name: 'Q3',
          type: 'bar',
          data: data.map(item => item.s3),
          itemStyle: { color: '#fac858' },
        },
        {
          name: 'Q4',
          type: 'bar',
          data: data.map(item => item.s4),
          itemStyle: { color: '#ee6666' },
        },
      ]
    },
  },
}
</script>

<template>
  <ZFrame title="城市分季度排放量">
    <div style="text-align: right;">
      <el-radio-group v-model="type" is-button>
        <el-radio-button label="总氮" value="tn" />
        <el-radio-button label="总磷" value="tp" />
      </el-radio-group>
    </div>
    <Echart :options="options" height="320px" width="410px" />
  </ZFrame>
</template>
