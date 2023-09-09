<script>
import ChartSeaStationKeyIndicatorsTrend from '../chart/SeaStationKeyIndicatorsTrend.vue'
import ChartSeaStationKeyIndicatorsYearAverageTrend from '../chart/SeaStationKeyIndicatorsYearAverageTrend.vue'
import ChartSeaStationEutrophicationIndexTrend from '../chart/SeaStationEutrophicationIndexTrend.vue'
import ChartSeaStationEutrophicationYearAverageTrend from '../chart/SeaStationEutrophicationYearAverageTrend.vue'
import apiData from '@/api/modules/data'

const legendE = {
  2: { color: '#ffff00', label: '轻度富营养化', checked: true },
  3: { color: '#ff9900', label: '中度富营养化', checked: true },
  4: { color: '#ff0000', label: '重度富营养化', checked: true },
}

export default {
  components: {
    ChartSeaStationKeyIndicatorsTrend,
    ChartSeaStationKeyIndicatorsYearAverageTrend,
    ChartSeaStationEutrophicationIndexTrend,
    ChartSeaStationEutrophicationYearAverageTrend,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    drawerData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['close'],
  data() {
    return { drawerVisible: false, seaWaterStationInfo: [], seaWaterQuality: {}, loading: false, chartData: { items: [] } }
  },
  watch: {
    async visible() {
      this.drawerVisible = this.visible
      if (this.drawerVisible) {
        await this.getData()
      }
    },
  },
  async mounted() {},
  unmounted() {
    this.handleClose()
  },
  methods: {
    async getData() {
      const { code, data } = await apiData.getSeaWaterQuality({ site: this.drawerData.site })
      if (code === 1000 && data.length > 0) {
        this.chartData.items = data
      }
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <div v-loading="loading">
    <el-drawer
      v-model="drawerVisible"
      class="drawer-container"
      :append-to-body="true"
      direction="btt"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      :with-header="false"
      @close="handleClose()"
    >
      <template #default>
        <div>
          <el-button v-loading="loading" class="close-button" type="primary" circle size="large" @click="handleClose">
            <el-icon>
              <svg-icon name="ep:close" />
            </el-icon>
          </el-button>
        </div>
        <div class="drawer-body">
          <div class="sea-water-station-info">
            <el-descriptions title="点位信息" :column="1" size="small">
              <el-descriptions-item label="点位编码">
                {{ drawerData.site }}
              </el-descriptions-item>
              <el-descriptions-item label="所属海域">
                <el-tag size="large">
                  {{ drawerData.sea }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="所属省份">
                {{ drawerData.province }}
              </el-descriptions-item>
              <el-descriptions-item label="所属市区">
                {{ drawerData.city }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="sea-water-station-chart">
            <ChartSeaStationKeyIndicatorsTrend :chart-data="chartData" />
            <ChartSeaStationKeyIndicatorsYearAverageTrend :chart-data="chartData" />
            <ChartSeaStationEutrophicationIndexTrend :chart-data="chartData" />
            <ChartSeaStationEutrophicationYearAverageTrend :chart-data="chartData" />
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.drawer-container {
  overflow: visible;

  .el-drawer__body {
    padding: 0;
  }

  .close-button {
    position: absolute;
    top: -20px;
    left: 20px;
  }

  .el-icon {
    font-size: 24px;
  }

  .drawer-body {
    width: 100%;
    height: 100%;
    display: flex;

    .sea-water-station-info {
      padding: 20px 20px 20px 50px;
      background: #f9f9f9;
      flex: none;

      :deep(.el-descriptions__body) {
        background-color: #f9f9f9;
      }
    }

    .sea-water-station-chart {
      flex: 1;
      overflow: auto;
      display: flex;
    }
  }
}
</style>
