<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import ApiData from '@/api/modules/data'
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
      param: {},
      loading: false,
    }
  },
  mounted() {
    // const res = await ApiData.getRiverSectionTotalDan()
    // console.log('getRiverSectionTotalDan', res)
    // if (res && res.code === 1000) {
    //   const data = res.data
    //   this.options.xAxis[0].data = data.map(e => e.WQ_INF_YEAR)

    //   this.options.series[0].data = data.map(e => e.N2023)
    //   // this.options.series[1].data = data1
    //   this.visible = true

    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })

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

    // }
  },
  beforeUnmount() {
    // eventBus.off('filterparam')
  },
  methods: {
    async getData(param) {
      this.loading = true
      const res = await ApiData.getRiverSectionTotalDan(param)

      if (res && res.code === 1000) {
        const data = res.data
        if (param.dm_name === '') {
          // 断面选择了全部, 使用饼图
          this.options = this.generyBingtu(data)
          this.visible = true
        }
        else {
          this.options = this.generyLine(data)
          // console.log('this.options:', this.options)
          this.visible = true
        }
      }
      this.loading = false
    },

    generyBingtu(data) {
      const colors = ['#3D26A8', '#F9FA14', '#18BFB5']

      return {
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '10%',
          data: [],
          textStyle: {
            color: '#fff',
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter(param) {
            return `${param.name} (${param.percent}%)<br> ${param.value}`
          },
          // formatter: '{a} <br/>{b} : {c} ({d}%)',
          textStyle: {
            fontSize: 16,
          },
        },
        series: [
          {
            top: '0%',
            name: '断面达标比例',
            type: 'pie',
            left: '0',
            radius: ['30%', '70%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              show: true,
              position: 'outside',
              fontSize: 14,
              formatter(param) {
                return `${param.name} (${parseInt(param.percent)}%)`
              },
              color: 'white',
            },
            labelLine: {
              length: 2,
              length2: 12,
            },
            legend: {
              formatter: '{b}: {d}%',
            },
            data: data.map((it, i) => {
              const label = it.label
              // if (it.label === '-') {
              //   label = '未做要求断面比例'
              // }
              // else if (it.label === '达标') {
              //   label = '总氮浓度达标断面比例'
              // }
              // else {
              //   label = '总氮浓度不达标断面比例'
              // }
              return {
                value: it.value,
                name: label,
                itemStyle: {
                  color: `${colors[i]}`,
                },
              }
            }),
          },
        ],
      }
    },
    generyLine(data) {
      let allMonth = data.filter((item) => item.WQ_INF_YEAR === data[0].WQ_INF_YEAR).map((i) => i.WQ_INF_MONTH)
      allMonth = Array.from(new Set(allMonth))
      const allYear = Array.from(new Set(data.map((i) => i.WQ_INF_YEAR)))
      return {
        tooltip: {
          trigger: 'axis',
          formatter(param) {
            return `${param.name} (${param.percent}%)<br>`
          },
        },
        legend: {
          data: allYear,
        },
        grid: {
          left: '20px',
          right: '10px',
          bottom: '10px',
          top: '35px',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: allMonth,
          // axisLabel: {
          // // 坐标轴刻度标签的相关设置。
          //   interval: 0, // 设置为 1，表示『隔一个标签显示一个标签』
          //   margin: 15,
          //   color: '#078ceb',
          //   fontStyle: 'normal',
          //   fontFamily: '微软雅黑',
          //   fontSize: 12,
          // },
          // axisTick: {
          // // 坐标轴刻度相关设置。
          //   show: false,
          // },
          // axisLine: {
          // // 坐标轴轴线相关设置
          //   lineStyle: {
          //     color: '#fff',
          //     opacity: 0.2,
          //   },
          // },
          // splitLine: {
          //   show: false,
          // },
        },
        yAxis: {
          type: 'value',
          name: '总氮(mg/L)',
        },
        series: allYear.map((year) => {
          return {
            name: year,
            type: 'line',
            stack: 'stack1',
            symbolSize: 6, // 空心标记的大小
            data: allMonth.map((mon) => {
              const arr = data.filter((i) => i.WQ_INF_YEAR === year && i.WQ_INF_MONTH === mon)
              const firstObj = arr[0]
              const n2023 = firstObj && firstObj.N2023
              return n2023
            }),
            // lineStyle: {
            //   width: 1,
            //   color: '#2d8cf0',
            // },
            // itemStyle: {
            //   color: '#2d8cf033',
            //   borderWidth: 1,
            // },
            // label: {
            //   show: true,
            //   position: 'top',
            //   color: '#a8aab0',
            //   fontStyle: 'normal',
            //   fontFamily: '微软雅黑',
            //   fontSize: 12,
            // },
          }
        }),
      }
    },
  },
}
</script>

<template>
  <ZFrame :height="264" title="入海河流断面总氮达标情况">
    <Echart v-if="visible" v-loading="loading" :options="options" height="228px" width="450px" />
  </ZFrame>
</template>
