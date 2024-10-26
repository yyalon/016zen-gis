<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'

import direct from '@/assets/images/direct.png'

export default {
  name: 'ChartOutfallsStatus',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        polar: {},
        radiusAxis: {
          max: 250,
        },
        angleAxis: {
          type: 'category',
          data: ['调味品、发酵制品制造', '酒的制造', '纸制品制造', '涂料、油墨、颜料及类似', '铸造及其他金属制品制造', '砖瓦、石材等建筑材料制造', '玻璃制造', '屠宰及肉类加工', '方便食品制造', '饮料制造'],
          startAngle: 90,
        },
        tooltip: {},
        series: {
          type: 'bar',
          data: [220, 210, 120, 110, 95, 100, 60, 55, 50, 45],
          coordinateSystem: 'polar',
        },
        animation: false,
        color: '#fff',
      },
      direct,
    }
  },
}
</script>

<template>
  <ZFrame title="入海排污口统计">
    <div class="outfalls-header">
      <span>攻坚战区域国控河流入海排污口</span>
      <span class="number">166</span>
    </div>
    <div class="outfalls-subtitle">
      <img :src="direct">
      <span>责任主体（污染源）行业TOP 10统计</span>
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
