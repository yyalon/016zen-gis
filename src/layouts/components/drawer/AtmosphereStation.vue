<script>
import gisData from '@/api/modules/gis'

export default {
  components: {},
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
    return {
      drawerVisible: false,
      tableHeight: '700',
      atmosphereStations: [],
      loading: false,
      maxPage: 1,
      currentPage: 1,
      activeName: 'atmosphereStation',
    }
  },
  watch: {
    async visible() {
      this.drawerVisible = this.visible
      if (this.drawerVisible) {
        await this.getData(1)
      }
    },
  },
  unmounted() {
    this.handleClose()
  },
  methods: {
    async getData(currentPage) {
      this.loading = true
      this.currentPage = currentPage
      const { code, data } = await gisData.getAirStationDataInfo(this.drawerData.STATIONCODE, currentPage)

      if (code === 1000 && data) {
        this.maxPage = data.maxPage
        this.atmosphereStations = data.list
      }

      this.loading = false
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
      size="40%"
      class="drawer-container"
      :append-to-body="true"
      direction="ltr"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      :with-header="false"
      @close="handleClose()"
    >
      <template #default>
        <el-button v-loading="loading" class="close-button" type="primary" circle size="large" @click="handleClose">
          <el-icon>
            <svg-icon name="ep:close" />
          </el-icon>
        </el-button>
        <div class="drawer-body">
          <div class="station-info">
            <el-descriptions :title="atmosphereStations[0]?.POSITIONNAME" :column="3" size="small">
              <el-descriptions-item label="站点代码">
                {{ atmosphereStations[0]?.STATIONCODE || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="城市名称">
                {{ atmosphereStations[0]?.AREA || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="城市代码">
                {{ atmosphereStations[0]?.CITYCODE || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <br>
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="大气站数据" name="atmosphereStation">
              <el-table :data="atmosphereStations" :height="tableHeight" size="small">
                <el-table-column label="监测时间" fixed>
                  <template #default="scope">
                    {{ scope.row.TIMEPOINT }}
                  </template>
                </el-table-column>
                <el-table-column label="AQI" fixed>
                  <template #default="scope">
                    {{ scope.row.AQI }}
                  </template>
                </el-table-column>
                <el-table-column label="首要污染物" fixed>
                  <template #default="scope">
                    {{ scope.row.PRIMARYPOLLUTANT }}
                  </template>
                </el-table-column>
                <el-table-column label="环境质量等级" fixed>
                  <template #default="scope">
                    {{ scope.row.QUALITY }}
                  </template>
                </el-table-column>
                <el-table-column label="二氧化硫">
                  <template #default="scope">
                    {{ scope.row.SO2 }}
                  </template>
                </el-table-column>
                <el-table-column label="二氧化硫24小时均值">
                  <template #default="scope">
                    {{ scope.row.SO2_24H }}
                  </template>
                </el-table-column>
                <el-table-column label="二氧化硫AQI">
                  <template #default="scope">
                    {{ scope.row.SO2_IAQI }}
                  </template>
                </el-table-column>
                <el-table-column label="二氧化氮">
                  <template #default="scope">
                    {{ scope.row.NO2 }}
                  </template>
                </el-table-column>
                <el-table-column label="二氧化氮24小时均值">
                  <template #default="scope">
                    {{ scope.row.NO2_24H }}
                  </template>
                </el-table-column>
                <el-table-column label="二氧化氮AQI">
                  <template #default="scope">
                    {{ scope.row.NO2_IAQI }}
                  </template>
                </el-table-column>
                <el-table-column label="臭氧">
                  <template #default="scope">
                    {{ scope.row.O3_1H_24H }}
                  </template>
                </el-table-column>
                <el-table-column label="臭氧AQI">
                  <template #default="scope">
                    {{ scope.row.O3_1H_IAQI }}
                  </template>
                </el-table-column>
                <el-table-column label="一氧化碳">
                  <template #default="scope">
                    {{ scope.row.CO }}
                  </template>
                </el-table-column>
                <el-table-column label="一氧化碳24小时均值">
                  <template #default="scope">
                    {{ scope.row.CO_24H }}
                  </template>
                </el-table-column>
                <el-table-column label="一氧化碳AQI">
                  <template #default="scope">
                    {{ scope.row.CO_IAQI }}
                  </template>
                </el-table-column>
                <el-table-column label="PM10">
                  <template #default="scope">
                    {{ scope.row.PM10 }}
                  </template>
                </el-table-column>
                <el-table-column label="PM10 24小时均值">
                  <template #default="scope">
                    {{ scope.row.PM10_24H }}
                  </template>
                </el-table-column>
                <el-table-column label="PM10 AQI">
                  <template #default="scope">
                    {{ scope.row.PM10_IAQI }}
                  </template>
                </el-table-column>
                <el-table-column label="PM2.5">
                  <template #default="scope">
                    {{ scope.row.PM2_5 }}
                  </template>
                </el-table-column>
                <el-table-column label="PM2.5 24小时均值">
                  <template #default="scope">
                    {{ scope.row.PM2_5_24H }}
                  </template>
                </el-table-column>
                <el-table-column label="PM2.5 AQI">
                  <template #default="scope">
                    {{ scope.row.PM2_5_IAQI }}
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                hide-on-single-page
                :page-size="1"
                :current-page="currentPage"
                :total="maxPage"
                layout="prev, pager, next"
                @current-change="getData"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-drawer) {
  width: 40% !important;
}

.el-drawer__body {
  padding: 0;
}

.close-button {
  position: absolute;
  top: 10px;
  right: -20px;
}

.el-icon {
  font-size: 24px;
}

.drawer-body {
  width: 100%;
  height: 100%;

  .station-info {
    padding: 10px;
    background: #f9f9f9;
    flex: none;

    :deep(.el-descriptions__body) {
      background-color: #f9f9f9;
    }
  }
}
</style>
