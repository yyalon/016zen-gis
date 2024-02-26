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

const rawData = [
  [11100, 302, 301, 334],
  [1320, 132, 101, 134],
  [220, 182, 191, 234],
  [150, 212, 201, 154],
  [820, 832, 901, 934],
]
const totalData = []
for (let i = 0; i < rawData[0].length; ++i) {
  let sum = 0
  for (let j = 0; j < rawData.length; ++j) {
    sum += rawData[j][i]
  }
  totalData.push(sum)
}

const series = ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine'].map((name, sid) => {
  return {
    name,
    type: 'bar',
    stack: 'total',
    barWidth: '60%',
    label: {
      show: true,
      formatter: (params) => `${Math.round(params.value * 1000) / 10}%`,
    },
    data: rawData[sid].map((d, did) => (totalData[did] <= 0 ? 0 : d / totalData[did])),
  }
})

console.log(series)

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
        yAxis: {
          type: 'value',
        },
        xAxis: {
          type: 'category',
          data: ['江苏省', '上海市', '浙江省', '整体'],
        },
        series,
      },
    }
  },
  watch: {
    chartData() {
      // this.update()
    },
  },
  mounted() {
    this.visible = true
  },
  methods: {
    update() {
      if (this.chartData.year && this.chartData.season && this.chartData.areas) {
        const name = `e-${this.chartData.year}-${this.chartData.season}`
        const areas = this.chartData.areas[name]
        if (areas) {
          const proportion = {}
          if (this.chartData.province === 'all') {
            for (const key in areas) {
              areas[key].forEach((item) => {
                if (item.value !== 1) {
                  if (proportion[item.value]) {
                    proportion[item.value] += item.area
                  } else {
                    proportion[item.value] = item.area
                  }
                }
              })
            }
          } else {
            areas[this.chartData.province].forEach((item) => {
              if (item.value !== 1) {
                if (proportion[item.value]) {
                  proportion[item.value] += item.area
                } else {
                  proportion[item.value] = item.area
                }
              }
            })
          }
          this.options.series[0].data = []
          for (const key in proportion) {
            this.options.series[0].data.push({
              value: proportion[key],
              name: this.legend[key].label,
              itemStyle: {
                color: `${this.legend[key].color}`,
              },
            })
          }
        } else {
          this.options.series[0].data = []
        }
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
