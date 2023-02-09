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
        <el-form-item label="省市">
          <el-cascader
            v-model="city"
            :options="options"
            clearable
            :props="{ checkStrictly: true }"
          ></el-cascader>
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
        <el-table-column label="方案名称" :show-overflow-tooltip="true">
          <template slot-scope="{ row }"> 《{{ row.name }}》 </template>
        </el-table-column>
        <el-table-column
          width="60px"
          prop="province"
          label="省份"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }"> {{ row.province || '-' }} </template>
        </el-table-column>
        <el-table-column
          width="60px"
          prop="city"
          label="市"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }"> {{ row.city || '-' }} </template>
        </el-table-column>
        <el-table-column
          width="140px"
          prop="date"
          label="发布日期"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="unit"
          label="发布单位"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          width="80px"
          prop="state"
          label="状态"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.state === '已发布'">{{
              row.state
            }}</el-tag
            ><el-tag type="warning" v-if="row.state === '待发布'">{{
              row.state
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          label="操作"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="download(row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const options = [
  {
    value: '上海',
    label: '上海市'
  },
  {
    value: '江苏',
    label: '江苏省',
    children: [
      {
        value: '南通',
        label: '南通市'
      }
    ]
  },
  {
    value: '浙江',
    label: '浙江省',
    children: [
      {
        value: '嘉兴',
        label: '嘉兴市 '
      },
      {
        value: '杭州',
        label: '杭州市'
      },
      {
        value: '绍兴',
        label: '绍兴市'
      },
      {
        value: '宁波',
        label: '宁波市'
      },
      {
        value: '舟山',
        label: '舟山市'
      }
    ]
  }
]
const plans = [
  {
    name: '南通市近岸海域综合治理攻坚战实施方案',
    province: '江苏',
    city: '南通',
    unit: '南通市打好污染防治攻坚战指挥部办公室',
    date: '2022年7月15日',
    file: 'nantong.pdf',
    state: '已发布'
  },
  {
    name: '浙江省重点海域综合治理攻坚战实施方案',
    province: '浙江',
    city: '',
    unit: '浙江省生态环境厅',
    date: '2022年6月15日',
    file: 'nantong.pdf',
    state: '待发布'
  },
  {
    name: '上海市重点海域综合治理攻坚战实施方案',
    province: '上海',
    city: '',
    unit: '上海省生态环境局',
    date: '2022年4月',
    file: 'nantong.pdf',
    state: '待发布'
  }
]
export default {
  name: 'GisWaterQuality',
  components: {},
  data() {
    return {
      plans,
      city: '',
      options,
      types: [],
      tableData: {
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
    view() {},
    download(row) {
      window.open(window.config.fileUrl + row.file, '_blank')
    },
    handleQuery() {
      this.loading = true
      this.tableData.items = []

      let plans = []
      if (this.city) {
        if (this.city.length === 1) {
          this.plans.forEach(plan => {
            if (plan.province === this.city[0]) {
              plans.push(plan)
            }
          })
        }
        if (this.city.length === 2) {
          this.plans.forEach(plan => {
            if (plan.city === this.city[1]) {
              plans.push(plan)
            }
          })
        }
      } else {
        plans = this.plans
      }

      setTimeout(() => {
        this.loading = false
        this.tableData.items = plans
      }, 1500)
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
