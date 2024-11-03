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
      waterQualityDimension: '水质',
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

    eventBus.on('waterQualityDimension', (param) => {
      if (param && param.waterQualityDimension) {
        this.waterQualityDimension = param.waterQualityDimension
        this.$nextTick(() => {
          this.autoScroll()
        })
      }
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
        this.$nextTick(() => {
          this.autoScroll()
        })
      })
    },
    autoScroll(stop) {
      if (stop) {
        window.clearInterval(this.timer)
      }
      else {
        const tableWrapper = this.$refs.scroll_Table.layout.table.refs.bodyWrapper.firstElementChild.firstElementChild
        this.timer = setInterval(() => {
          tableWrapper.scrollTop += 1
          // 判断是否滚动到底部，如果到底部了置为0（可视高度+距离顶部=整个高度）
          if (tableWrapper.clientHeight + tableWrapper.scrollTop === tableWrapper.scrollHeight) {
            tableWrapper.scrollTop = 0
          }
        }, 100)
      }
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
    <el-table v-if="waterQualityDimension === '总氮'" ref="scroll_Table" :data="tableData" :height="343" style="width: 100%;" @mouseenter="autoScroll(true)" @mouseleave="autoScroll(false)" @row-click="zoomToMarkerByCode">
      <el-table-column prop="sectionName" label="断面名称" />
      <el-table-column prop="river" align="center" label="所属河流" />
      <el-table-column prop="nTarget" align="center" label="总氮目标">
        <template #default="scope">
          <span v-if="scope.row.nTarget">{{ scope.row.nTarget }}</span>
          <span v-else>未作要求</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalNitrogen" align="center" label="总氮" />
      <el-table-column prop="isCompliant" align="center" label="达标状态">
        <template #default="scope">
          <span v-if="scope.row.ntIsCompliant === null">/</span>
          <span v-else :style="`color: ${scope.row.ntIsCompliant ? 'rgba(0, 202, 3, 0.8)' : 'rgba(255, 53, 53, 0.8)'}`">
            {{ scope.row.isCompliant ? '达标' : '不达标' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else ref="scroll_Table" :data="tableData" :height="343" style="width: 100%;" @mouseenter="autoScroll(true)" @mouseleave="autoScroll(false)" @row-click="zoomToMarkerByCode">
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
          <span :style="`color: ${scope.row.isCompliant ? 'rgba(0, 202, 3, 0.8)' : 'rgba(255, 53, 53, 0.8)'}`">
            {{ scope.row.isCompliant ? '达标' : '不达标' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </ZFrame>
</template>
