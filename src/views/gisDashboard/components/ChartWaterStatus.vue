<template>
  <box1>
    <span slot="title">FJD0100水质状况</span>
    <Echart :options="options" height="200px" width="380px" />
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartWaterStatus',
  components: { Box1, Echart },
  props: {},
  data() {
    return {
      options: {
        title: {
          text: '',
          x: 'center',
          y: '4%',
          textStyle: {
            color: '#fff',
            fontSize: '12'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '15%',
          right: '3%',
          left: '5%',
          bottom: '12%'
        },
        xAxis: [
          {
            type: 'category',
            data: ['202201', '202202', '202203', '202204', '202205', '202206'],
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.12)'
              }
            },
            axisLabel: {
              margin: 10,
              color: '#e2e9ff',
              fontSize: 12
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.12)'
              }
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              margin: 2,
              formatter: '{value}',
              color: '#e2e9ff'
            },
            axisLine: {
              show: false, 
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.12)'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: [8.56, 7.56, 8.19, 9.56, 8.2, 8.85],
            barWidth: '5px',
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(0,244,255,1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,77,167,1)' // 100% 处的颜色
                  }
                ],
                false
              ),
              borderRadius: [30, 30, 30, 30],
              shadowColor: 'rgba(0,160,221,1)',
              shadowBlur: 4
            }
          }
        ]
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
