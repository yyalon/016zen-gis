<script>
import ZFrame from '../ZFrame.vue'

export default {
  name: 'CockpitAtmosphere',
  components: { ZFrame },
  data() {
    return {
      tableData: [
        { text1: 'xx子站', text2: 32, text3: '良', text4: 'CO' },
        { text1: 'xx子站', text2: 32, text3: '良', text4: 'CO' },
      ],
    }
  },
}
</script>

<template>
  <ZFrame title="大气实况">
    <div class="subtitle">
      监测站监测数据
    </div>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column prop="text1" label="站点" />
      <el-table-column prop="text2" align="center" label="AQI" />
      <el-table-column prop="text3" align="center" label="空气质量等级">
        <template #default="scope">
          <el-tag color="#F9D000" style="color: #000; border: 0;">
            {{ scope.row.text3 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="text4" align="center" label="首要污染物" />
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
