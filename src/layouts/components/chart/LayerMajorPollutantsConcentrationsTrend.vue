<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import ApiData from '@/api/modules/data'
import areas from '@/utils/area.json'

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
      citys: [],
      cityDisabled: true,
      monthDisabled: true,
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
      selCitys: [],
      loading: false,
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
    formatMonth(month) {
      const num = parseInt(month, 10)
      if (isNaN(num)) {
        return month
      }
      return `${month}月`
    },
    async getData() {
      this.loading = true
      const res = await ApiData.getPollutionConcentrationTrend({
        province: this.selProvince,
        year: this.selYears,
        month: this.selMons,
        city: this.selCitys,
      })
      this.loading = false
      // console.log('getPollutionConcentrationTrend', res)
      if (res && res.code === 1000) {
        // this.options.xAxis[0].data = res.data.map(e => e.WQ_INF_MONTH)
        // this.options.series[0].data = res.data.map(e => Math.round(e.value))
        if (this.selYears.length === 1 && this.selMons.length > 0) {
          for (let index = 0; index < res.data.length; index++) {
            res.data[index].stime = this.formatMonth(res.data[index].stime)
          }
        }
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
      let allPro = data.map((i) => i.name)
      allPro = Array.from(new Set(allPro))

      const allYears = Array.from(new Set(data.map((i) => i.stime)))
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
        dataZoom: [
          {
            show: true,
            realtime: true,
          },
        ],
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
              const arr = data.filter((i) => i.stime === year && i.name === pro)
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
    provinceChange(selectProvinces) {
      if (selectProvinces.length === 1) {
        this.cityDisabled = false
        this.citys = areas.filter(_ => _.label === selectProvinces[0])[0].children.map(_ => _.label)
        this.selCitys = areas.filter(_ => _.label === selectProvinces[0])[0].children.map(_ => _.label)
      }
      else {
        this.cityDisabled = true
        this.citys = []
        this.selCitys = []
      }
      this.getData()
    },
    yearChange(selectYears) {
      if (selectYears.length === 1) {
        this.monthDisabled = false
        this.selMons = this.allMonths.slice(0, 2).map(_ => _.value)
      }
      else {
        this.monthDisabled = true
        this.selMons = []
      }
      this.getData()
    },
  },
}
</script>

<template>
  <div>
    <div style="background-color: black; height: auto;" class="filters pollutants-filters">
      <el-button class="close-button" type="primary" circle size="small" @click="handleClose">
        <el-icon>
          <svg-icon name="ep:close" />
        </el-icon>
      </el-button>
      <el-select v-model="selProvince" style="width: 180px;" multiple collapse-tags collapse-tags-tooltip placeholder="请选择省份/直辖市" @change="provinceChange">
        <el-option v-for="item in allProvince" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="selCitys" style="width: 180px;" multiple :disabled="cityDisabled" collapse-tags collapse-tags-tooltip placeholder="请选择市/区" @change="getData">
        <el-option v-for="item in citys" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="selYears" style="width: 180px;" multiple collapse-tags collapse-tags-tooltip placeholder="请选择年份" @change="yearChange">
        <el-option v-for="item in allYears" :key="item.value" :label="`${item.label}年`" :value="item.value" />
      </el-select>

      <el-select v-model="selMons" :disabled="monthDisabled" style="width: 180px;" multiple collapse-tags collapse-tags-tooltip placeholder="请选择" @change="getData">
        <el-option v-for="item in allMonths" :key="item.value" :label="`${item.label}月`" :value="item.value" />
      </el-select>
    </div>

    <ZFrame width="100%" height="90%" :loading="loading">
      <Echart v-if="visible" :options="options" height="100%" width="100%" class="layer-echart" />
    </ZFrame>
  </div>
</template>

<style lang="css">
.close-button {
  position: absolute;
  top: 15px;
  right: 10px;
}

.layer-echart {
  /* margin-left: 50px; */
}

.pollutants-filters .el-select__tags {
  max-width: auto !important;
  width: auto;
}

.pollutants-filters .el-select .el-select__tags-text {
  font-size: 14px !important;
}
</style>
