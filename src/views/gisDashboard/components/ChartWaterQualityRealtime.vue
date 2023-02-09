<template>
  <box1>
    <span slot="title">入海排口实时监测 </span>
    <Echart
      :options="options"
      style="text-align:center;"
      height="180px"
      width="340px"
    />
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartWaterQualityRealtime',
  components: { Box1, Echart },
  props: {},
  data() {
    return {
      options: {
        tooltip: {
          //提示框组件
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12
          }
        },
        grid: {
          left: 10,
          right: 25,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: (function() {
              var now = new Date()
              var res = []
              var len = 6
              while (len--) {
                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
                now = new Date(now - 5000)
              }
              return res
            })(),
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
              margin: 15,
              color: '#078ceb',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false
            },
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            }
          },
          {
            type: 'category',
            boundaryGap: true,
            show: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 6,
            axisLabel: {
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        visualMap: {
          type: 'piecewise', //continuous连续，piecewise分段
          inverse: true, //是否反转
          align: 'left', //指定组件中图形（比如小方块）和文字的摆放关系
          orient: 'horizontal', //水平（'horizontal'）或者竖直（'vertical'）
          itemGap: 15, //两个图元之间的间隔距离
          controller: {
            outOfRange: {
              symbol: 'rect'
            }
          },
          textGap: 5,
          formatter: function(value, value2) {
            if (value < 5.5) {
              return '正常' // 范围标签显示内容
            }
            if (value < 6.5) {
              return '五级预警' // 范围标签显示内容
            }
            if (value < 7.5) {
              return '四级预警'
            }
            if (value < 10) {
              return '三级预警'
            }
            if (value < 12) {
              return '二级预警'
            } else {
              return '一级预警'
            }
          },
          textStyle: {
            color: '#a8aab0',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12
          },
          itemWidth: 10,
          itemHeight: 10,
          top: 20,
          right: 30,
          pieces: [
            {
              gt: 0,
              lte: 5.5,
              color: '#06965e'
            },
            {
              gt: 5.5,
              lte: 6.5,
              color: '#4a0daf'
            },
            {
              gt: 6.5,
              lte: 7.5,
              color: '#0566aa'
            },
            {
              gt: 7.5,
              lte: 10,
              color: '#dba70a'
            },
            {
              gt: 10,
              lte: 12,
              color: '#FF4200'
            },
            {
              gt: 12,
              color: '#cc0013'
            }
          ],
          outOfRange: {
            color: '#06965e'
          }
        },
        series: [
          {
            name: '人数',
            type: 'line',
            symbolSize: 6, //空心标记的大小
            smooth: false, //是否平滑曲线显示
            smoothMonotone: 'x', //指明是在 x 轴或者 y 轴上保持单调性
            areaStyle: {
              opacity: 0.2,
              pieces: [
                {
                  gt: 5.5,
                  lte: 6.5,
                  color: '#4a0daf'
                },
                {
                  gt: 6.5,
                  lte: 7.5,
                  color: '#0566aa'
                },
                {
                  gt: 7.5,
                  lte: 10,
                  color: '#dba70a'
                },
                {
                  gt: 10,
                  lte: 12,
                  color: '#FF4200'
                },
                {
                  gt: 12,
                  color: '#CC0033'
                }
              ],
              outOfRange: {
                color: '#06965e'
              }
            },
            data: [2, 4, 9.8, 11.8, 9.6, 7, 8, 9.5, 8, 7, 6, 7],
            markLine: {
              //预警线
              silent: true,
              symbol: ['circle', 'none'], //标线两端的标记类型
              symbolSize: 5,
              label: {
                show: false
              },
              lineStyle: {
                color: '#ba252b',
                opacity: 0.3
              },
              data: [
                {
                  yAxis: 5.5
                },
                {
                  yAxis: 6.5
                },
                {
                  yAxis: 7.5
                },
                {
                  yAxis: 10
                },
                {
                  yAxis: 12
                }
              ]
            },
            lineStyle: {
              width: 3
            },
            itemStyle: {
              color: '#404a59',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'top',
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    let count = 11
    setInterval(() => {
      const axisData = new Date().toLocaleTimeString().replace(/^\D*/, '')

      var data0 = this.options.series[0].data
      data0.shift()
      data0.push(Math.round(Math.random() * 12))

      this.options.xAxis[0].data.shift()
      this.options.xAxis[0].data.push(axisData)
      this.options.xAxis[1].data.shift()
      this.options.xAxis[1].data.push(count++)
    }, 5000)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
::v-deep .box-content {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
</style>
