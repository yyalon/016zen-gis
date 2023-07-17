<script>
import { random, round } from 'lodash-es'
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

const types = {
  oils: '石油类(mg/L)',
  ap: '活性磷酸盐(mg/L)',
  ic: '无机氯(mg/L)',
  cod: '化学需氧量(mg/L)',
  do: '溶解氧(mg/L)',
  ph: 'ph值',
}
export default {
  components: { ZFrame, Echart },
  data() {
    return {
      type: 'do',
      types,
      visible: false,
      options: {
        grid: {
          left: '10px',
          right: '10px',
          bottom: '10px',
          top: '10px',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
              // 坐标轴刻度标签的相关设置。
              interval: 0, // 设置为 1，表示『隔一个标签显示一个标签』
              margin: 15,
              color: '#078ceb',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12,
            },
            axisTick: {
              // 坐标轴刻度相关设置。
              show: false,
            },
            axisLine: {
              // 坐标轴轴线相关设置
              lineStyle: {
                color: '#fff',
                opacity: 0.2,
              },
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: 'category',
            boundaryGap: true,
            show: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 4,
            axisLabel: {
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            type: 'line',
            symbolSize: 6, // 空心标记的大小
            areaStyle: {
              opacity: 0.8,
              pieces: [
                {
                  gt: 5.5,
                  lte: 6.5,
                  color: '#4a0daf',
                },
                {
                  gt: 6.5,
                  lte: 7.5,
                  color: '#0566aa',
                },
                {
                  gt: 7.5,
                  lte: 10,
                  color: '#dba70a',
                },
                {
                  gt: 10,
                  lte: 12,
                  color: '#FF4200',
                },
                {
                  gt: 12,
                  color: '#CC0033',
                },
              ],
              outOfRange: {
                color: '#06965e',
              },
            },
            data: [],
            markLine: {
              // 预警线
              silent: true,
              symbol: ['circle', 'none'], // 标线两端的标记类型
              symbolSize: 5,
              label: {
                show: false,
              },
              lineStyle: {
                color: '#ba252b',
                opacity: 0.8,
              },
              data: [
                {
                  yAxis: 5.5,
                },
                {
                  yAxis: 6.5,
                },
                {
                  yAxis: 7.5,
                },
                {
                  yAxis: 10,
                },
                {
                  yAxis: 12,
                },
              ],
            },
            lineStyle: {
              width: 2,
              color: '#2d8cf0',
            },
            itemStyle: {
              color: '#2d8cf033',
              borderWidth: 2,
            },
            label: {
              show: true,
              position: 'top',
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12,
            },
          },
        ],
      },
    }
  },
  mounted() {
    this.options.xAxis[0].data = [
      '202101',
      '202102',
      '202103',
      '202104',
      '202105',
      '202106',
    ]
    const data = []
    for (let i = 0; i < 6; i++) {
      data.push(round(random(1.1, 6.9), 1))
    }
    this.options.series[0].data = data
    this.visible = true
  },
}
</script>

<template>
  <ZFrame :height="220" title="主要污染物浓度趋势图">
    <Echart v-if="visible" :options="options" height="190px" width="375px" />
  </ZFrame>
</template>
