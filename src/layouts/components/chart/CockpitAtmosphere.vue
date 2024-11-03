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
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="大气实况">
    <div class="subtitle">
      监测站监测数据
    </div>
    <el-table ref="scroll_Table" :data="tableData" :height="313" style="width: 100%;" @mouseenter="autoScroll(true)" @mouseleave="autoScroll(false)">
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
