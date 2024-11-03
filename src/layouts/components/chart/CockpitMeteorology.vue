<script>
import ZFrame from '../ZFrame.vue'
import gisData from '@/api/modules/gis'
import eventBus from '@/utils/eventBus'

export default {
  name: 'CockpitMeteorology',
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
      gisData.getMeteorology(param).then(({ data }) => {
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
  <ZFrame v-loading="loading" title="气象实况">
    <div class="subtitle">
      监测站监测数据
    </div>
    <el-table
      ref="scroll_Table"
      :data="tableData" :height="313" style="width: 100%;" @mouseenter="autoScroll(true)" @mouseleave="autoScroll(false)"
    >
      <el-table-column prop="stationName" label="站点" />
      <el-table-column prop="winSpeed" align="center" label="风速" />
      <el-table-column prop="winDirection" align="center" label="风向" />
      <el-table-column prop="RHU" align="center" label="湿度" />
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
