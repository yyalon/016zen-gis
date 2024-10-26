<script>
import ZFrame from '../ZFrame.vue'

export default {
  name: 'RiverMonitorDetail',
  components: { ZFrame },
  data() {
    return {
      tableData: [
        { text1: '大洋港桥', text2: '通吕运河', text3: 'I', text4: 'I', text5: '达标' },
        { text1: '北凌新闸', text2: '北凌河', text3: 'II', text4: 'II', text5: '不达标' },
      ],
      colors: {
        I: '#007BFF',
        II: '#2238FF',
        III: '#00B222',
      },
    }
  },
}
</script>

<template>
  <ZFrame title="断面监测数据详情">
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="text1" label="断面名称" />
      <el-table-column prop="text2" align="center" label="所属河流" />
      <el-table-column prop="text3" align="center" label="水质目标">
        <template #default="scope">
          <el-tag :color="colors[scope.row.text3]" style="color: #fff; border: 0;">
            {{ scope.row.text3 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="text4" align="center" label="水质类别">
        <template #default="scope">
          <el-tag :color="colors[scope.row.text4]" style="color: #fff; border: 0;">
            {{ scope.row.text4 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="text5" align="center" label="达标状态">
        <template #default="scope">
          <span :style="`color: ${scope.row.text5 === '达标' ? 'rgba(0, 202, 3, 0.8)' : 'rgba(255, 53, 53, 0.8)'}`">
            {{ scope.row.text5 }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </ZFrame>
</template>
