<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

export default {
  name: 'ChartOutfallsWaterBodyTypes',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    }
  },
}
</script>

<template>
  <ZFrame title="受纳水体排口类型统计">
    <Echart :options="options" height="281px" width="410px" />
  </ZFrame>
</template>
