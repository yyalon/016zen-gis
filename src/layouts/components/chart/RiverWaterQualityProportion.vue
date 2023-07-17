<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

const data = [
  {
    label: 'I类',
    value: 720,
  },
  {
    label: 'II类',
    value: 430,
  },
  {
    label: 'III类',
    value: 580,
  },
  {
    label: 'IV类',
    value: 130,
  },
  {
    label: 'V类',
    value: 674,
  },
  {
    label: '劣V类',
    value: 240,
  },
]
const colors = [
  '#4a90e2',
  '#6ea2cf',
  '#81adc6',
  '#b5cda7',
  '#e1e787',
  '#fffb6e',
]
export default {
  components: { ZFrame, Echart },
  data() {
    return {
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
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            fontSize: 16,
          },
        },
        series: [
          {
            top: '10%',
            name: '水质类别',
            type: 'pie',
            left: '0',
            radius: ['30%', '70%'],
            center: ['40%', '50%'],
            roseType: 'radius',
            label: {
              show: true,
              position: 'outside',
              fontSize: 16,
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
  mounted() {
    this.visible = true
  },
}
</script>

<template>
  <ZFrame :height="220" title="入海河流断面水质类别面积占比">
    <Echart v-if="visible" :options="options" height="190px" width="375px" />
  </ZFrame>
</template>
