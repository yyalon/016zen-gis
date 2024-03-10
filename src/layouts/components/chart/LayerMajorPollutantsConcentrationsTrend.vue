<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import ApiData from '@/api/modules/data'

const types = {
  oils: '石油类(mg/L)',
  ap: '活性磷酸盐(mg/L)',
  ic: '无机氯(mg/L)',
  cod: '化学需氧量(mg/L)',
  do: '溶解氧(mg/L)',
  ph: 'ph值',
}
export default {
  components: { ZFrame, Echart },
  emits: ['close'],
  data() {
    const allProvince = ['上海市', '浙江省', '江苏省', '福建省'].map((i) => {
      return { value: i, label: i }
    })
    return {
      type: 'do',
      types,
      visible: false,
      layerVisible: true,
      options: {},

      allProvince,
      allYears: [2021, 2022, 2023, 2024].map((i) => {
        return { value: i, label: i }
      }),
      allMonths: Array.from({ length: 12 }, (_, index) => index + 1).map((i) => {
        return { value: i, label: i }
      }),
      year: 2022,
      selYears: [2021, 2022],
      selProvince: ['上海市', '浙江省', '江苏省'],
      selMons: [],
    }
  },
  computed: {
    combinedTitle() {
      return `${this.year}主要污染物浓度趋势图`
    },
  },
  mounted() {
    this.getData()
  },
  unmounted() {
    this.handleClose()
  },
  methods: {
    async getData() {
      const res = await ApiData.getPollutionConcentrationTrend({
        province: this.selProvince,
        year: this.selYears,
        month: this.selMons,
      })
      // console.log('getPollutionConcentrationTrend', res)
      if (res && res.code === 1000) {
        // this.options.xAxis[0].data = res.data.map(e => e.WQ_INF_MONTH)
        // this.options.series[0].data = res.data.map(e => Math.round(e.value))
        this.options = this.generyLine(res.data)
        // console.log('this.options:', this.options)
        this.visible = true
      }

      // this.options.xAxis[0].data = [
      //   '202101',
      //   '202102',
      //   '202103',
      //   '202104',
      //   '202105',
      //   '202106',
      // ]
      // const data = []
      // for (let i = 0; i < 6; i++) {
      //   data.push(round(random(1.1, 6.9), 1))
      // }
      // this.options.series[0].data = data
    },
    generyLine(data) {
      let allPro = data.map(i => i.PROVINCE_NAME)
      allPro = Array.from(new Set(allPro))

      const allYears = Array.from(new Set(data.map(i => i.WQ_INF_YEAR)))
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          top: '5%',
          data: allYears,
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '15%',
          containLabel: true,
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: '10%',
          feature: {
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: 'category',
            data: allPro,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: allYears.map((year) => {
          return {
            name: year,
            type: 'bar',
            barWidth: '20px',
            emphasis: {
              focus: 'series',
            },
            data: allPro.map((pro) => {
              const arr = data.filter(i => i.WQ_INF_YEAR === year && i.PROVINCE_NAME === pro)
              const firstObj = arr[0]
              const value = firstObj && firstObj.value.toFixed(1)
              return value
            }),
          }
        }),
      }
    },
    toggleView() {
      this.layerVisible = !this.layerVisible
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <div>
    <el-button class="close-button" type="primary" circle size="default" @click="handleClose">
      <el-icon>
        <svg-icon name="ep:close" />
      </el-icon>
    </el-button>
    <el-select v-model="selProvince" multiple collapse-tags collapse-tags-tooltip placeholder="请选择" @change="getData">
      <el-option v-for="item in allProvince" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <el-select v-model="selYears" multiple collapse-tags collapse-tags-tooltip placeholder="请选择" @change="getData">
      <el-option v-for="item in allYears" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <el-select v-model="selMons" multiple collapse-tags collapse-tags-tooltip placeholder="请选择" @change="getData">
      <el-option v-for="item in allMonths" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>

    <ZFrame title="主要污染物浓度趋势图" width="100%" height="90%">
      <Echart v-if="visible" :options="options" height="270px" width="80%" class="layer-echart" />
    </ZFrame>
  </div>
</template>

<style lang="scss">
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.layer-echart {
  margin-left: 50px;
}
</style>
