<script>
import dayjs from 'dayjs'
import Echart from '@/lib/echart/index.vue'

const seasons = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  average: '年平均',
}

const types = {
  syl: '石油类(mg/L)',
  hxlxy: '活性磷酸盐(mg/L)',
  wjd: '无机氯(mg/L)',
  hxxyl: '化学需氧量(mg/L)',
  rjy: '溶解氧(mg/L)',
  pH: 'ph值',
}
export default {
  components: { Echart },
  props: {
    chartData: {
      type: Object, default() { return {} },
    },
  },
  data() {
    return {
      type: 'syl',
      types,
      visible: false,
      options: {
        grid: {
          left: '10px',
          right: '15px',
          bottom: '10px',
          top: '30px',
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
            },
            data: [],
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
  watch: {
    chartData: {
      handler() {
        this.update()
      },
      deep: true,
    },
  },
  mounted() {
    this.update()
  },
  methods: {
    selectType() { this.update() },
    update() {
      if (this.chartData.items && this.chartData.items.length > 0) {
        this.options.xAxis[0].data = []
        this.options.series[0].data = []
        const years = {}
        this.chartData.items.forEach((item) => {
          const year = dayjs(item.minitor_month).year()
          years[year] = 1
        })
        for (const key in years) {
          let count = 0
          let sum = 0
          this.chartData.items.forEach((item) => {
            if (key === dayjs(item.minitor_month).format('YYYY')) {
              count++
              sum += parseFloat(item.eIndex)
            }
          })
          const average = sum / count
          this.options.xAxis[0].data.push(key)
          this.options.series[0].data.push(average.toFixed(5))
        }
        this.visible = true
      }
    },
  },
}
</script>

<template>
  <div class="chart">
    <h5 class="chart-title">
      海水富营养化指数年平均变化趋势
    </h5>
    <Echart v-if="visible" :options="options" height="220px" width="375px" />
  </div>
</template>

<style lang="scss" scoped>
.chart {
  display: flex;
  flex-direction: column;

  .chart-title {
    margin: 10px 0 0 10px;

    .select-type {
      width: 120px;
    }
  }
}
</style>
