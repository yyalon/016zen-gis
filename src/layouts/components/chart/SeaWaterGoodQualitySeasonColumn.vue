<script>
import ZFrame from '../ZFrame.vue'
import gisData from '@/api/modules/gis'
import Echart from '@/lib/echart/index.vue'
import eventBus from '@/utils/eventBus'

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
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '%',
            max: 100,
          },
          {
            type: 'value',
            name: '%',
            max: 100,
            min: -100,
          },
        ],
        series: [{
          name: '环比',
          type: 'line',
          tooltip: {
            valueFormatter(value) {
              return typeof value !== 'number' ? '-' : `${value}%`
            },
          },
          data: [],
        }, {
          name: '上年同期',
          type: 'bar',
          tooltip: {
            valueFormatter(value) {
              return typeof value !== 'number' ? '-' : `${value}%`
            },
          },
          data: [],
        }, {
          name: '本年度',
          type: 'bar',
          tooltip: {
            valueFormatter(value) {
              return typeof value !== 'number' ? '-' : `${value}%`
            },
          },
          data: [],
        }],
        color: ['#36FF00', '#FFF200', '#00C8FF'],
      },
    }
  },
  created() {
    this.getData()
  },
  async mounted() {
    eventBus.on('refreshSeaWaterQualityChart', (param) => {
      this.getData(param)
    })
  },
  beforeUnmount() {
    eventBus.off('refreshSeaWaterQualityChart')
  },
  methods: {
    getData(param) {
      this.loading = true

      gisData.getSeaWaterQualityTrend(param).then(({ data }) => {
        this.loading = false
        this.options.xAxis[0].data = data.seasons
        this.options.series[0].data = data.waterQualityQoqChanges
        this.options.series[1].data = data.waterQualityYoYChanges
        this.options.series[2].data = data.waterQualityComplianceRates
      })
    },
  },
}
</script>

<template>
  <ZFrame title="近岸海域优良水质面积变化趋势" :loading="loading">
    <Echart :options="options" height="360px" width="410px" @on-finished="loading = flase" />
  </ZFrame>
</template>
