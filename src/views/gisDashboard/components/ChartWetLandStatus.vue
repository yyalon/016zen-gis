<template>
  <box1>
    <span slot="title">滨海湿地质量健康状况 </span>
    <el-descriptions title="" :column="1">
      <el-descriptions-item label="滨海湿地恢复修复面积"
        ><span class="font-digital data-value">1万公顷</span>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="重点保护物种种群数量" :column="2">
      <el-descriptions-item label="中华鲟"
        ><span class="font-digital data-value">1245</span>
      </el-descriptions-item>
      <el-descriptions-item label="白头鹤"
        ><span class="font-digital data-value">345</span></el-descriptions-item
      >
      <el-descriptions-item label="罗纹鸭"
        ><span class="font-digital data-value">532</span></el-descriptions-item
      >
      <el-descriptions-item label="黑脸琵鹭"
        ><span class="font-digital data-value">456</span></el-descriptions-item
      >
      <el-descriptions-item label="勺嘴鹬"
        ><span class="font-digital data-value">8631</span></el-descriptions-item
      >
    </el-descriptions>
  </box1>
</template>

<script>
import Box1 from '@/views/components/box1'
import Echart from '@/common/echart'
export default {
  name: 'ChartWaterQuality',
  components: { Box1, Echart },
  props: {},
  data() {
    return {
      options: {
        title: {
          text: '入海排污口排查整治率',
          x: 'center',
          y: '70%',
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        series: [
          {
            tooltip: {
              show: false
            },
            type: 'gauge',
            radius: '83%',
            center: ['50%', '60%'],
            startAngle: 180,
            endAngle: 0,
            detail: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.3, 'rgba(218, 65, 102,1)'],
                  [0.7, 'rgba(101, 181, 63,1)'],
                  [1, 'rgba(43, 161, 252,1)']
                ]
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'gauge',
            radius: '75%',
            min: 0,
            max: 100,
            center: ['50%', '60%'],
            data: [
              {
                value: 75
              }
            ],
            splitNumber: 10,
            startAngle: 180,
            endAngle: 0,
            title: {
              offsetCenter: ['0', '-60%'],
              fontSize: 20
            },
            detail: {
              formatter: function(value) {
                return value + '%'
              },
              fontSize: 16,
              color: '#fff',
              offsetCenter: ['0%', '-40%']
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#fff',
              fontSize: 10,
              distance: -20
            },
            axisTick: {
              splitNumber: 4,
              show: true,
              lineStyle: {
                color: '#ccc',
                width: 1
              },
              length: -15
            },
            splitLine: {
              show: true,
              length: -15,
              lineStyle: {
                color: '#ccc',
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: '#fff'
              }
            },
            pointer: {
              width: 2,
              length: '80%'
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

<style lang="scss" scoped>
::v-deep .box-content {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.data-value {
  font-size: 20px;
  color: #ffc162;
  line-height: 1.2;
}
</style>
