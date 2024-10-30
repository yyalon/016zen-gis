<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

import gisData from '@/api/modules/gis'

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
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      gisData.getOutfallTypeStats({ time: '2023-09-01' }).then((res) => {
        this.loading = false
        this.options.series[0].data = res.data.chartData.type.map((type, index) => ({ value: res.data.chartData.typeCount[index], name: type }))
        console.log('受纳水体排口类型统计', res)
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
