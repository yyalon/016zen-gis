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
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 65,
            end: 85,
          },
          {
            type: 'inside',
            realtime: true,
            start: 65,
            end: 85,
          },
        ],
        grid: {
          left: '10px',
          top: '10px',
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
          },
        ],
        series: [
          {
            name: '达标断面数',
            type: 'bar',
            barWidth: '8px',
            data: [],
          },
          {
            name: '不达标断面数',
            type: 'bar',
            barWidth: '8px',
            data: [],
          },
        ],
      },
      param: {},
    }
  },
  async mounted() {
    await this.delay(1000)
    await this.getData()

    eventBus.on('filterparam', (param) => {
      // console.log('water:filterparam:', param)
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
      const res = await ApiData.getRiverSectionOverall(param)
      // res.data = []
      // console.log('getRiverSectionOverall:', res)
      if (res && res.code === 1000) {
        const data = res.data.filter(e => e.result === '达标')
        const data1 = res.data.filter(e => e.result === '不达标')
        this.options.series[0].data = data.map(e => e.value)
        this.options.xAxis[0].data = data.map(e => `${e.WQ_INF_YEAR}${e.WQ_INF_MONTH}`)
        this.options.series[1].data = data1.map(e => e.value)
        // this.options.xAxis[1].data = data1.map((e) => e.WQ_INF_YEAR)
        this.visible = true
      }
      this.visible = true
    },
  },
}
</script>

<template>
  <ZFrame :height="264" title="入海河流断面水质总体达标情况">
    <Echart v-if="visible" :options="options" height="228px" width="450px" />
  </ZFrame>
</template>
