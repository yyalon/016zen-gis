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

const legend = {
  1: { color: '#73b2ff', label: '正常' },
  2: { color: '#ffff00', label: '轻度' },
  3: { color: '#ff9900', label: '中度' },
  4: { color: '#ff0000', label: '重度' },
}

const arySeasons = ['spring', 'summer', 'autumn', 'average']
const arySeas = ['shanghai', 'jiangsu', 'zhejiang', 'all']
// const aryYears = [2019, 2020, 2021, 2022, 2023]
const aryYears = [2021, 2022]

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
      legend,
      seas,
      seasons,
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          left: 'center',
          top: 'top',
        },
        grid: {
          left: '10px',
          top: '35px',
          right: '10px',
          bottom: '10px',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: arySeasons.map((key) => {
              return seasons[key]
            }),
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '%',
            max: 100,
          },
        ],
        series: [{
          name: '同比变化',
          type: 'line',
          tooltip: {
            valueFormatter(value) {
              return `${value}%`
            },
          },
          data: [],
        }].concat(aryYears.map((year) => {
          return {
            name: year,
            type: 'bar',
            barWidth: '8px',
            tooltip: {
              valueFormatter(value) {
                return `${value}%`
              },
            },
            data: arySeasons.map((key) => {
              return 0
            }),
          }
        })),
        color: ['#36FF00', '#FFF200', '#00C8FF'],
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
      console.log('this.chartData.areas', this.chartData.areas)
      if (this.chartData.areas) {
        aryYears.forEach((year, yearIndex) => {
          const sums = {}
          arySeasons.forEach((season) => {
            const name = `wq-${year}-${season}`
            let sumGood = 0 // 单个省份海域的良好水质面积
            let sumWhole = 0 // 单个省份海域的总面积
            if (this.chartData.areas[name]) {
              for (const key in this.chartData.areas[name]) {
                const areas = this.chartData.areas[name][key] || []
                areas.forEach((item) => {
                  if (item.value === 1 || item.value === 2) {
                    sumGood += item.area
                  }
                  sumWhole += item.area
                })
              }
            }

            sums[season] = ((sumGood / sumWhole) * 100).toFixed(1)
          })

          this.options.series[yearIndex + 1].data = arySeasons.map((key) => {
            return sums[key]
          })
        })
        this.options.series[0].data = this.options.series[2].data.map((value, idx) => (value - this.options.series[1].data[idx]).toFixed(1))
      }
    },
  },
}
</script>

<template>
  <ZFrame title="近岸海域优良水质面积变化趋势" :loading="loading">
    <Echart :options="options" height="100%" width="100%" @on-finished="loading = flase" />
  </ZFrame>
</template>
