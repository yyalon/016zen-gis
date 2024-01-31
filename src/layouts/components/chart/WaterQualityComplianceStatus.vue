<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import ApiData from '@/api/modules/data'

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
            name: '总体水质达标断面数',
            type: 'bar',
            barWidth: '8px',
            data: [],
          },
          {
            name: '总体水质不达标断面数',
            type: 'bar',
            barWidth: '8px',
            data: [],
          },
        ],
      },
    }
  },
  async mounted() {
    await this.delay(1000)
    const res = await ApiData.getRiverSectionOverall()
    // console.log('getRiverSectionOverall:', res)
    if (res && res.code === 1000) {
      const data = res.data

      const data1 = []
      // for (let i = 0; i < 6; i++) {
      //   data.push(round(random(3, 8), 0))
      //   data1.push(9 - data[i])
      // }
      this.options.series[0].data = data.map(e => e.value)
      this.options.xAxis[0].data = data.map(e => e.WQ_INF_YEAR)
      // this.options.series[1].data = data1
      this.visible = true
    }
    this.visible = true
  },
  methods: {
    delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
  },
}
</script>

<template>
  <ZFrame :height="220" title="入海河流断面水质总体达标情况">
    <Echart v-if="visible" :options="options" height="190px" width="375px" />
  </ZFrame>
</template>
