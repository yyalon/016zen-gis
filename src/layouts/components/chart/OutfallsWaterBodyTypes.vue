<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

export default {
  name: 'ChartOutfallsWaterBodyTypes',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        color: ['#FAC01F', '#3AACFF', '#FB466C'],
        series: [
          {
            name: '受纳水体排口类型统计',
            type: 'pie',
            radius: '50%',
            startAngle: 75,
            data: [
              { value: 16, name: '工业排污口' },
              { value: 48, name: '城镇污水处理厂排污口' },
              { value: 34, name: '农业排口' },
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
  <ZFrame title="受纳水体排口类型统计">
    <Echart :options="options" height="360px" width="410px" />
  </ZFrame>
</template>
