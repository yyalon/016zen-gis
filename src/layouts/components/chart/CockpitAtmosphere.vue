<script>
import ZFrame from '../ZFrame.vue'
import gisData from '@/api/modules/gis'
import eventBus from '@/utils/eventBus'

export default {
  name: 'CockpitAtmosphere',
  components: { ZFrame },
  data() {
    return {
      loading: false,
      tableData: [],
      param: {},
      timer: null,
    }
  },
  mounted() {
    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })
  },
  beforeUnmount() {
    // eventBus.off('filterparam')
  },
  methods: {
    getData(param) {
      this.loading = true
      gisData.getAirStation(param).then(({ data }) => {
        this.loading = false
        this.tableData = data
      })
    },
    zoomToMarkerByCode(row) {
      eventBus.emit('selectAir', {
        code: row.code,
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="大气实况">
    <div class="subtitle">
      监测站监测数据
    </div>
    <el-table v-auto-scroll :data="tableData" :height="313" style="width: 100%;" @row-click="zoomToMarkerByCode">
      <el-table-column prop="stationName" label="站点" />
      <el-table-column prop="AQI" align="center" label="AQI" />
      <el-table-column prop="quality" align="center" label="空气质量等级">
        <template #default="scope">
          <el-tag :color="scope.row.color" style="color: #fff; border: 0;">
            {{ scope.row.quality }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="primaryPollutant" align="center" label="首要污染物" />
    </el-table>
  </ZFrame>
</template>

<style lang="scss" scoped>
.subtitle {
  position: relative;
  padding-left: 11px;
  margin-bottom: 16px;

  &::before {
    content: "";
    position: absolute;
    top: 1px;
    left: 0;
    height: 16px;
    border-left: 3px solid #f90;
  }
}
</style>
