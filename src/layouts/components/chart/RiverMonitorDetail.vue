<script>
import ZFrame from '../ZFrame.vue'

export default {
  name: 'RiverMonitorDetail',
  components: { ZFrame },
  data() {
    return {
      tableData: [
        { text1: '大洋港桥', text2: '通吕运河', text3: 'I', text4: 'I', text5: '达标' },
        { text1: '北凌新闸', text2: '北凌河', text3: 'II', text4: 'II', text5: '达标' },
      ],
    }
  },
}
</script>

<template>
  <ZFrame title="断面监测数据详情">
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="text1" label="断面名称" />
      <el-table-column prop="text2" :align="center" label="所属河流" />
      <el-table-column prop="text3" :align="center" label="水质目标" />
      <el-table-column prop="text4" :align="center" label="水质类别" />
      <el-table-column prop="text4" :align="center" label="达标状态" />
    </el-table>
  </ZFrame>
</template>
