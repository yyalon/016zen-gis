<template>
  <box1>
    <span slot="title">2022年入海河流断面水质类别面积占比 </span> 
    <Echart
      :options="options"
      style="text-align:center;"
      height="160px"
      width="340px"
    />  
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
const data = [
  {
    label: 'I类',
    value: 720
  },
  {
    label: 'II类',
    value: 430
  },
  {
    label: 'III类',
    value: 580
  },
  {
    label: 'IV类',
    value: 130
  },
  {
    label: 'V类',
    value: 674
  },
  {
    label: '劣V类',
    value: 240
  }
]
const colors = [
  '55,156,248',
  '164,125,240',
  '225,132,91',
  '175,227,123',
  '42,191,191',
  '255,68,20'
]
export default {
  name: 'ChartPiePollutions',
  components: { Box1, Echart },
  props: {},
  data() {
    return {
      options: {
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '2%',
          data: data.map(it => it.label),
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '水质类别',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['50%', '40%'],
            roseType: 'radius',
            label: {
              show: true,
              position: 'outside',
              fontSize: 12
            },
            labelLine: {
              length: 2,
              length2: 7
            },
            data: data.map((it, i) => {
              return {
                value: it.value,
                name: it.label,
                itemStyle: {
                  color: `rgba(${colors[i]},0.7)`
                }
              }
            })
          }
        ]
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
::v-deep .box-content {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  font-size: 14px;
}
.data-value {
  font-size: 20px;
  color: #ffc162;
  line-height: 1.2;
}
</style>
