<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import gisData from '@/api/modules/gis'
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
            min: 0,
          },
          {
            type: 'value',
            name: '%',
            max: 100,
            min: 0,
            show: false,
          },
        ],
        series: [
          {
            name: '同比变化',
            type: 'line',
            tooltip: {
              valueFormatter(value) {
                return typeof value !== 'number' ? '-' : `${value}%`
              },
            },
            data: [],
            yAxisIndex: 1,
          },
          {
            name: '不达标',
            type: 'bar',
            barWidth: '8px',
            tooltip: {
              valueFormatter(value) {
                return typeof value !== 'number' ? '-' : `${value}%`
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
                return typeof value !== 'number' ? '-' : `${value}%`
              },
            },
            data: [],
          },
        ],
        color: ['#36FF00', '#FFF200', '#00C8FF'],
      },
      param: {},
      loading: false,
      waterQualityDimension: '水质',
    }
  },
  async mounted() {
    await this.delay(1000)
    await this.getData()

    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })
    eventBus.on('waterQualityDimension', (param) => {
      if (param && param.waterQualityDimension) {
        this.waterQualityDimension = param.waterQualityDimension
        this.getData(this.param)
      }
    })
  },
  beforeUnmount() {
    // eventBus.off('filterparam')
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
      const res = await gisData.getWaterQualityTrend(param)
      this.options.xAxis[0].data = res.data.months
      if (res && res.code === 1000) {
        if (this.waterQualityDimension === '总氮') {
          this.options.yAxis[1].min = Math.min(...res.data.totalNitrogenYoYChanges)
          this.options.series[0].data = res.data.totalNitrogenYoYChanges
          this.options.series[1].data = res.data.totalNitrogenNonComplianceRates
          this.options.series[2].data = res.data.totalNitrogenComplianceRates
        }
        else {
          this.options.yAxis[1].min = Math.min(...res.data.waterQualityYoYChanges)
          this.options.series[0].data = res.data.waterQualityYoYChanges
          this.options.series[1].data = res.data.waterQualityNonComplianceRates
          this.options.series[2].data = res.data.waterQualityComplianceRates
        }

        // this.options.series[0].data = res.data.totalNitrogenYoYChanges
        // this.options.series[1].data = res.data.totalNitrogenNonComplianceRates
        // this.options.series[2].data = res.data.totalNitrogenComplianceRates
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
