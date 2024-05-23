<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import apiData from '@/api/modules/data'
import eventBus from '@/utils/eventBus'

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
const colors = ['#91cc75', '#3ba272', '#ee6666', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
export default {
  components: { ZFrame, Echart },
  data() {
    return {
      visible: false,
      param: {
        flag: false,
      },
      options: {
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '10%',
          data: data.map((it) => it.label),
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
            // left: '0',
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
      loading: false,
    }
  },
  mounted() {
    this.visible = true
    this.getData(this.param)

    eventBus.on('filterparam', (param) => {
      // console.log('quality:filterparam:', param)
      param.flag = this.param.flag
      this.param = param
      this.getData(this.param)
    })
  },
  beforeUnmount() {
    eventBus.off('filterparam')
  },
  methods: {
    async getData(param) {
      this.loading = true
      const result1 = await apiData.getRiverSectionAreaRatio(param)
      if (result1 && result1.code === 1000 && result1.data) {
        const opt = {
          legend: {
            orient: 'vertical',
            top: 'center',
            right: '10%',
            data: [],
            textStyle: {
              color: '#fff',
              fontSize: 12,
            },
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              saveAsImage: { show: true },
            },
          },
          series: [
            {
              top: '0%',
              name: '水质类别',
              type: 'pie',
              // left: '0',
              radius: ['30%', '70%'],
              center: ['50%', '50%'],
              roseType: 'radius',
              label: {
                show: true,
                position: 'outside',
                fontSize: 14,
                formatter(param) {
                  return `${param.name} (${parseInt(param.percent)}%)`
                },
                color: 'white',
              },
              labelLine: {
                length: 2,
                length2: 12,
              },
              data: result1.data.map((it, i) => {
                return {
                  value: it.value,
                  name: `${it.label}`,
                  itemStyle: {
                    color: `${colors[i]}`,
                  },
                }
              }),
            },
          ],
        }
        this.options = opt
        // console.log('getRiverSectionAreaRatio:', result1)
      }
      this.loading = false
    },
    handleClick() {
      this.param.flag = !this.param.flag
      this.getData(this.param)
    },
  },
}
</script>

<template>
  <ZFrame :height="264" title="入海河流断面水质类别占比" @click="handleClick">
    <Echart v-if="visible" v-loading="loading" :options="options" height="228px" width="450px" />
  </ZFrame>
</template>
