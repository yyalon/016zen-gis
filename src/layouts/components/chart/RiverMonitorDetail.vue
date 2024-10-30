<script>
import ZFrame from '../ZFrame.vue'

import gisData from '@/api/modules/gis'

export default {
  name: 'RiverMonitorDetail',
  components: { ZFrame },
  data() {
    return {
      loading: false,
      tableData: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      gisData.getWaterQualityDetail({ time: '2023-09-01' }).then(({ data }) => {
        this.loading = false
        this.tableData = data.filter((item) => item.isCompliant).concat(data.filter((item) => !item.isCompliant))
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="断面监测数据详情">
    <el-table :data="tableData" :height="343" style="width: 100%;">
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
