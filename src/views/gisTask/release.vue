<template>
  <div
    class="wrapper"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <el-main>
      <el-row>
        <div class="contacts">
          <box1>
            <div class="filters">
              <el-form ref="queryForm">
                <el-form-item>
                  <el-button
                    style="width:100%;"
                    type="primary"
                    icon="el-icon-edit-outline"
                    @click="formVisible = true"
                    >下发任务</el-button
                  >
                </el-form-item></el-form
              >
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#cccccc00"
                text-color="#fff"
                active-text-color="#ffd04b"
              >
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">已下发任务</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-s-order"></i>
                  <span slot="title">草稿箱</span>
                </el-menu-item>
                <el-menu-item index="5">
                  <i class="el-icon-delete"></i>
                  <span slot="title">回收站</span>
                </el-menu-item>
                <el-menu-item index="6">
                  <i class="el-icon-star-on"></i>
                  <span slot="title">收藏夹</span>
                </el-menu-item>
              </el-menu>
            </div>
          </box1>
        </div>
        <div class="release-list" :class="formVisible ? 'with-form' : ''">
          <box1>
            <div class="list">
              <el-table
                height="100%"
                :data="tasks"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  prop="type"
                  label="重要"
                  width="60px"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }">
                    <i
                      class="el-icon-star-on"
                      v-if="row.important"
                      style="color: orange; font-size: 21px;"
                    ></i>
                    <i
                      class="el-icon-star-off"
                      v-else
                      style="color: orange; font-size: 18px;"
                    ></i>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="type"
                  width="120px"
                  label="任务类型"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }">
                    {{ row.type || '-' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="city"
                  label="接受单位"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }">
                    {{ row.receive || '-' }}
                  </template>
                </el-table-column>
                <el-table-column label="任务名称" :show-overflow-tooltip="true">
                  <template slot-scope="{ row }">
                    {{ row.title || '-' }}
                  </template>
                </el-table-column>
                <el-table-column label="任务内容" :show-overflow-tooltip="true">
                  <template slot-scope="{ row }">
                    {{ row.content || '-' }}
                  </template>
                </el-table-column>
                <el-table-column
                  width="140px"
                  label="发布日期"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }">
                    {{ row.releaseAt | moment('MM-DD HH:mm') }}
                  </template>
                </el-table-column>
                <el-table-column
                  width="80px"
                  prop="state"
                  label="状态"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }">
                    <el-tag type="success" v-if="row.state === '已下发'">{{
                      row.state
                    }}</el-tag
                    ><el-tag type="warning" v-if="row.state === '待下发'">{{
                      row.state
                    }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div></box1
          >
        </div>
        <div class="release-form " v-if="formVisible">
          <box1>
            <div class="filters">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="任务名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动区域">
                  <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="立即下发">
                  <el-switch v-model="form.now"></el-switch>
                </el-form-item>
                <el-form-item label="任务内容">
                  <el-input
                    type="textarea"
                    v-model="form.desc"
                    :rows="8"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="formVisible = false"
                    >发布</el-button
                  >
                  <el-button type="warning" @click="formVisible = false"
                    >保存草稿</el-button
                  >
                  <el-button @click="formVisible = false">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </box1>
        </div>
      </el-row></el-main
    >
  </div>
</template>

<script>
import Box1 from '@/views/components/box1'
const types = ['数据信息上报', '季度进展上报', '年度进展上报', '监督检查通知']

const tasks = [
  {
    title: '2022年一季度环境整治',
    content: '请于下周前上传2022年一季度环境整治数据。',
    receive: '中国环境科学研究院',
    type: '数据信息上报',
    releaseAt: new Date(),
    important: true,
    state: '已下发'
  },
  {
    title: '2022年一季度季度进展',
    content: '请于下周前上传2022年一季度季度进展。',
    receive: '中国环境科学研究院',
    type: '季度进展上报',
    releaseAt: new Date(),
    important: true,
    state: '已下发'
  },
  {
    title: '2022年年度进展',
    content: '请于下周前上传2022年年度进展。',
    receive: '中国环境科学研究院',
    type: '年度进展上报',
    releaseAt: new Date(),
    important: false,
    state: '已下发'
  },
  {
    title: '监察组监督检查通知',
    content: '9月20日检查组到杭州湾检查入海排污口的整治情况。',
    receive: '中国环境科学研究院',
    type: '监督检查通知',
    releaseAt: new Date(),
    important: true,
    state: '待下发'
  }
]

export default {
  components: { Box1 },
  data() {
    return {
      tasks,
      types,
      formVisible: false,
      form: { type: '监督检查通知', now: true },
      tableData: {
        province: [],
        city: []
      },
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
    handleQuery() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 800)
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
.wrapper {
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
  .el-main {
    padding: 10px;
  }
  .el-row,
  .el-col {
    height: 100%;
    display: flex;
    flex-direction: row;
  }
  .el-row {
    .contacts {
      width: 260px;
    }
    .release-list {
      width: calc((100% - 260px));
      &.with-form {
        width: calc((100% - 260px) / 2);
      }
    }
    .release-form {
      width: calc((100% - 260px) / 2);
    }
  }
  .box1 {
    height: 100%;
    margin: 0 5px;
    ::v-deep .box-content {
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
  }
  .el-tree {
    background: none;
    color: white;
  }
  ::v-deep .el-tree-node__content:hover {
    background-color: #f5f7fa21 !important;
  }
  ::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: #f5f7fa21 !important;
  }
  ::v-deep .el-tree-node__content {
    height: auto;
    margin-bottom: 5px;
  }
  .el-menu-item {
    background-color: unset !important;
    &:hover {
      background-color: #a9a9a921 !important;
    }
  }
  .el-menu {
    border: none;
  }
}
</style>
