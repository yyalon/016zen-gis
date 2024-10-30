<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

import gisData from '@/api/modules/gis'

export default {
  name: 'ChartOutfallsDrainageTrend',
  components: { ZFrame, Echart },
  data() {
    return {
      loading: false,
      options: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [13, 23, 23, 13, 9, 6, 16],
            type: 'line',
            areaStyle: {
              color: 'rgba(10, 204, 204, 0.3)',
            },
          },
        ],
        color: '#237804',
      },
      radio1: '总氮',
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
        // console.log('入海排污口排水趋势', res)
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="入海排污口排水趋势">
    <div style="text-align: center;">
      <el-radio-group v-model="radio1" is-button>
        <el-radio-button label="排水量" />
        <el-radio-button label="化学需氧量" />
        <el-radio-button label="总氮" />
        <el-radio-button label="总磷" />
      </el-radio-group>
    </div>
    <Echart :options="options" height="320px" width="410px" />
  </ZFrame>
</template>
