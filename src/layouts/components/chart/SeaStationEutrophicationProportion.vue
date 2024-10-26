<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

export default {
  name: 'SeaStationEutrophicationProportion',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        color: ['#FAC01F', '#3AACFF', '#FB466C'],
        series: [
          {
            name: '富营养化程度占比',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 16, name: '中度' },
              { value: 48, name: '轻度' },
              { value: 34, name: '重度' },
            ],
            label: {
              show: true,
              position: 'outside',
              fontSize: 12,
              formatter(param) {
                return `${param.name} (${parseInt(param.percent)}%)`
              },
              color: 'white',
            },
            labelLine: {
              lineStyle: {
                color: 'white',
              },
            },
            emphasis: {
              disabled: true,
            },
          },
        ],
      },
    }
  },
}
</script>

<template>
  <ZFrame title="近岸海域富营养化程度占比">
    <Echart :options="options" height="360px" width="410px" />
  </ZFrame>
</template>
