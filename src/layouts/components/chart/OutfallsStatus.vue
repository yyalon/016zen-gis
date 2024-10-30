<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

import direct from '@/assets/images/direct.png'
import gisData from '@/api/modules/gis'

export default {
  name: 'ChartOutfallsStatus',
  components: { ZFrame, Echart },
  data() {
    return {
      loading: false,
      options: {
        polar: {},
        radiusAxis: {},
        angleAxis: {
          type: 'category',
          data: [],
          startAngle: 90,
        },
        tooltip: {},
        series: {
          type: 'bar',
          data: [],
          coordinateSystem: 'polar',
        },
        animation: false,
        color: '#fff',
      },
      direct,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      gisData.getOutfallOverallStats({ time: '2023-09-01' }).then((res) => {
        this.loading = false
        this.options.angleAxis.data = res.data.chartData.industry
        this.options.series.data = res.data.chartData.industryCount
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="入海排污口统计">
    <div class="outfalls-header">
      <span>攻坚战区域国控河流入海排污口</span>
      <span class="number">166</span>
    </div>
    <div class="outfalls-subtitle">
      <img :src="direct">
      <span>责任主体（污染源）行业TOP {{ options.angleAxis.data.length }}统计</span>
    </div>
    <div class="outfalls-chart">
      <Echart :options="options" height="220px" width="410px" />
    </div>
  </ZFrame>
</template>

<style lang="scss" scoped>
.outfalls-header {
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px 0 8px;
  font-size: 20px;
  font-weight: 1000;
  background-image: url("@/assets/images/outfallsStatusBg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-bottom: 24px;

  .number {
    font-size: 30px;
    font-weight: 800;
  }
}

.outfalls-subtitle {
  display: flex;
  align-items: center;
  font-size: 20px;
  margin-bottom: 24px;

  > span {
    font-weight: 700;
    margin-left: 10px;
  }
}

.outfalls-chart {
  height: 220px;
  background-color: #183897;
}
</style>
