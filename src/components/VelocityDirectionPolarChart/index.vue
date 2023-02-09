<template>
  <div>
    <Echart
      id="velocityDirectionPolarChart"
      :options="options"
      height="300px"
      width="300px"
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
      type: Array,
      default: () => []
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
            x: 40,
            y: 40,
            x2: 40,
            y2: 40
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            formatter: params => {
              return `流速：${newData[params[0].dataIndex][0] &&
                newData[params[0].dataIndex][0].toFixed(4)} m/d`
            }
          },
          angleAxis: {
            name: '流向(°)',
            type: 'value',
            data: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360],
            min: 0,
            axisLabel: {
              formatter: function(value, index) {
                if (value === 0) return '北'
                if (value === 90) return '东'
                if (value === 180) return '南'
                if (value === 270) return '西'
                return `${value}°`
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: ['#00ff00']
              }
            },
            max: 360
          },
          radiusAxis: {
            name: '流速(m/d)',
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: ['#00ff00']
              }
            }
          },
          polar: {},
          series: [
            {
              symbolSize: 2,
              type: 'scatter',
              data: newData,
              coordinateSystem: 'polar'
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
