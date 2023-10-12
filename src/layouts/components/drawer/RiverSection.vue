<script>
import apiData from '@/api/modules/data'

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
      activeName: 'waterQuality',
      drawerVisible: false,
      tableHeight: '600',
      riverSectionInfo: [],
      waterQualityData: [],
      loading: false,
    }
  },
  watch: {
    async visible() {
      this.drawerVisible = this.visible
      if (this.drawerVisible) {
        await this.getData()
      }
    },
  },
  unmounted() {
    this.handleClose()
  },
  methods: {
    async getData() {
      this.loading = true
      const [result1, result2] = await Promise.all([apiData.getWaterQualityBySectionCode({ code: this.drawerData.code }), apiData.getRiverSectionInfo({ id: this.drawerData.id })])
      if (result1.code === 1000 && result1.data) {
        this.waterQualityData = result1.data
      }
      if (result2.code === 1000 && result2.data) {
        this.riverSectionInfo = result2.data
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
          <div class="river-section-info">
            <el-descriptions :title="riverSectionInfo.name" :column="3" size="small">
              <el-descriptions-item label="断面编码">
                {{ riverSectionInfo.code || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="水系名称">
                {{ riverSectionInfo.waterSystem || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="所在水体">
                {{ riverSectionInfo.at || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="所在省份">
                {{ riverSectionInfo.atProvince || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="所在城市">
                {{ riverSectionInfo.atCity || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="对应流域中心">
                {{ riverSectionInfo.riverCenter || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="湖库所属分区">
                {{ riverSectionInfo.lake || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="水体类型名称">
                {{ riverSectionInfo.waterType || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="流域">
                {{ riverSectionInfo.watershed || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="河流级别">
                {{ riverSectionInfo.riverLevel || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="断面属性" :span="2">
                {{ riverSectionInfo.type || '-' }}
              </el-descriptions-item>
              <el-descriptions-item :span="3" label="水功能区名称">
                {{ riverSectionInfo.function || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <br />
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="水质数据" name="waterQuality">
              <el-table :data="waterQualityData" :height="tableHeight" size="small">
                <el-table-column label="监测时间" fixed>
                  <template #default="scope"> {{ scope.row.WQ_INF_YEAR }}-{{ scope.row.WQ_INF_MONTH }} </template>
                </el-table-column>
                <el-table-column label="水质类别" fixed>
                  <template #default="scope">
                    {{ scope.row.WATER_TYPE }}
                  </template>
                </el-table-column>
                <el-table-column label="pH">
                  <template #default="scope">
                    {{ scope.row.W01001 }}
                  </template>
                </el-table-column>
                <el-table-column label="透明度(cm)">
                  <template #default="scope">
                    {{ scope.row.W01004 }}
                  </template>
                </el-table-column>
                <el-table-column label="溶解氧(mg/L)" :width="100">
                  <template #default="scope">
                    {{ scope.row.W01009 }}
                  </template>
                </el-table-column>
                <el-table-column label="水温(℃)">
                  <template #default="scope">
                    {{ scope.row.W01010 }}
                  </template>
                </el-table-column>
                <el-table-column label="电导率(μS/cm)" :width="100">
                  <template #default="scope">
                    {{ scope.row.W01014 }}
                  </template>
                </el-table-column>
                <el-table-column label="五日生化需氧量(mg/L)" :width="140">
                  <template #default="scope">
                    {{ scope.row.W01017 }}
                  </template>
                </el-table-column>
                <el-table-column label="化学需氧量(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W01018 }}
                  </template>
                </el-table-column>
                <el-table-column label="高锰酸盐指数(mg/L)" :width="140">
                  <template #default="scope">
                    {{ scope.row.W01019 }}
                  </template>
                </el-table-column>
                <el-table-column label="叶绿素(mg/L)" :width="100">
                  <template #default="scope">
                    {{ scope.row.W01022 }}
                  </template>
                </el-table-column>
                <el-table-column label="盐度(千分)" :width="100">
                  <template #default="scope">
                    {{ scope.row.W01024 }}
                  </template>
                </el-table-column>
                <el-table-column label="粪大肠菌群(个/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W02003 }}
                  </template>
                </el-table-column>
                <el-table-column label="阴离子表面活性剂(mg/L)" :width="160">
                  <template #default="scope">
                    {{ scope.row.W19002 }}
                  </template>
                </el-table-column>
                <el-table-column label="汞(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20111 }}
                  </template>
                </el-table-column>
                <el-table-column label="镉(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20115 }}
                  </template>
                </el-table-column>
                <el-table-column label="叶绿素(mg/L)" :width="100">
                  <template #default="scope">
                    {{ scope.row.W20117 }}
                  </template>
                </el-table-column>
                <el-table-column label="砷(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20119 }}
                  </template>
                </el-table-column>
                <el-table-column label="铅(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20120 }}
                  </template>
                </el-table-column>
                <el-table-column label="铜(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20122 }}
                  </template>
                </el-table-column>
                <el-table-column label="锌(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20123 }}
                  </template>
                </el-table-column>
                <el-table-column label="硒(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20128 }}
                  </template>
                </el-table-column>
                <el-table-column label="总氮(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W21001 }}
                  </template>
                </el-table-column>
                <el-table-column label="氨氮(mg/L)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W21003 }}
                  </template>
                </el-table-column>
                <el-table-column label="亚硝酸盐(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W21006 }}
                  </template>
                </el-table-column>
                <el-table-column label="硝酸盐(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W21007 }}
                  </template>
                </el-table-column>
                <el-table-column label="总磷(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W21011 }}
                  </template>
                </el-table-column>
                <el-table-column label="氰化物(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W21016 }}
                  </template>
                </el-table-column>
                <el-table-column label="氟化物(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W21017 }}
                  </template>
                </el-table-column>
                <el-table-column label="硫化物(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W21019 }}
                  </template>
                </el-table-column>
                <el-table-column label="硫酸盐(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W21038 }}
                  </template>
                </el-table-column>
                <el-table-column label="石油类(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W22001 }}
                  </template>
                </el-table-column>
                <el-table-column label="挥发酚(mg/L)" :width="120">
                  <template #default="scope">
                    {{ scope.row.W23002 }}
                  </template>
                </el-table-column>
                <el-table-column label="水位(M)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W99029 }}
                  </template>
                </el-table-column>
                <el-table-column label="流量(M3/S)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W99030 }}
                  </template>
                </el-table-column>
                <el-table-column label="硅酸盐(mg/L)" :width="100">
                  <template #default="scope">
                    {{ scope.row.W99042 }}
                  </template>
                </el-table-column>
                <el-table-column label="水量(104/m3)" :width="100">
                  <template #default="scope">
                    {{ scope.row.W99069 }}
                  </template>
                </el-table-column>
                <el-table-column label="氯化物" :width="80">
                  <template #default="scope">
                    {{ scope.row.W21022 }}
                  </template>
                </el-table-column>
                <el-table-column label="锰" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20124 }}
                  </template>
                </el-table-column>
                <el-table-column label="铁" :width="80">
                  <template #default="scope">
                    {{ scope.row.W20125 }}
                  </template>
                </el-table-column>
                <el-table-column label="浊度(NTU)" :width="80">
                  <template #default="scope">
                    {{ scope.row.W01003 }}
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="附近水库站" name="reservoir" />
            <el-tab-pane label="附近河道站" name="riverChannel" />
            <el-tab-pane label="附近气象站" name="meteorologyStation" />
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

  .river-section-info {
    padding: 10px;
    background: #f9f9f9;
    flex: none;

    :deep(.el-descriptions__body) {
      background-color: #f9f9f9;
    }
  }
}
</style>
