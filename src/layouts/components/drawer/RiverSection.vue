<script>
import { distance, point } from '@turf/turf'
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
      reservoirs: [],
      riverChannels: [],
      meteorologyStations: [],
      loading: false,
    }
  },
  watch: {
    async visible() {
      this.drawerVisible = this.visible
      if (this.drawerVisible) {
        await this.getData()
        this.getReservoirs()
        this.getRiverChannels()
        this.getMeteorologyStations()
      }
    },
  },
  unmounted() {
    this.handleClose()
  },
  methods: {
    async getData() {
      this.loading = true
      console.log(this.drawerData, this.drawerData)
      const [result1, result2] = await Promise.all([apiData.getWaterQualityBySectionCode({ code: this.drawerData.code }), apiData.getRiverSectionInfo({ id: this.drawerData.id })])
      if (result1.code === 1000 && result1.data) {
        this.waterQualityData = result1.data
      }
      if (result2.code === 1000 && result2.data) {
        this.riverSectionInfo = result2.data
      }

      this.loading = false
    },
    async getReservoirs() {
      const { code, data } = await apiData.getReservoirs()

      if (code === 1000 && data) {
        data.forEach((item) => {
          if (item.JD && item.WD) {
            const point1 = point([this.riverSectionInfo.longitude, this.riverSectionInfo.latitude]) // 第一个点的经纬度坐标
            const point2 = point([item.JD, item.WD]) // 第二个点的经纬度坐标

            const _distance = distance(point1, point2) // 计算两点之间的距离
            item.distance = _distance.toFixed(2)
            if (_distance < 100) {
              this.reservoirs.push(item)
            }
          }
        })
      }
    },
    async getRiverChannels() {
      const { code, data } = await apiData.getRiverChannels()
      if (code === 1000 && data) {
        data.forEach((item) => {
          if (item.JD && item.WD) {
            const point1 = point([this.riverSectionInfo.longitude, this.riverSectionInfo.latitude]) // 第一个点的经纬度坐标
            const point2 = point([item.JD, item.WD]) // 第二个点的经纬度坐标
            const _distance = distance(point1, point2) // 计算两点之间的距离
            item.distance = _distance.toFixed(2)
            if (_distance < 100) {
              this.riverChannels.push(item)
            }
          }
        })
      }
    },
    async getMeteorologyStations() {
      const { code, data } = await apiData.getMeteorologyStations()
      if (code === 1000 && data) {
        data.forEach((item) => {
          if (item.LON && item.LAT) {
            const point1 = point([this.riverSectionInfo.longitude, this.riverSectionInfo.latitude]) // 第一个点的经纬度坐标
            const point2 = point([item.LON, item.LAT]) // 第二个点的经纬度坐标
            const _distance = distance(point1, point2) // 计算两点之间的距离
            item.distance = _distance.toFixed(2)
            if (_distance < 100) {
              this.meteorologyStations.push(item)
            }
          }
        })
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
          <br>
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="水质数据" name="waterQuality">
              <el-table :data="waterQualityData" :height="tableHeight" size="small">
                <el-table-column label="监测时间" fixed>
                  <template #default="scope">
                    {{ scope.row.WQ_INF_YEAR }}-{{ scope.row.WQ_INF_MONTH }}
                  </template>
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
                <el-table-column label="六价铬(ug/l)" :width="100">
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
            <el-tab-pane label="附近水库站" name="reservoir">
              <el-table :data="reservoirs" :height="tableHeight" size="small">
                <!-- "STNM": "横山水库",
                "WEBSTLC": "苏-宜兴",
                "RVNM": "厔溪",
                "POINTCODE": "63101901",
                "POINTTYPE": "RR",
                "POINTTYPE_NAME": "水库水文站",
                "PROVINCE": "江苏省",
                "CITY": "无锡市", -->
                <el-table-column label="测站编码" fixed>
                  <template #default="scope">
                    {{ scope.row.POINTCODE }}
                  </template>
                </el-table-column>
                <el-table-column label="站名" fixed>
                  <template #default="scope">
                    {{ scope.row.STNM }}
                  </template>
                </el-table-column>
                <el-table-column label="站址">
                  <template #default="scope">
                    {{ scope.row.WEBSTLC }}
                  </template>
                </el-table-column>
                <el-table-column label="河名">
                  <template #default="scope">
                    {{ scope.row.RVNM }}
                  </template>
                </el-table-column>
                <el-table-column label="测点类型名称">
                  <template #default="scope">
                    {{ scope.row.POINTTYPE_NAME }}
                  </template>
                </el-table-column>
                <el-table-column label="省">
                  <template #default="scope">
                    {{ scope.row.PROVINCE }}
                  </template>
                </el-table-column>
                <el-table-column label="地市">
                  <template #default="scope">
                    {{ scope.row.CITY }}
                  </template>
                </el-table-column>
                <el-table-column label="直线距离">
                  <template #default="scope">
                    {{ scope.row.distance }}公里
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="附近河道站" name="riverChannel">
              <el-table :data="riverChannels" :height="tableHeight" size="small">
                <!-- "STNM": "夹浦",
                "WEBSTLC": "夹浦镇",
                "RVNM": "夹浦港",
                "WRZ": 3.701,
                "POINTCODE": "63201900",
                "POINTTYPE": "ZZ",
                "POINTTYPE_NAME": "河道水位站",
                "PROVINCE": "浙江省",
                "CITY": "湖州市",
                "distance": "60.38"  -->
                <el-table-column label="测站编码" fixed>
                  <template #default="scope">
                    {{ scope.row.POINTCODE }}
                  </template>
                </el-table-column>
                <el-table-column label="站名">
                  <template #default="scope">
                    {{ scope.row.STNM }}
                  </template>
                </el-table-column>
                <el-table-column label="站址">
                  <template #default="scope">
                    {{ scope.row.WEBSTLC }}
                  </template>
                </el-table-column>
                <el-table-column label="河名">
                  <template #default="scope">
                    {{ scope.row.RVNM }}
                  </template>
                </el-table-column>
                <el-table-column label="警戒水位">
                  <template #default="scope">
                    {{ scope.row.WRZ }}
                  </template>
                </el-table-column>
                <el-table-column label="测站类型">
                  <template #default="scope">
                    {{ scope.row.POINTTYPE_NAME }}
                  </template>
                </el-table-column>
                <el-table-column label="省">
                  <template #default="scope">
                    {{ scope.row.PROVINCE }}
                  </template>
                </el-table-column>
                <el-table-column label="地市">
                  <template #default="scope">
                    {{ scope.row.CITY }}
                  </template>
                </el-table-column>
                <el-table-column label="直线距离">
                  <template #default="scope">
                    {{ scope.row.distance }}公里
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="附近气象站" name="meteorologyStation">
              <el-table :data="meteorologyStations" :height="tableHeight" size="small">
                <!-- "STATION_NAME": "桐庐",
                "COUNTRY": "中国",
                "PROVINCE": "浙江",
                "CITY": "杭州市",
                "CNTY": null,
                "TOWN": null,
                "STATION_ID_C": "58542",
                "STATION_ID_D": "58542",
                "ALTI": 44.4,
                "PRS_SENSOR_ALTI": 45.6,
                "WIN_S_SENSOR_HEIGH": 12,
                "STATION_TYPE": "0",
                "STATION_LEVL": "12",
                "ADMIN_CODE_CHN": "330122",
                "distance": "93.59" -->
                <el-table-column label="区站号" fixed>
                  <template #default="scope">
                    {{ scope.row.STATION_ID_C }}
                  </template>
                </el-table-column>
                <el-table-column label="站名" fixed>
                  <template #default="scope">
                    {{ scope.row.STATION_NAME }}
                  </template>
                </el-table-column>
                <el-table-column label="省份">
                  <template #default="scope">
                    {{ scope.row.PROVINCE }}
                  </template>
                </el-table-column>
                <el-table-column label="地市">
                  <template #default="scope">
                    {{ scope.row.CITY }}
                  </template>
                </el-table-column>
                <el-table-column label="区县">
                  <template #default="scope">
                    {{ scope.row.CNTY }}
                  </template>
                </el-table-column>
                <el-table-column label="乡镇">
                  <template #default="scope">
                    {{ scope.row.TOWN }}
                  </template>
                </el-table-column>
                <el-table-column label="测站高度(米)">
                  <template #default="scope">
                    {{ scope.row.ALTI }}
                  </template>
                </el-table-column>
                <el-table-column label="气压传感器海拔高度(米)">
                  <template #default="scope">
                    {{ scope.row.PRS_SENSOR_ALTI }}
                  </template>
                </el-table-column>
                <el-table-column label="风速传感器距地面高度(米)">
                  <template #default="scope">
                    {{ scope.row.WIN_S_SENSOR_HEIGH }}
                  </template>
                </el-table-column>
                <el-table-column label="测站类型">
                  <template #default="scope">
                    {{ scope.row.STATION_TYPE }}
                  </template>
                </el-table-column>
                <el-table-column label="测站级别">
                  <template #default="scope">
                    {{ scope.row.STATION_LEVL }}
                  </template>
                </el-table-column>
                <el-table-column label="行政区代码">
                  <template #default="scope">
                    {{ scope.row.ADMIN_CODE_CHN }}
                  </template>
                </el-table-column>
                <el-table-column label="直线距离">
                  <template #default="scope">
                    {{ scope.row.distance }}公里
                  </template>
                </el-table-column>
              </el-table>
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
