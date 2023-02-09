<template>
  <box1>
    <span slot="title">东海海域入海排口总数{{ sum }}个 </span>
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
    label: '城镇生活污水排污口',
    value: 84
  },
  {
    label: '城镇雨洪排口',
    value: 568
  },
  {
    label: '港口码头排污口',
    value: 105
  },
  {
    label: '工业排污口',
    value: 202
  },
  {
    label: '沟渠、河港（涌）、排干等',
    value: 298
  },
  {
    label: '农业农村排口',
    value: 188
  },
  {
    label: '其它排口',
    value: 3
  }
]
let sum = 0
data.forEach(item => {
  sum += item.value
})
const colors = [
  '55,156,248',
  '164,125,240',
  '225,132,91',
  '175,227,123',
  '42,191,191',
  '255,68,20'
]
export default {
  name: 'ChartPieOutfalls',
  components: { Box1, Echart },
  props: {},
  data() {
    return {
      sum,
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '入海排口类别',
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
