<template>
  <div>
    <Echart
      id="velocityDirectionScatterChart"
      :options="options"
      height="140px"
      width="600px"
    />
  </div>
</template>

<script>
import Echart from '@/common/echart'
export default {
  components: {
    Echart
  },
  props: {
    chartData: {
      type: Object,
      default: () => ({
        timeline: [],
        directions: [],
        velocities: []
      })
    }
  },
  data() {
    return {
      options: {}
    }
  },
  watch: {
    chartData: {
      handler(newData) {
        this.options = {
          grid: {
            x: 50,
            y: 30,
            x2: 40,
            y2: 40
          },
          xAxis: {
            scale: true,
            data: newData.timeline,
            axisLabel: { showMinLabel: false, showMaxLabel: false },
            axisTick: { length: 1 }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          yAxis: [
            {
              splitLine: {
                show: false
              },
              name: '流速(m/d)',
              type: 'value'
            },
            {
              axisLine: { show: true },
              splitLine: {
                show: false
              },
              name: '流向(°)',
              nameLocation: 'start',
              alignTicks: true,
              type: 'value',
              inverse: true
            }
          ],
          series: [
            {
              name: '流速',
              symbolSize: 3,
              type: 'scatter',
              data: newData.velocities
            },
            {
              name: '流向',
              symbolSize: 3,
              type: 'scatter',
              data: newData.directions
            }
          ]
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
