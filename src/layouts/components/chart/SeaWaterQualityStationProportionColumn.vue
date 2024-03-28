<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

const seas = {
  all: { value: 'all', label: '所有海域', name: '所有海域', short: '所有' },
  shanghai: { value: 'shanghai', label: '上海海域', name: '上海市', short: '上海' },
  jiangsu: { value: 'jiangsu', label: '江苏海域', name: '江苏省', short: '江苏' },
  zhejiang: { value: 'zhejiang', label: '浙江海域', name: '浙江省', short: '浙江' },
}

const seasons = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  average: '年平均',
}

const legends = {
  1: {
    color: '#73b2ff',
    label: '优良',
  },
  2: { color: '#beb1a1', label: '三类' },
  3: { color: '#9b856e', label: '四类' },
  4: { color: '#7a624a', label: '劣四类' },
}

const arylegends = ['优良水质', '三类水质', '四类水质', '劣四类']

const arySeasons = ['spring', 'summer', 'autumn', 'average']
const arySeas = ['shanghai', 'jiangsu', 'zhejiang', 'all']
const aryYears = [2019, 2020, 2021, 2022, 2023]

export default {
  components: { ZFrame, Echart },
  props: {
    chartData: {
      type: Object,
      default() {
        return { year: '', season: '' }
      },
    },
  },
  data() {
    return {
      loading: false,
      legends,
      seas,
      seasons,
      options: {
        tooltip: {
          trigger: 'axis',
          formatter(param) {
            let label = `<b style="font-size:16px">${param[0].name}</b><br>`
            param.forEach((item) => {
              label += `${item.seriesName} 占比${parseFloat(item.value) || '-'}%<br>`
            })
            return label
          },
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '15%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: arylegends,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: aryYears.map((year) => {
          return {
            name: year,
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            data: arySeasons.map((key) => {
              return 0
            }),
          }
        }),
      },
    }
  },
  watch: {
    chartData: {
      deep: true,
      immediate: true,
      handler() {
        this.update()
      },
    },
  },
  methods: {
    update() {
      this.loading = true
      if (this.chartData.areas) {
        this.options.series = aryYears.map((year) => {
          const name = `wq-${year}-average`
          const sums = [0, 0, 0, 0]
          const proportions = [0, 0, 0, 0]
          let sumWhole = 0 // 单个省份海域的总面积
          if (this.chartData.areas[name]) {
            for (const key in this.chartData.areas[name]) {
              const areas = this.chartData.areas[name][key] || []
              areas.forEach((item) => {
                for (const value in legends) {
                  const wqLevel = parseInt(value)
                  if (wqLevel === 1) {
                    if (item.value === 1 || item.value === 2) {
                      sums[0] += item.area
                    }
                  }
                  else {
                    if (item.value === wqLevel + 1) {
                      sums[value - 1] += item.area
                    }
                  }
                }
                sumWhole += item.area
              })
            }
          }
          sums.forEach((sum, index) => {
            proportions[index] = ((sum / sumWhole) * 100).toFixed(1)
          })

          return {
            name: year,
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            data: proportions,
          }
        })
      }
    },
  },
}
</script>

<template>
  <ZFrame :height="220" title="管辖海域水质点位比例（%）" :loading="loading">
    <Echart :options="options" height="190px" width="375px" @on-finished="loading = flase" />
  </ZFrame>
</template>
