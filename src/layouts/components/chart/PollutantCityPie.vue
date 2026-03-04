<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

export default {
  name: 'PollutantCityPie',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        title: {
          text: '排放占比',
          left: 'center',
          top: 5,
          textStyle: { fontSize: 14, color: '#fff' },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
        },
      },
      type: 'tn',
      quarter: 's1',
      chartData: {},
    }
  },
  watch: {
    type() {
      this.update()
    },
    quarter() {
      this.update()
    },
  },
  async mounted() {
    const response = await fetch('/pollutant/chart2_city_pie.json')
    this.chartData = await response.json()
    this.update()
  },
  methods: {
    update() {
      const data = this.chartData[this.type][this.quarter]
      const typeName = this.type === 'tn' ? '总氮' : '总磷'
      const quarterName = { s1: 'Q1', s2: 'Q2', s3: 'Q3', s4: 'Q4' }[this.quarter]

      this.options.title.text = `${quarterName} ${typeName}排放占比`
      this.options.series = [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {d}%',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          data: data.map(item => ({
            name: item.city,
            value: item.total,
          })),
        },
      ]
    },
  },
}
</script>

<template>
  <ZFrame title="城市占比统计">
    <div style="display: flex; justify-content: space-between;">
      <el-radio-group v-model="quarter" is-button>
        <el-radio-button label="Q1" value="s1" />
        <el-radio-button label="Q2" value="s2" />
        <el-radio-button label="Q3" value="s3" />
        <el-radio-button label="Q4" value="s4" />
      </el-radio-group>
      <el-radio-group v-model="type" is-button>
        <el-radio-button label="总氮" value="tn" />
        <el-radio-button label="总磷" value="tp" />
      </el-radio-group>
    </div>
    <Echart :options="options" height="320px" width="410px" />
  </ZFrame>
</template>
