<template>
  <div>
    <Echart
      :options="options"
      style="text-align:center;"
      height="140px"
      width="600px"
    />
  </div>
</template>

<script>
import Echart from '@/common/echart'

const types = {
  conductivity: '电导率(mg/L)',
  TP: 'T-P(mg/L)',
  TN: 'T-N(mg/L)',
  Cu: 'Cu(mg/L)',
  Zn: 'Zn(mg/L)',
  Pb: 'Pb(mg/L)',
  Cd: 'Cd(mg/L)',
  BOD5: 'BOD5(mg/L)',
  TAs: 'T-As(mg/L)',
  THg: 'T-Hg(mg/L)',
  Cr6p: 'Cr6+(mg/L)',
  Fm: 'F-(mg/L)',
  CNm: 'CN-(mg/L)',
  phenol: '挥发酚(mg/L)',
  oils: '石油类(mg/L)',
  LAS: 'LAS(mg/L)',
  S2m: 'S2-(mg/L)',
  Chla: 'Chla(mg/L)',
  NO3m: 'NO3-(mg/L)',
  NO2m: 'NO2-(mg/L)',
  flow: '流量(m3/s)',
  stage: '水位(s/m)',
  transparent: '透明度(cm)',
  salt: '盐度(‰)	',
  do: '溶解氧(mg/L)',
  temperature: '水温(℃)	',
  ph: 'pH值',
  CODMn: 'COD Mn(mg/L)',
  CODCr: 'COD Cr(mg/L)',
  NH3mN: 'NH₃-N(mg/L)'
}
export default {
  name: 'ChartTNYears',
  components: { Echart },
  props: {},
  data() {
    return {
      type: 'conductivity',
      types,
      options: {
        title: {
          top: '0',
          left: 'center',
          text: '总氮的年度均值趋势和变化率',
          textStyle: {
            align: 'center',
            color: '#FFFFFF',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '总氮的年度均值',
            type: 'bar',
            barWidth: '5px',
            data: []
          },
          {
            name: '变化率',
            type: 'line',
            data: []
          }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    this.options.xAxis[0].data = [
      '2016',
      '2017',
      '2018',
      '2019',
      '2020',
      '2021'
    ]
    const data = []
    for (let i = 0; i < 6; i++) {
      data.push(_.round(_.random(1.1, 6.9), 1))
    }
    this.options.series[0].data = data
    this.options.series[1].data = data
  },
  methods: {}
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
