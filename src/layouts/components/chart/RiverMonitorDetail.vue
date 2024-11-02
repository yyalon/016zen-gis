<script>
import ZFrame from '../ZFrame.vue'

import gisData from '@/api/modules/gis'
import eventBus from '@/utils/eventBus'

export default {
  name: 'RiverMonitorDetail',
  components: { ZFrame },
  data() {
    return {
      loading: false,
      tableData: [],
      param: {},
      riverSections: [],
    }
  },
  mounted() {
    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })
    eventBus.on('riverSections', ({ riverSections }) => {
      this.riverSections = riverSections
    })
  },
  beforeUnmount() {
    // eventBus.off('filterparam')
  },
  methods: {
    getData(param) {
      this.loading = true
      gisData.getWaterQualityDetail(param).then(({ data }) => {
        this.loading = false
        this.tableData = data.filter((item) => item.isCompliant).concat(data.filter((item) => !item.isCompliant))
      })
    },
    zoomToMarkerByCode(row) {
      if (this.riverSections.length > 0) {
        const section = this.riverSections.find((item) => item.code === row.selectCode)
        if (section) {
          window.$zMap.setView([section.latitude, section.longitude], window.$zMap.getZoom() + 1)
        }
      }
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="断面监测数据详情">
    <el-table :data="tableData" :height="343" style="width: 100%;" @row-click="zoomToMarkerByCode">
      <el-table-column prop="sectionName" label="断面名称" />
      <el-table-column prop="text2" align="center" label="所属河流" />
      <el-table-column prop="waterTarget" align="center" label="水质目标">
        <template #default="scope">
          <el-tag :color="scope.row.targetColor" style="color: #fff; border: 0;">
            {{ scope.row.waterTarget }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="waterType" align="center" label="水质类别">
        <template #default="scope">
          <el-tag :color="scope.row.color" style="color: #fff; border: 0;">
            {{ scope.row.waterType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isCompliant" align="center" label="达标状态">
        <template #default="scope">
          <span :style="`color: ${scope.row.isCompliant ? 'rgba(0, 202, 3, 0.8)' : 'rgba(255, 53, 53, 0.8)'}`">
            {{ scope.row.isCompliant ? '达标' : '不达标' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </ZFrame>
</template>
