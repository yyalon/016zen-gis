<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

const seasons = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  average: '年平均',
}

const data = []
const colors = ['#73b2ff', '#b2ddf7', '#beb1a1', '#9b856e', '#7a624a']
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
      seasons,
      visible: false,
      options: {
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '10%',
          data: data.map((it) => it.label),
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter(param) {
            return `${param.name} (${param.percent * 2}%)<br>${window.$ZMap.MeasureUtil.formatArea(param.value)}`
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
            data: data.map((it, i) => {
              return {
                value: it.value,
                name: it.label,
                itemStyle: {
                  color: `${colors[i]}`,
                },
              }
            }),
          },
        ],
      },
    }
  },
  watch: {
    chartData() {
      this.update()
    },
  },
  mounted() {
    this.update()
    this.visible = true
  },
  methods: {
    update() {
      const { areas } = this.chartData
      if (areas && areas.length > 0) {
        this.options.series[0].data = areas.map((it, i) => {
          return {
            value: it.value,
            name: it.label,
            itemStyle: {
              color: `${colors[i]}`,
            },
          }
        })
      }
    },
  },
}
</script>

<template>
  <ZFrame :height="220" :title="`${chartData.province}${chartData.year || ''}年${seasons[chartData.season] || ''}海水水质类别面积占比`">
    <Echart v-if="visible" :options="options" height="190px" width="375px" />
  </ZFrame>
</template>
