<script>
import ZFrame from '../ZFrame.vue'

import gisData from '@/api/modules/gis'
import eventBus from '@/utils/eventBus'

export default {
  name: 'RiverMonitorDetail',
  components: { ZFrame },
  emits: ['selectRiverByCode'],
  data() {
    return {
      loading: false,
      tableData: [],
      param: {},
      waterQualityDimension: '水质',
    }
  },
  mounted() {
    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })

    eventBus.on('waterQualityDimension', (param) => {
      if (param && param.waterQualityDimension) {
        this.waterQualityDimension = param.waterQualityDimension
      }
    })
  },
  methods: {
    getData(param) {
      this.loading = true
      gisData.getWaterQualityDetail(param).then(({ data }) => {
        this.loading = false
        this.tableData = data
      })
    },
    zoomToMarkerByCode(row) {
      eventBus.emit('selectRiverByCode', {
        selectCode: row.selectCode,
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="断面监测数据详情">
    <el-table v-if="waterQualityDimension === '总氮'" v-auto-scroll :data="tableData" :height="343" style="width: 100%;" @row-click="zoomToMarkerByCode">
      <el-table-column prop="sectionName" label="断面名称" />
      <el-table-column prop="river" align="center" label="所属河流" />
      <el-table-column prop="nTarget" align="center" label="总氮目标">
        <template #default="scope">
          <span v-if="scope.row.nTarget">{{ scope.row.nTarget }}</span>
          <span v-else>未作要求</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalNitrogen" align="center" label="总氮" />
      <el-table-column prop="ntIsCompliant" align="center" label="达标状态">
        <template #default="scope">
          <span v-if="scope.row.ntIsCompliant === null">/</span>
          <span v-else :style="`color: ${scope.row.ntIsCompliant ? 'rgba(0, 202, 3, 0.8)' : 'rgba(255, 53, 53, 0.8)'}`">
            {{ scope.row.ntIsCompliant ? '达标' : '不达标' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else v-auto-scroll :data="tableData" :height="343" style="width: 100%;" @row-click="zoomToMarkerByCode">
      <el-table-column prop="sectionName" label="断面名称" />
      <el-table-column prop="river" align="center" label="所属河流" />
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
          <span v-if="scope.row.isCompliant !== null" :style="`color: ${scope.row.isCompliant ? 'rgba(0, 202, 3, 0.8)' : 'rgba(255, 53, 53, 0.8)'}`">
            {{ scope.row.isCompliant ? '达标' : '不达标' }}
          </span>
          <span v-else>
            /
          </span>
        </template>
      </el-table-column>
    </el-table>
  </ZFrame>
</template>
