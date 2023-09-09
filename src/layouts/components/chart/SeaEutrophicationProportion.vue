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
const colors = [
  '#ffff00',
  '#ff9900',
  '#ff0000',
]
export default {
  components: { ZFrame, Echart },
  props: {
    chartData: {
      type: Object,
      default() { return { year: '', season: '' } },
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
          data: data.map(it => it.label),
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
            name: '富营养化',
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
              length: 2,
              length2: 12,
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
      this.visible = true
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
        if (areas.length !== 3) {
          areas.shift()
        }
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
  <ZFrame :height="220" :title="`${chartData.year || ''}年${seasons[chartData.season] || ''}富营养化面积占比`">
    <Echart v-if="visible" :options="options" height="190px" width="375px" />
  </ZFrame>
</template>
