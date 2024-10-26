<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import ApiData from '@/api/modules/data'
import eventBus from '@/utils/eventBus'

export default {
  components: { ZFrame, Echart },
  data() {
    return {
      visible: false,
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          left: 'center',
          top: 'top',
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 65,
            end: 85,
          },
        ],
        grid: {
          left: '10px',
          top: '35px',
          right: '10px',
          bottom: '10px',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: ['2016', '2017', '2018', '2019', '2020', '2021'],
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '%',
            max: 100,
          },
        ],
        series: [
          {
            name: '同比变化',
            type: 'line',
            tooltip: {
              valueFormatter(value) {
                return `${value}%`
              },
            },
            data: [],
          },
          {
            name: '不达标',
            type: 'bar',
            barWidth: '8px',
            tooltip: {
              valueFormatter(value) {
                return `${value}%`
              },
            },
            data: [],
          },
          {
            name: '达标',
            type: 'bar',
            barWidth: '8px',
            tooltip: {
              valueFormatter(value) {
                return `${value}%`
              },
            },
            data: [],
          },
        ],
        color: ['#36FF00', '#FFF200', '#00C8FF'],
      },
      param: {},
      loading: false,
    }
  },
  async mounted() {
    await this.delay(1000)
    await this.getData()

    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })
  },
  beforeUnmount() {
    eventBus.off('filterparam')
  },
  methods: {
    delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
    handleSearch(data) {
      // console.log('handleSearch')
    },
    async getData(param) {
      this.loading = true
      const res = await ApiData.getRiverSectionOverall(param)
      // res.data = []
      // console.log('getRiverSectionOverall:', res)
      if (res && res.code === 1000) {
        const data = []
        res.data.forEach((e) => {
          const key = `${e.WQ_INF_YEAR}-${e.WQ_INF_MONTH}`
          const index = data.findIndex((o) => o.key === key)
          if (index === -1) {
            data.push({
              ...e,
              key,
              [e.result]: e.value,
            })
          }
          else {
            data[index][e.result] = e.value
            data[index].value = Number(data[index].value) + Number(e.value)
          }
        })
        data.sort((a, b) => {
          return new Date(a.key) - new Date(b.key)
        })
        this.options.xAxis[0].data = data.map(e => e.key)
        this.options.series[0].data = data.map(e => ((e['达标'] - e['不达标']) / e.value * 100).toFixed(0))
        this.options.series[1].data = data.map(e => (e['不达标'] / e.value * 100).toFixed(0))
        this.options.series[2].data = data.map(e => (e['达标'] / e.value * 100).toFixed(0))
        // this.options.xAxis[1].data = data1.map((e) => e.WQ_INF_YEAR)
        this.visible = true
      }
      this.visible = true
      this.loading = false
    },
  },
}
</script>

<template>
  <ZFrame title="河流水质达标趋势分析">
    <Echart v-if="visible" v-loading="loading" :options="options" height="360px" width="410px" />
  </ZFrame>
</template>
