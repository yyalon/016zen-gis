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

const arySeas = ['shanghai', 'jiangsu', 'zhejiang', 'all']
const years = [2020, 2021, 2022, 2023]

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
      legend,
      seas,
      seasons,
      visible: false,
      options: {
        tooltip: {
          trigger: 'item',
          formatter(param) {
            return `${param.name} ${param.seriesName} 占比 ${param.value}% `
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
            data: arySeas.map((key) => {
              return seas[key].name
            }),
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [],
      },
    }
  },
  watch: {
    chartData() {
      this.update()
    },
  },
  mounted() {
    this.visible = true
  },
  methods: {
    update() {
      if (this.chartData.areas) {
        this.options.series = years.map((year) => {
          const name = `wq-${year}-average`
          const sums = {}
          let sumAllGood = 0 // 所有海域良好水质面积
          let sumAllWhold = 0 // 所有海域整体面积
          for (const key in seas) {
            if (key !== 'all') {
              let sumGood = 0 // 单个省份海域的良好水质面积
              let sumWhole = 0 // 单个省份海域的总面积
              if (this.chartData.areas[name]) {
                const areas = this.chartData.areas[name][key] || []
                areas.forEach((item) => {
                  if (item.value === 1 || item.value === 2) {
                    sumGood += item.area
                    sumAllGood += item.area
                  }
                  sumWhole += item.area
                  sumAllWhold += item.area
                })
              }
              sums[key] = ((sumGood / sumWhole) * 100).toFixed(1)
            }
          }
          sums.all = ((sumAllGood / sumAllWhold) * 100).toFixed(1)

          return {
            name: year,
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            data: arySeas.map((key) => {
              return sums[key]
            }),
          }
        })
        console.log(this.options.series)
      }
    },
  },
}
</script>

<template>
  <ZFrame :height="220" title="优良水质面积比例">
    <Echart v-if="visible" :options="options" height="190px" width="375px" />
  </ZFrame>
</template>
