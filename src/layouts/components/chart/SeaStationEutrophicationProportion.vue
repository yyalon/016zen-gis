<script lang="ts">
import ZFrame from '../ZFrame.vue'
import gisData from '@/api/modules/gis'
import Echart from '@/lib/echart/index.vue'

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
            data: [],
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
      gisData.getSeaWaterEutrophication({ time: '2024-08' }).then(({ data }) => {
        this.loading = false
        this.options.color = data.color
        for (let i = 0; i < data.names.length; i++) {
          const name = data.names[i]
          const num = data.data[i]
          this.options.series[0].data.push({
            value: num, name,
          })
        }

        console.log('getSeaWaterEutrophication', this.options)
      })
    },
  },
}
</script>

<template>
  <ZFrame title="近岸海域富营养化程度占比">
    <Echart :options="options" height="360px" width="410px" />
  </ZFrame>
</template>
