<script>
import * as echarts from 'echarts'
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import pollutantApi from '@/api/modules/pollutant'

export default {
  name: 'PollutantEstuaryBay',
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
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {
          type: 'value',
          name: '排放量',
        },
      },
      type: 'tn',
      pollutantType: '',
      pollutantTypeOptions: [],
      level: 'bay',
      currentBay: '',
      chartData: [],
      loading: false,
      clickBound: false,

      // Modal state
      modalVisible: false,
      modalLoading: false,
      modalLevel: 'secondary', // 'secondary' or 'tertiary'
      modalParentBay: '', // The bay clicked in the main chart
      modalCurrentBay: '', // The sub-bay clicked in the modal chart (for 3rd level)
      modalChartData: [],
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
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {
          type: 'value',
          name: '排放量',
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
    }
  },
  watch: {
    type() {
      this.resetAndFetch()
    },
    pollutantType() {
      this.resetAndFetch()
    },
  },
  async mounted() {
    await this.fetchPollutantTypes()
    await this.resetAndFetch()
  },
  methods: {
    async fetchPollutantTypes() {
      const res = await pollutantApi.chart4PollutantTypes()
      this.pollutantTypeOptions = Array.isArray(res?.result) ? res.result : []
    },
    async resetAndFetch() {
      this.level = 'bay'
      this.currentBay = ''
      this.modalVisible = false
      await this.fetchData()
    },
    async fetchData() {
      this.loading = true
      try {
        const params = { type: this.type, pollutantType: this.pollutantType || undefined }
        const res = await pollutantApi.chart4Bays(params)
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
      const types = data.map(item => item.bay || '-')
      const values = data.map(item => item.total)
      const title = this.type === 'tn' ? '总氮' : '总磷'

      this.options.xAxis.data = types
      this.options.yAxis.name = `${title}排放量`
      this.options.series = [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#fcc66f' },
              { offset: 1, color: '#f5a623' },
            ]),
          },
          barWidth: '40%',
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
      if (!params?.name || this.level !== 'bay') {
        return
      }
      this.modalParentBay = params.name
      this.modalCurrentBay = ''
      this.modalLevel = 'secondary'
      this.modalVisible = true
      await this.fetchModalData()
    },
    async fetchModalData() {
      this.modalLoading = true
      try {
        const params = { type: this.type, pollutantType: this.pollutantType || undefined }
        const targetBay = this.modalLevel === 'secondary' ? this.modalParentBay : this.modalCurrentBay
        const res = await pollutantApi.chart4Secondary(targetBay, params)
        this.modalChartData = Array.isArray(res?.result) ? res.result : []
        this.updateModalCharts()
        this.$nextTick(() => {
          this.bindModalChartClick()
        })
      }
      finally {
        this.modalLoading = false
      }
    },
    updateModalCharts() {
      const data = this.modalChartData
      const types = data.map(item => item.bay || '-')
      const values = data.map(item => item.total)
      const title = this.type === 'tn' ? '总氮' : '总磷'

      // Update Bar Chart
      this.modalBarOptions.xAxis.data = types
      this.modalBarOptions.yAxis.name = `${title}排放量`
      this.modalBarOptions.series = [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: '#5470c6',
          },
          barWidth: '40%',
        },
      ]

      // Update Pie Chart
      this.modalPieOptions.series[0].data = data.map(item => ({
        name: item.bay || '-',
        value: item.total,
      }))
    },
    bindModalChartClick() {
      const barChart = this.$refs.modalBarChartRef?.chart
      if (barChart) {
        barChart.off('click', this.handleModalChartClick)
        barChart.on('click', this.handleModalChartClick)
      }
      const pieChart = this.$refs.modalPieChartRef?.chart
      if (pieChart) {
        pieChart.off('click', this.handleModalChartClick)
        pieChart.on('click', this.handleModalChartClick)
      }
    },
    async handleModalChartClick(params) {
      if (!params?.name || this.modalLevel !== 'secondary') {
        return
      }
      this.modalCurrentBay = params.name
      this.modalLevel = 'tertiary'
      await this.fetchModalData()
    },
    async goBackModal() {
      if (this.modalLevel === 'tertiary') {
        this.modalLevel = 'secondary'
        this.modalCurrentBay = ''
        await this.fetchModalData()
      }
    },
    handleClose() {
      this.modalVisible = false
      this.modalLevel = 'secondary'
      this.modalCurrentBay = ''
    },
    async goBack() {
      // Main chart go back (unused now since main chart is always 'bay')
    },
  },
}
</script>

<template>
  <div class="pollutant-estuary-wrapper">
    <ZFrame title="河口海湾排污统计">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div class="filters-wrapper" style="display: flex; gap: 8px;">
          <el-select v-model="pollutantType" clearable placeholder="污染源类型" style="width: 160px;">
            <el-option
              v-for="item in pollutantTypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
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

    <!-- Modal for Drill Down -->
    <el-dialog
      v-model="modalVisible"
      draggable
      :title="modalLevel === 'secondary' ? `${modalParentBay} 二级河湾排污统计` : `${modalCurrentBay} 三级河湾排污统计`"
      :append-to-body="true"
      width="800"
      class="pollutant-center-dialog"
      @close="handleClose"
    >
      <div class="dialog-header-actions" style="margin-bottom: 15px;">
        <el-button v-if="modalLevel === 'tertiary'" size="small" @click="goBackModal">
          返回上一级
        </el-button>
      </div>
      <div v-loading="modalLoading" class="modal-charts-container">
        <Echart
          ref="modalBarChartRef"
          :options="modalBarOptions"
          height="300px"
          width="380px"
        />
        <Echart
          ref="modalPieChartRef"
          :options="modalPieOptions"
          height="300px"
          width="380px"
        />
      </div>
    </el-dialog>
  </div>
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
.pollutant-estuary-wrapper {
  position: relative;
}

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
