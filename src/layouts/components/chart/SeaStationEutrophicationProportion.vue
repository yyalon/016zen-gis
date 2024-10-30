<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import gisData from '@/api/modules/gis'

export default {
  name: 'SeaStationEutrophicationProportion',
  components: { ZFrame, Echart },
  data() {
    return {
      loading: false,
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
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      gisData.getSeaWaterEutrophication({ time: '2023-09-01' }).then((res) => {
        this.loading = false
        console.log('近岸海域富营养化程度占比', res)
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="近岸海域富营养化程度占比">
    <Echart :options="options" height="360px" width="410px" />
  </ZFrame>
</template>
