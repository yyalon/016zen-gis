<template>
  <el-drawer
    :modal="false"
    size="calc(100% - 55px)"
    :with-header="false"
    :visible="drawerVisible"
    direction="btt"
  >
    <div class="device-wrapper">
      <el-row class="top">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-d-arrow-left"
          @click="close"
          >返回</el-button
        >
      </el-row>
      <div class="content">
        <div class="log-wrapper">
          <div class="logs">
            <div class="title">达标预期分析</div>
            <div class="filters">
              <el-form ref="queryForm" :inline="true" size="mini">
                <el-form-item>
                  <el-select placeholder="省份" v-model="province">
                    <el-option
                      :label="province.value"
                      :value="province.value"
                      v-for="(province, index) in provinces"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="name" placeholder="请输入关键字" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="list">
              <el-table
                height="100%"
                :data="tableData.items"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="name"
                  label="断面名称"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="类型"
                  :show-overflow-tooltip="true"
                  width="80px"
                >
                </el-table-column>
                <el-table-column label="监测时间" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="水质目标" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="现状类别" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  label="污染物类别"
                  width="120px"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column
                  label="污染物平均浓度"
                  width="120px"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column label="浓度限值" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="达标" :show-overflow-tooltip="true">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="log-wrapper">
          <div class="logs">
            <div class="title">污染物浓度趋势分析</div>
            <div class="filters">
              <el-form ref="queryForm" :inline="true" size="mini">
                <el-form-item>
                  <el-select placeholder="省份" v-model="province">
                    <el-option
                      :label="province.value"
                      :value="province.value"
                      v-for="(province, index) in provinces"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="type"
                    placeholder="请选择监测指标"
                    size="mini"
                  >
                    <el-option
                      v-for="(type, key) in types"
                      :key="key"
                      :label="type"
                      :value="key"
                    /> </el-select
                ></el-form-item>

                <el-form-item>
                  <el-input v-model="name" placeholder="请输入关键字" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="list">
              <el-table
                height="100%"
                :data="tableData.items"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="name"
                  label="断面名称"
                  :show-overflow-tooltip="true"
                >
                </el-table-column> 
 
                </el-table-column>
                <el-table-column label="监测时间" :show-overflow-tooltip="true">
                </el-table-column> 
                <el-table-column label="现状类别" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  label="污染物浓度"
                  width="120px"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>   
              </el-table>
            </div>
          </div>
        </div>
        <div class="log-wrapper">
          <div class="logs">
            <div class="title">总氮浓度趋势分析</div>
            <div class="filters">
              <el-form ref="queryForm" :inline="true" size="mini">
                <el-form-item>
                  <el-select placeholder="省份" v-model="province">
                    <el-option
                      :label="province.value"
                      :value="province.value"
                      v-for="(province, index) in provinces"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="name" placeholder="请输入关键字" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="list">
              <el-table
                height="100%"
                :data="tableData.items"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="name"
                  label="断面名称"
                  :show-overflow-tooltip="true"
                >
                </el-table-column> 
                </el-table-column> 
                <el-table-column label="监测时间" :show-overflow-tooltip="true">
                </el-table-column> 
                <el-table-column label="总氮浓度" :show-overflow-tooltip="true">
                </el-table-column> 
                </el-table-column>
                <el-table-column
                  label="年平均浓度"
                  width="120px"
                  :show-overflow-tooltip="true"
                >
                </el-table-column>  
              </el-table>
            </div>
          </div>
        </div>
      </div></div
  ></el-drawer>
</template>

<script>
import { getRiverSections } from '@/api/data'
const provinces = [
  { text: '上海', value: '上海' },
  { text: '浙江', value: '浙江' },
  { text: '江苏', value: '江苏' }
]
const types = {
  TP: 'T-P(mg/L)',
  TN: 'T-N(mg/L)',
  Cu: 'Cu(mg/L)',
  Zn: 'Zn(mg/L)',
  Pb: 'Pb(mg/L)',
  Cd: 'Cd(mg/L)',
  BOD5: 'BOD5(mg/L)',
  TAs: 'T-As(mg/L)',
  THg: 'T-Hg(mg/L)',
  Cr6p: 'Cr6+(mg/L)',
  Fm: 'F-(mg/L)',
  CNm: 'CN-(mg/L)',
  phenol: '挥发酚(mg/L)',
  oils: '石油类(mg/L)',
  LAS: 'LAS(mg/L)',
  S2m: 'S2-(mg/L)',
  Chla: 'Chla(mg/L)',
  NO3m: 'NO3-(mg/L)',
  NO2m: 'NO2-(mg/L)',
  do: '溶解氧(mg/L)',
  ph: 'pH值',
  CODMn: 'COD Mn(mg/L)',
  CODCr: 'COD Cr(mg/L)',
  NH3mN: 'NH₃-N(mg/L)'
}
export default {
  name: 'DrawerRiver',
  components: {},
  props: {
    drawerVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: 'TN',
      types,
      tableData: {
        items: []
      },
      provinces,
      province: '浙江'
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.handleQuery()
    })
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'even-row-style'
      }
      return 'odd-row-style'
    },
    handleQuery() {
      this.loading = true
      this.tableData.items = []

      getRiverSections().then(res => {
        this.tableData.items = res
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  height: 100%;
  .el-input__inner {
    width: 120px;
  }
}
.el-date-editor.el-input__inner {
  width: 100% !important;
}
.device-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: linear-gradient(179deg, #001a3ed9 64%, #001a3e 96%);
  .title {
    font-size: 16px;
    padding: 10px;
    text-align: center;
    color: white;
  }
  .top {
    padding: 15px 20px;
  }
  .details {
    padding: 0 20px 10px;
    border-radius: 2px;
    .el-form {
      padding-top: 20px;
      color: white;
      background: #192236;
      ::v-deep .el-form-item__label {
        color: #597ff7;
      }
    }
  }
  ::v-deep table.el-table__body {
    tr:nth-child(2n) {
      background-color: #7074ad33 !important;
    }
  }
  .content {
    display: flex;
    overflow: hidden;
    padding: 0 0 20px;
    flex-grow: 1;
    .map-wrapper {
      width: 33%;
      padding: 10px 0 0 20px;
      .map {
        height: 100%;
        background: #1a2335;
      }
    }
    .alarms-wrapper,
    .log-wrapper {
      width: 33%;
      padding: 10px 0 0 20px;
      background: rgba(74, 144, 226, 0.4);
      height: 100%;
      display: flex;
      background-clip: content-box;
      flex-direction: column;
      .alarms,
      .logs {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        border: 1px solid rgba(74, 144, 226, 0.3);
        height: 100%;
        overflow: auto;
        .list {
          flex-grow: 1;
        }
      }
      .el-pagination {
        padding-bottom: 15px;
        text-align: center;
      }
      .el-pagination__jump {
        color: #597ff7;
      }
    }
  }
}
</style>
