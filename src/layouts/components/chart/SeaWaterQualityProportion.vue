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
  1: {
    color: '#73b2ff',
    label: '一类',
  },
  2: { color: '#b2ddf7', label: '二类' },
  3: { color: '#beb1a1', label: '三类' },
  4: { color: '#9b856e', label: '四类' },
  5: { color: '#7a624a', label: '劣四类' },
}

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
      seas,
      seasons,
      legend,
      options: {
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '10%',
          data: [],
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter(param) {
            return `${param.name} (${param.percent}%)<br>${window.$ZMap.MeasureUtil.formatArea(param.value)}`
          },
          textStyle: {
            fontSize: 16,
          },
        },
        series: [
          {
            top: '0%',
            name: '水质类别',
            type: 'pie',
            left: '0',
            radius: ['30%', '70%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              show: true,
              formatter(param) {
                return `${param.name} (${parseInt(param.percent)}%)`
              },
              position: 'outside',
              fontSize: 14,
              color: 'white',
            },
            labelLine: {
              length: 1,
              length2: 5,
            },
            data: [],
          },
        ],
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
      if (this.chartData.year && this.chartData.season && this.chartData.areas) {
        const name = `wq-${this.chartData.year}-${this.chartData.season}`
        const areas = this.chartData.areas[name]
        if (areas) {
          const proportion = {}
          if (this.chartData.province === 'all') {
            for (const key in areas) {
              areas[key].forEach((item) => {
                if (proportion[item.value]) {
                  proportion[item.value] += item.area
                }
                else {
                  proportion[item.value] = item.area
                }
              })
            }
          }
          else {
            areas[this.chartData.province].forEach((item) => {
              if (proportion[item.value]) {
                proportion[item.value] += item.area
              }
              else {
                proportion[item.value] = item.area
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
        }
        else {
          this.options.series[0].data = []
        }
      }
    },
  },
}
</script>

<template>
  <ZFrame :height="220" :title="`${seas[chartData?.province]?.label || ''}${chartData?.year || ''}年${seasons[chartData?.season] || ''}海水水质类别面积占比`" :loading="loading">
    <Echart :options="options" height="190px" width="375px" @on-finished="loading = flase" />
  </ZFrame>
</template>
