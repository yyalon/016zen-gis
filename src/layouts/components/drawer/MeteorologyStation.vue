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
      tableHeight: '600',
      meteorologyStations: [],
      loading: false,
      maxPage: 1,
      currentPage: 1,
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
      console.log(this.drawerData, this.drawerData)
      const { code, data } = await gisData.getMeteorologyStationData({ stationCode: this.drawerData.STATION_NAME, page: currentPage })
      if (code === 1000 && data) {
        this.maxPage = data.maxPage
        this.meteorologyStations = data.list
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
            <el-descriptions :title="meteorologyStations[0]?.STATION_NAME" :column="3" size="small">
              <el-descriptions-item label="区站号">
                {{ meteorologyStations[0]?.STATION_ID_C || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="省份">
                {{ meteorologyStations[0]?.PROVINCE || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="地市">
                {{ meteorologyStations[0]?.CITY || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="乡镇">
                {{ meteorologyStations[0]?.TOWN || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="行政区代码">
                {{ meteorologyStations[0]?.ADMIN_CODE_CHN || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="测站类型">
                {{ meteorologyStations[0]?.STATION_TYPE || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="测站级别">
                {{ meteorologyStations[0]?.STATION_LEVL || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="测站高度(米)">
                {{ meteorologyStations[0]?.ALTI || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="气压传感器海拔高度(米)">
                {{ meteorologyStations[0]?.PRS_SENSOR_ALTI || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="风速传感器距地面高度(米)">
                {{ meteorologyStations[0]?.WIN_S_SENSOR_HEIGH || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <br>
          <el-tabs class="demo-tabs">
            <el-tab-pane label="气象站数据" name="meteorologyStation">
              <el-table :data="meteorologyStations" :height="tableHeight" size="small">
                <el-table-column label="监测时间" fixed>
                  <template #default="scope">
                    {{ scope.row.DATEVAL }}
                  </template>
                </el-table-column>
                <el-table-column label="现在天气" fixed>
                  <template #default="scope">
                    {{ scope.row.WEP_NOW }}
                  </template>
                </el-table-column>
                <el-table-column label="最高气压(百帕)">
                  <template #default="scope">
                    {{ scope.row.PRS_MAX }}
                  </template>
                </el-table-column>
                <el-table-column label="最低气压(百帕)">
                  <template #default="scope">
                    {{ scope.row.PRS_MIN }}
                  </template>
                </el-table-column>
                <el-table-column label="最高气温(摄氏度(℃))">
                  <template #default="scope">
                    {{ scope.row.TEM_MAX }}
                  </template>
                </el-table-column>
                <el-table-column label="最低气温(摄氏度(℃))">
                  <template #default="scope">
                    {{ scope.row.TEM_MIN }}
                  </template>
                </el-table-column>
                <el-table-column label="最小相对湿度(百分率)">
                  <template #default="scope">
                    {{ scope.row.RHU_MIN }}
                  </template>
                </el-table-column>
                <el-table-column label="人工加密观测降水量(毫米)">
                  <template #default="scope">
                    {{ scope.row.PRE }}
                  </template>
                </el-table-column>
                <el-table-column label="最大风速(米 / 秒)">
                  <template #default="scope">
                    {{ scope.row.WIN_S_MAX }}
                  </template>
                </el-table-column>
                <el-table-column label="极大风速(米 / 秒)">
                  <template #default="scope">
                    {{ scope.row.WIN_S_INST_MAX }}
                  </template>
                </el-table-column>
                <el-table-column label="最高地面温度(摄氏度(℃))">
                  <template #default="scope">
                    {{ scope.row.GST_MAX }}
                  </template>
                </el-table-column>
                <el-table-column label="最低地面温度(摄氏度(℃))">
                  <template #default="scope">
                    {{ scope.row.GST_MIN }}
                  </template>
                </el-table-column>
                <el-table-column label="草面(雪面)最高温度(摄氏度(℃))">
                  <template #default="scope">
                    {{ scope.row.LGST_MAX }}
                  </template>
                </el-table-column>
                <el-table-column label="草面(雪面)最低温度(摄氏度(℃))">
                  <template #default="scope">
                    {{ scope.row.LGST_MIN }}
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
