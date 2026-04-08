<script>
import ZFrame from '../ZFrame.vue'
import Echart from '@/lib/echart/index.vue'
import pollutantApi from '@/api/modules/pollutant'

export default {
  name: 'PollutantCityPie',
  components: { ZFrame, Echart },
  data() {
    return {
      options: {
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
      },
      modalBarOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: ['Q1', 'Q2', 'Q3', 'Q4'],
          top: 5,
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
      type: 'tn',
      quarter: 's1',
      chartData: [],
      loading: false,
      dialogVisible: false,
      modalLoading: false,
      currentModalCity: '',
      modalData: [],
    }
  },
  watch: {
    type() {
      this.fetchData()
      if (this.dialogVisible) {
        this.fetchModalData()
      }
    },
    quarter() {
      this.update()
      if (this.dialogVisible) {
        this.updateModal()
      }
    },
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await pollutantApi.chart1Cities({ type: this.type })
        this.chartData = Array.isArray(res?.result) ? res.result : []
        this.update()
      }
      finally {
        this.loading = false
      }
    },
    update() {
      const data = this.chartData
      const typeName = this.type === 'tn' ? '总氮' : '总磷'
      const quarterName = { s1: 'Q1', s2: 'Q2', s3: 'Q3', s4: 'Q4' }[this.quarter]

      this.options.title.text = `${quarterName} ${typeName}排放占比`
      this.options.series = [
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
          data: data.map(item => ({
            name: item.city,
            value: item[this.quarter] ?? 0,
          })),
        },
      ]
    },
    async handleChartClick(params) {
      if (params && params.name) {
        this.currentModalCity = params.name
        this.dialogVisible = true
        await this.fetchModalData()
      }
    },
    async fetchModalData() {
      this.modalLoading = true
      try {
        const res = await pollutantApi.chart1Districts(this.currentModalCity, { type: this.type })
        this.modalData = Array.isArray(res?.result?.districts) ? res.result.districts : []
        this.updateModal()
      }
      finally {
        this.modalLoading = false
      }
    },
    updateModal() {
      const data = this.modalData
      const categories = data.map(item => item.district)
      const title = this.type === 'tn' ? '总氮' : '总磷'
      const quarterName = { s1: 'Q1', s2: 'Q2', s3: 'Q3', s4: 'Q4' }[this.quarter]

      this.modalBarOptions.xAxis.data = categories
      this.modalBarOptions.yAxis.name = `${title}排放量`
      this.modalBarOptions.series = [
        {
          name: 'Q1',
          type: 'bar',
          data: data.map(item => item.s1),
          itemStyle: { color: '#5470c6' },
        },
        {
          name: 'Q2',
          type: 'bar',
          data: data.map(item => item.s2),
          itemStyle: { color: '#91cc75' },
        },
        {
          name: 'Q3',
          type: 'bar',
          data: data.map(item => item.s3),
          itemStyle: { color: '#fac858' },
        },
        {
          name: 'Q4',
          type: 'bar',
          data: data.map(item => item.s4),
          itemStyle: { color: '#ee6666' },
        },
      ]

      this.modalPieOptions.title.text = `${quarterName} ${title}排放占比`
      this.modalPieOptions.series[0].data = data.map(item => ({
        name: item.district,
        value: item[this.quarter] ?? 0,
      }))
    },
    handleClose() {
      this.dialogVisible = false
      this.currentModalCity = ''
    },
  },
}
</script>

<template>
  <ZFrame title="海域污染源占比统计">
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <div style="display: flex; gap: 8px;">
        <el-radio-group v-model="quarter" is-button>
          <el-radio-button label="Q1" value="s1" />
          <el-radio-button label="Q2" value="s2" />
          <el-radio-button label="Q3" value="s3" />
          <el-radio-button label="Q4" value="s4" />
        </el-radio-group>
      </div>
      <el-radio-group v-model="type" is-button>
        <el-radio-button label="总氮" value="tn" />
        <el-radio-button label="总磷" value="tp" />
      </el-radio-group>
    </div>
    <Echart v-loading="loading" :options="options" height="320px" width="410px" @click="handleChartClick" />
  </ZFrame>

  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="`${currentModalCity} 区县统计`"
    :append-to-body="true"
    width="800"
    class="pollutant-center-dialog"
    @close="handleClose"
  >
    <div v-loading="modalLoading" class="modal-charts-container">
      <Echart
        :options="modalBarOptions"
        height="300px"
        width="380px"
      />
      <Echart
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
</style>
