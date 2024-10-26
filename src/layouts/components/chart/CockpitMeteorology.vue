<script>
import ZFrame from '../ZFrame.vue'

export default {
  name: 'CockpitMeteorology',
  components: { ZFrame },
  data() {
    return {
      tableData: [
        { text1: 'xx子站', text2: 32, text3: '南', color: '#F9D000', text4: 32 },
        { text1: 'xx子站', text2: 32, text3: '北', color: '#26B200', text4: 18 },
      ],
    }
  },
}
</script>

<template>
  <ZFrame title="气象实况">
    <div class="subtitle">
      监测站监测数据
    </div>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="text1" label="站点" />
      <el-table-column prop="text2" align="center" label="风速" />
      <el-table-column prop="text3" align="center" label="风向">
        <template #default="scope">
          <el-tag :color="scope.row.color" style="color: #000; border: 0;">
            {{ scope.row.text3 }}
          </el-tag>
        </template>
      </el-table-column>
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
