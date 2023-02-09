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
        <el-table-column prop="sea" label="海域" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.sea }}
          </template>
        </el-table-column>
        <el-table-column prop="year" label="年度" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="code"
          label="点位编码"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="city" label="地市" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="measureAt"
          label="监测时间"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="longitude"
          label="经度"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="latitude"
          label="纬度"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="ph" label="pH" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.ph ? `${row.ph}  ` : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="do" label="溶解氧" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.do ? `${row.do} mg/L` : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="cod"
          label="化学需氧量"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            {{ row.cod ? `${row.cod} mg/L` : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="ic" label="无机氯" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.ic ? `${row.ic} mg/L` : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ap"
          label="活性磷酸盐"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            {{ row.ap ? `${row.ap} mg/L` : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="oils"
          label="石油类"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            {{ row.oils ? `${row.oils} mg/L` : '-' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="level"
          label="水质类别"
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
import { getWaterQualityRecords } from '@/api/data'
export default {
  name: 'GisWaterQuality',
  components: {},
  data() {
    return {
      seas: [
        {
          name: '东海'
        },
        {
          name: '黄海'
        },
        {
          name: '南海'
        },
        {
          name: '渤海'
        }
      ],
      tableData: {
        page: {
          sea: '',
          order: 'measureAt',
          page: 1,
          total: 0,
          size: 30,
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
      getWaterQualityRecords(this.tableData.page).then(res => {
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
