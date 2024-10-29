<script>
import ZFrame from '../ZFrame.vue'
import gisData from '@/api/modules/gis'

export default {
  name: 'CockpitMeteorology',
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
      gisData.getMeteorology({ time: '2023-09-01' }).then(({ data }) => {
        this.loading = false
        console.log(data)
        this.tableData = data.map(item => {
          return {
            text1: item.stationName,
            text2: item.winSpeed,
            text3: item.winDirection,
            color: '',
            text4: item.RHU,
          }
        })
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="气象实况">
    <div class="subtitle">
      监测站监测数据
    </div>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="text1" label="站点" />
      <el-table-column prop="text2" align="center" label="风速" />
      <el-table-column prop="text3" align="center" label="风向" />
      <el-table-column prop="text4" align="center" label="湿度" />
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
