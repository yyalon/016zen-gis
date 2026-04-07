<script>
import * as echarts from 'echarts'
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import pollutantApi from '@/api/modules/pollutant'

export default {
  name: 'PollutantSeaFlux',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            rotate: 20,
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
          name: '排放量（万吨）',
        },
      },
      modalBarOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            rotate: 20,
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
          name: '排放量（万吨）',
        },
      },
      modalPieOptions: {
        color: [
          '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
          '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#0ba4ee',
          '#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c',
          '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3',
          '#9d96f5', '#8378EA', '#96BFFF', '#188df0', '#4595fe',
          '#5254cf', '#6f42c1', '#d63384', '#fd7e14', '#20c997',
        ],
        title: {
          text: '排放占比',
          left: 'center',
          top: 5,
          textStyle: { fontSize: 14, color: '#fff' },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '55%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: true,
              formatter: '{b}: {d}%',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
              },
            },
            data: [],
          },
        ],
      },
      type: 'tn',
      year: null,
      years: [],
      currentFluxType: '',
      currentSubtype: '',
      chartData: [],
      modalData: [],
      loading: false,
      modalLoading: false,
      clickBound: false,
      modalClickBound: false,
      dialogVisible: false,
      modalLevel: 'subtype', // 'subtype' or 'city'
    }
  },
  watch: {
    type() {
      this.resetAndFetch()
      if (this.dialogVisible) {
        this.fetchModalData()
      }
    },
    year() {
      this.resetAndFetch()
      if (this.dialogVisible) {
        this.fetchModalData()
      }
    },
  },
  async mounted() {
    await this.fetchYears()
    await this.resetAndFetch()
  },
  methods: {
    async fetchYears() {
      const res = await pollutantApi.chart3Years()
      this.years = Array.isArray(res?.result) ? res.result : []
      if (!this.year && this.years.length) {
        this.year = 2022
      }
    },
    async resetAndFetch() {
      await this.fetchData()
    },
    async fetchData() {
      this.loading = true
      try {
        const res = await pollutantApi.chart3Types({ type: this.type, year: this.year || undefined })
        this.chartData = Array.isArray(res?.result) ? res.result : []
        this.update()
        this.$nextTick(() => {
          this.bindChartClick()
        })
      }
      finally {
        this.loading = false
      }
    },
    update() {
      const data = this.chartData
      const names = data.map(item => item.type || '-')
      const values = data.map(item => item.total ?? 0)
      const title = this.type === 'tn' ? '总氮' : '总磷'

      this.options.xAxis.data = names
      this.options.yAxis.name = `${title}排放量（万吨）`
      this.options.series = [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          barWidth: '50%',
        },
      ]
    },
    bindChartClick() {
      const chart = this.$refs.echartRef?.chart
      if (!chart) {
        return
      }
      chart.off('click', this.handleChartClick)
      chart.on('click', this.handleChartClick)
      this.clickBound = true
    },
    async handleChartClick(params) {
      if (!params || !params.name) {
        return
      }
      this.currentFluxType = params.name
      this.modalLevel = 'subtype'
      this.dialogVisible = true
      await this.fetchModalData()
    },
    async fetchModalData() {
      this.modalLoading = true
      try {
        let res
        if (this.modalLevel === 'subtype') {
          res = await pollutantApi.chart3Subtypes(this.currentFluxType, { type: this.type, year: this.year || undefined })
        }
        else {
          res = await pollutantApi.chart3Cities(this.currentFluxType, this.currentSubtype, { type: this.type, year: this.year || undefined })
        }
        this.modalData = Array.isArray(res?.result) ? res.result : []
        this.updateModal()
        this.$nextTick(() => {
          this.bindModalChartClick()
        })
      }
      finally {
        this.modalLoading = false
      }
    },
    updateModal() {
      const data = this.modalData
      const names = data.map(item => item.subtype || item.city || '-')
      const values = data.map(item => item.total ?? 0)
      const title = this.type === 'tn' ? '总氮' : '总磷'

      this.modalBarOptions.xAxis.data = names
      this.modalBarOptions.yAxis.name = `${title}排放量（万吨）`
      this.modalBarOptions.series = [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: '#5470c6',
          },
          barWidth: '50%',
        },
      ]

      this.modalPieOptions.series[0].data = data.map(item => ({
        name: item.subtype || item.city || '-',
        value: item.total ?? 0,
      }))
    },
    bindModalChartClick() {
      const barChart = this.$refs.modalBarRef?.chart
      const pieChart = this.$refs.modalPieRef?.chart
      if (barChart) {
        barChart.off('click', this.handleModalChartClick)
        barChart.on('click', this.handleModalChartClick)
      }
      if (pieChart) {
        pieChart.off('click', this.handleModalChartClick)
        pieChart.on('click', this.handleModalChartClick)
      }
    },
    async handleModalChartClick(params) {
      if (!params || !params.name) {
        return
      }
      if (this.modalLevel === 'subtype') {
        this.modalLevel = 'city'
        this.currentSubtype = params.name
        await this.fetchModalData()
      }
    },
    async goBack() {
      if (this.modalLevel === 'city') {
        this.modalLevel = 'subtype'
        await this.fetchModalData()
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.modalLevel = 'subtype'
      this.currentSubtype = ''
    },
  },
}
</script>

<template>
  <ZFrame title="入海通量分类统计">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="filters-wrapper" style="display: flex; gap: 8px;">
        <el-select v-model="year" placeholder="年份" clearable style="width: 110px;">
          <el-option v-for="y in years" :key="y" :label="String(y)" :value="y" />
        </el-select>
      </div>
      <el-radio-group v-model="type" is-button>
        <el-radio-button label="总氮" value="tn" />
        <el-radio-button label="总磷" value="tp" />
      </el-radio-group>
    </div>
    <Echart
      ref="echartRef"
      v-loading="loading"
      :options="options"
      height="320px"
      width="410px"
    />
  </ZFrame>

  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="modalLevel === 'subtype' ? `${currentFluxType} 子类统计` : `${currentSubtype} 城市统计`"
    :append-to-body="true"
    width="800"
    class="pollutant-center-dialog"
    @close="handleClose"
  >
    <div class="dialog-header-actions" style="margin-bottom: 15px;">
      <el-button v-if="modalLevel === 'city'" size="small" @click="goBack">
        返回上一级
      </el-button>
    </div>
    <div v-loading="modalLoading" class="modal-charts-container">
      <Echart
        ref="modalBarRef"
        :options="modalBarOptions"
        height="300px"
        width="380px"
      />
      <Echart
        ref="modalPieRef"
        :options="modalPieOptions"
        height="300px"
        width="380px"
      />
    </div>
  </el-dialog>
</template>

<style lang="scss">
.pollutant-center-dialog {
  margin-top: 15vh !important;
  background: rgba(10, 25, 50, 0.9) !important;
  border: 1px solid #188df0;

  .el-dialog__title {
    color: #fff !important;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #fff !important;
  }

  .el-dialog__body {
    padding-top: 10px;
  }
}
</style>

<style lang="scss" scoped>
.modal-charts-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.filters-wrapper {
  :deep(.el-select) {
    .el-select__wrapper {
      background-color: rgba(10, 81, 204, 0.4) !important;
      border: 1px solid rgba(10, 81, 204, 0.4) !important;
      box-shadow: none !important;
    }

    .el-select__caret {
      color: #fff !important;
    }

    .el-select__placeholder {
      color: #fff !important;
    }

    &:hover .el-select__wrapper,
    &.is-focus .el-select__wrapper {
      background-color: rgba(10, 81, 204, 0.6) !important;
      border: 1px solid #007bff !important;
    }
  }
}
</style>
