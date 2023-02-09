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
        <el-form-item label="岸线类型">
          <el-select
            v-model="tableData.page.coast"
            :clearable="true"
            placeholder="请选择岸线类型"
          >
            <el-option
              v-for="(type, index) in types"
              :key="index"
              :label="type.name"
              :value="type.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入海方式">
          <el-select
            v-model="tableData.page.mode"
            :clearable="true"
            placeholder="请选择入海方式"
          >
            <el-option
              v-for="(type, index) in modes"
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
        <el-table-column prop="code" label="编号" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="sea" label="海域" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="city" label="地市" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="type" label="类别" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="type" label="类型" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="coast"
          label="岸线类型"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="frequency"
          label="污水排放方式"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="mode"
          label="入海方式"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="subtype"
          label="子类型"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          prop="unit"
          label="责任单位"
          :show-overflow-tooltip="true"
        >
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
import { getSewageOutfall } from '@/api/data'
export default {
  name: 'GisWaterQuality',
  components: {},
  data() {
    return {
      modes: [
        {
          name: '明渠'
        },
        {
          name: '管道'
        }
      ],
      types: [
        {
          name: '人工岸线'
        },
        {
          name: '自然岸线'
        }
      ],
      tableData: {
        page: {
          coast: '',
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

      getSewageOutfall(this.tableData.page).then(res => {
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
