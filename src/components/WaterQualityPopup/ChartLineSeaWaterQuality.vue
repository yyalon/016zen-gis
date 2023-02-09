<template>
  <div class="filters" style="text-align:center;padding:0;">
    <el-select
      @change="handleChange"
      v-model="type"
      :clearable="true"
      placeholder="请选择监测指标"
      size="mini"
    >
      <el-option
        v-for="(type, key) in types"
        :key="key"
        :label="type"
        :value="key"
      />
    </el-select>
    <Echart
      :options="options"
      style="text-align:center;"
      height="240px"
      width="280px"
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
  name: 'ChartWaterQualityRealtime',
  components: { Echart },
  props: {},
  data() {
    return {
      type: 'conductivity',
      types,
      options: {
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 20,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
              margin: 15,
              color: '#078ceb',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false
            },
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'category',
            boundaryGap: true,
            show: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 4,
            axisLabel: {
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'line',
            symbolSize: 6, //空心标记的大小
            smooth: false, //是否平滑曲线显示
            smoothMonotone: 'x', //指明是在 x 轴或者 y 轴上保持单调性
            areaStyle: {
              opacity: 0.2,
              pieces: [
                {
                  gt: 5.5,
                  lte: 6.5,
                  color: '#4a0daf'
                },
                {
                  gt: 6.5,
                  lte: 7.5,
                  color: '#0566aa'
                },
                {
                  gt: 7.5,
                  lte: 10,
                  color: '#dba70a'
                },
                {
                  gt: 10,
                  lte: 12,
                  color: '#FF4200'
                },
                {
                  gt: 12,
                  color: '#CC0033'
                }
              ],
              outOfRange: {
                color: '#06965e'
              }
            },
            data: [],
            markLine: {
              //预警线
              silent: true,
              symbol: ['circle', 'none'], //标线两端的标记类型
              symbolSize: 5,
              label: {
                show: false
              },
              lineStyle: {
                color: '#ba252b',
                opacity: 0.3
              },
              data: [
                {
                  yAxis: 5.5
                },
                {
                  yAxis: 6.5
                },
                {
                  yAxis: 7.5
                },
                {
                  yAxis: 10
                },
                {
                  yAxis: 12
                }
              ]
            },
            lineStyle: {
              width: 3
            },
            itemStyle: {
              color: '#404a59',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'top',
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    this.options.xAxis[0].data = [
      '202101',
      '202102',
      '202103',
      '202104',
      '202105',
      '202106'
    ]
    const data = []
    for (let i = 0; i < 6; i++) {
      data.push(_.round(_.random(1.1, 6.9), 1))
    }
    this.options.series[0].data = data
  },
  methods: {
    handleChange() {
      const data = []
      for (let i = 0; i < 6; i++) {
        data.push(_.round(_.random(1.1, 6.9), 1))
      }
      this.options.series[0].data = data
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
