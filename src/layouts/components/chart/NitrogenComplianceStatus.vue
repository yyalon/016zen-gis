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
            name: '总氮达标断面数',
            type: 'bar',
            barWidth: '5px',
            data: [],
          },
          {
            name: '总氮不达标断面数',
            type: 'bar',
            barWidth: '5px',
            data: [],
          },
        ],
      },
    }
  },
  async mounted() {
    const res = await ApiData.getRiverSectionTotalDan()
    // console.log('getRiverSectionTotalDan', res)
    if (res && res.code === 1000) {
      const data = res.data
      this.options.xAxis[0].data = data.map(e => e.WQ_INF_YEAR)

      this.options.series[0].data = data.map(e => e.N2023)
      // this.options.series[1].data = data1
      this.visible = true

      // this.options.xAxis[0].data = [
      //   '2016',
      //   '2017',
      //   '2018',
      //   '2019',
      //   '2020',
      //   '2021',
      // ]
      // const data = []
      // const data1 = []
      // for (let i = 0; i < 6; i++) {
      //   data.push(round(random(3, 8), 0))
      //   data1.push(9 - data[i])
      // }
      // this.options.series[0].data = data
      // this.options.series[1].data = data1
      // this.visible = true
    }
  },
}
</script>

<template>
  <ZFrame :height="220" title="入海河流断面总氮达标情况">
    <Echart v-if="visible" :options="options" height="190px" width="375px" />
  </ZFrame>
</template>
