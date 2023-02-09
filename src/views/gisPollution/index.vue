<template>
  <div
    class="gis-water-quality"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <div class="filters">
      <el-form ref="queryForm" :inline="true">
        <el-form-item label="海域">
          <el-select
            v-model="tableData.page.sea"
            :clearable="true"
            placeholder="请选择海域"
          >
            <el-option
              v-for="(type, index) in seas"
              :key="index"
              :label="type.name"
              :value="type.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery()"
            >搜索</el-button
          >
        </el-form-item></el-form
      >
    </div>
    <div class="list">
      <el-table
        height="100%"
        :data="tableData.items"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="sea"
          label="海域"
          :show-overflow-tooltip="true"
          width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          :show-overflow-tooltip="true"
          width="180px"
        >
        </el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="radius"
          label="半径"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <div>
              {{ row.radius ? `${row.radius} 公里` : '-' }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        small
        layout="total, prev, pager, next"
        :page-size.sync="tableData.page.size"
        :total="tableData.page.total"
        @current-change="handleQuery"
      />
    </div>
  </div>
</template>

<script>
import { getPollutions } from '@/api/data'
export default {
  name: 'GisWaterQuality',
  components: {},
  data() {
    return {
      seas: [
        {
          name: '东海区'
        },
        {
          name: '黄海区'
        },
        {
          name: '南海区'
        },
        {
          name: '渤海区'
        }
      ],
      tableData: {
        page: {
          page: 1,
          size: 30,
          total: 0,
          sort: 'desc'
        },
        items: []
      },
      pageCount: 1,
      loading: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.handleQuery()
  },
  beforeDestroy() {},
  methods: {
    handleQuery(page) {
      this.loading = true
      this.tableData.page.page = page || 1
      this.tableData.items = []

      getPollutions(this.tableData.page).then(res => {
        const { pagination, list } = res
        this.loading = false
        if (pagination && list) {
          this.tableData.page = { ...this.tableData.page, ...pagination }
          this.tableData.items = list
        }
      })
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'even-row-style'
      }
      return 'odd-row-style'
    }
  }
}
</script>

<style lang="scss" scoped>
.gis-water-quality {
  padding: 10px;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(179deg, #001a3ed9 64%, #001a3e 96%);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .list {
    flex-grow: 1;
  }
}
</style>
