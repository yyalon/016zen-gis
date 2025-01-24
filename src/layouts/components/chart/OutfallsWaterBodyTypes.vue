<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

import gisData from '@/api/modules/gis'
import eventBus from '@/utils/eventBus'

export default {
  name: 'ChartOutfallsWaterBodyTypes',
  components: { ZFrame, Echart },
  data() {
    return {
      loading: false,
      options: {
        tooltip: {
          trigger: 'item',
          formatter(param) {
            return `${param.name} (${param.percent}%)<br> ${param.value}`
          },
          // formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            fontSize: 16,
          },
        },
        series: [
          {
            name: '受纳水体排口类型统计',
            type: 'pie',
            radius: '50%',
            startAngle: 75,
            data: [],
            label: {
              show: true,
              position: 'outside',
              fontSize: 12,
              formatter(param) {
                return `${param.name} (${param.percent}%)`
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
      param: {},
    }
  },
  mounted() {
    eventBus.on('filterparam1', (param) => {
      this.param = param
      this.getData(param)
    })
  },
  beforeUnmount() {
    // eventBus.off('filterparam')
  },
  methods: {
    getData(param) {
      this.loading = true
      gisData.getOutfallTypeStats(param).then((res) => {
        this.loading = false
        this.options.series[0].data = res.data.chartData.type.map((type, index) => ({ value: res.data.chartData.typeCount[index], name: type }))
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="受纳水体排口类型统计">
    <Echart :options="options" height="360px" width="410px" />
  </ZFrame>
</template>
