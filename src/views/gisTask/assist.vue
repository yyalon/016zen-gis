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
            <el-tree
              :data="options"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <div class="card" :class="data.type ? data.type : ''">
                  <div v-if="data.type !== 'city'" class="image">
                    <img
                      src="@/assets/img/user.svg"
                      class="img-circle img-lg"
                    />
                  </div>
                  <div class="info">
                    <div class="name" style="color:orange;">
                      {{ data.name }}
                    </div>
                    <div class="leader">{{ data.leader }}</div>
                    <div class="unit">{{ data.unit }}</div>
                    <div class="mobile">{{ data.mobile }}</div>
                  </div>
                  <div class="members" v-if="data.members">
                    <div
                      class="member"
                      v-for="(member, index) in data.members"
                      :key="index"
                    >
                      <span class="name">{{ member.name }}</span>
                      {{ member.unit }}
                    </div>
                  </div>
                </div>
              </span>
            </el-tree></box1
          >
        </div>
        <div class="works">
          <box1>
            <div class="filters">
              <el-form ref="queryForm" :inline="true">
                <el-form-item>
                  <el-cascader
                    @change="handleQuery()"
                    v-model="province"
                    :options="provinces"
                    clearable
                  ></el-cascader>
                </el-form-item>
              </el-form>
            </div>
            <div class="list">
              <el-table
                height="100%"
                :data="tableData.province"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  width="60px"
                  label="省份"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }">
                    {{ row.province || '-' }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="帮扶工作内容"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }"> {{ row.content }} </template>
                </el-table-column>

                <el-table-column
                  prop="effect"
                  label="取得成效"
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
                    <el-tag type="success" v-if="row.state === '已完成'">{{
                      row.state
                    }}</el-tag
                    ><el-tag type="warning" v-if="row.state === '进行中'">{{
                      row.state
                    }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div></box1
          >
        </div>
        <div class="works">
          <box1>
            <div class="filters">
              <el-form ref="queryForm" :inline="true">
                <el-form-item>
                  <el-cascader
                    @change="handleQuery()"
                    v-model="city"
                    :options="citys"
                    clearable
                    :props="{ checkStrictly: true }"
                  ></el-cascader>
                </el-form-item>
              </el-form>
            </div>
            <div class="list">
              <el-table
                height="100%"
                :data="tableData.city"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  width="60px"
                  prop="province"
                  label="市"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }">
                    {{ row.city || '-' }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="帮扶工作内容"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="{ row }"> {{ row.content }} </template>
                </el-table-column>

                <el-table-column
                  prop="effect"
                  label="取得成效"
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
                    <el-tag type="success" v-if="row.state === '已完成'">{{
                      row.state
                    }}</el-tag
                    ><el-tag type="warning" v-if="row.state === '进行中'">{{
                      row.state
                    }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div></box1
          >
        </div>
      </el-row></el-main
    >
  </div>
</template>

<script>
import Box1 from '@/views/components/box1'

const works = {
  province: [
    {
      province: '江苏',
      content: '技术支持',
      effect: '效果显著',
      state: '已完成'
    },
    {
      province: '上海',
      content: '技术支持',
      effect: '效果显著',
      state: '已完成'
    },
    {
      province: '江苏',
      content: '技术支持',
      effect: '效果显著',
      state: '已完成'
    },
    {
      province: '上海',
      content: '技术支持',
      effect: '效果显著',
      state: '已完成'
    },
    {
      province: '浙江',
      content: '技术支持',
      effect: '效果显著',
      state: '进行中'
    },
    {
      province: '浙江',
      content: '技术支持',
      effect: '效果显著',
      state: '进行中'
    }
  ],
  city: [
    {
      province: '江苏',
      city: '南通',
      content: '技术支持',
      effect: '效果显著',
      state: '已完成'
    },
    {
      province: '上海',
      city: '上海',
      content: '技术支持',
      effect: '效果显著',
      state: '进行中'
    },
    {
      province: '上海',
      city: '上海',
      content: '技术支持',
      effect: '效果显著',
      state: '进行中'
    },
    {
      province: '浙江',
      city: '杭州',
      content: '技术支持',
      effect: '效果显著',
      state: '进行中'
    },
    {
      province: '浙江',
      city: '舟山',
      content: '技术支持',
      effect: '效果显著',
      state: '进行中'
    }
  ]
}

const provinces = [
  {
    value: '上海',
    label: '上海市'
  },
  {
    value: '江苏',
    label: '江苏省'
  },
  {
    value: '浙江',
    label: '浙江省'
  }
]
const citys = [
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
const options = [
  {
    name: '长江口-杭州湾',
    unit: '国家海洋环境监测中心',
    mobile: '13889537591',
    leader: '马明辉',
    type: 'area',
    children: [
      {
        name: '江苏省',
        unit: '太湖东海局监测与科研中心',
        mobile: '18930090046',
        leader: '刘星',
        type: 'province',
        children: [
          {
            name: '南通市',
            unit: '太湖东海局监测与科研中心',
            mobile: '18930090046',
            leader: '刘星',
            type: 'city',
            members: [
              { name: '刘星', unit: '太湖东海局监测与科研中心' },
              { name: '刘鹏霞', unit: '太湖东海局监测与科研中心' },
              { name: '邵晓静', unit: '太湖东海局监测与科研中心' },
              { name: '吴斌', unit: '太湖东海局监测与科研中心' },
              { name: '梁斌', unit: '国家海洋环境监测中心' },
              { name: '郎琪', unit: '中国环境科学研究院' }
            ]
          }
        ]
      },
      {
        name: '上海市',
        unit: '中国环境科学研究院',
        mobile: '13366463273',
        leader: '雷坤',
        type: 'province',
        children: [
          {
            name: '上海市',
            unit: '中国环境科学研究院',
            mobile: '13366463273',
            leader: '雷坤',
            type: 'city',
            members: [
              { name: '雷坤', unit: '中国环境科学研究院' },
              { name: '李晓光', unit: '中国环境科学研究院' },
              { name: '刘新妹', unit: '中国环境科学研究院' },
              { name: '吕旭波', unit: '中国环境科学研究院' },
              { name: '于春艳', unit: '国家海洋环境监测中心' },
              { name: '梁雅惠', unit: '国家海洋环境监测中心' },
              { name: '刘鹏霞', unit: '太湖东海局监测与科研中心' },
              { name: '邵晓静', unit: '太湖东海局监测与科研中心' }
            ]
          }
        ]
      },
      {
        name: '浙江省',
        unit: '国家海洋环境监测中心',
        mobile: '15998698192',
        leader: '许妍',
        type: 'province',
        children: [
          {
            name: '舟山市',
            unit: '中国环境科学研究院',
            mobile: '13366463273',
            leader: '雷坤',
            type: 'city',
            members: [
              { name: '雷坤', unit: '中国环境科学研究院' },
              { name: '王艳', unit: '中国环境科学研究院' },
              { name: '梁雅惠', unit: '国家海洋环境监测中心' },
              { name: '徐超', unit: '太湖东海局监测与科研中心' }
            ]
          },
          {
            name: '嘉兴市',
            unit: '国家海洋环境监测中心',
            mobile: '13840869921',
            leader: '梁斌',
            type: 'city',
            members: [
              { name: '梁斌', unit: '国家海洋环境监测中心' },
              { name: '余东', unit: '国家海洋环境监测中心' },
              { name: '徐香勤', unit: '中国环境科学研究院' },
              { name: '刘鹏霞', unit: '太湖东海局监测与科研中心' }
            ]
          },
          {
            name: '杭州市',
            unit: '太湖东海局监测与科研中心',
            mobile: '18616108606',
            leader: '刘鹏霞',
            type: 'city',
            members: [
              { name: '刘鹏霞', unit: '太湖东海局监测与科研中心' },
              { name: '邵晓静', unit: '太湖东海局监测与科研中心' },
              { name: '李冕', unit: '国家海洋环境监测中心' },
              { name: '李晓光', unit: '中国环境科学研究院' }
            ]
          },
          {
            name: '绍兴市',
            unit: '国家海洋环境监测中心',
            mobile: '15566933350',
            leader: '兰冬东',
            type: 'city',
            members: [
              { name: '兰冬东', unit: '国家海洋环境监测中心' },
              { name: '李冕', unit: '国家海洋环境监测中心' },
              { name: '刘新妹', unit: '中国环境科学研究院' },
              { name: '徐超', unit: '太湖东海局监测与科研中心' }
            ]
          },
          {
            name: '宁波市',
            unit: '国家海洋环境监测中心',
            mobile: '15998698192',
            leader: '许妍',
            type: 'city',
            members: [
              { name: '许妍', unit: '国家海洋环境监测中心' },
              { name: '徐双', unit: '国家海洋环境监测中心' },
              { name: '王艳', unit: '中国环境科学研究院' },
              { name: '刘星', unit: '太湖东海局监测与科研中心' }
            ]
          }
        ]
      }
    ]
  }
]
export default {
  name: 'GisWaterQuality',
  components: { Box1 },
  data() {
    return {
      city: '',
      province: '',
      provinces,
      citys,
      options,
      works,
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
      let cityItems = []
      let provinceItems = []
      if (this.province && this.province.length > 0) {
        if (this.province.length === 1) {
          this.works.province.forEach(plan => {
            if (plan.province === this.province[0]) {
              provinceItems.push(plan)
            }
          })
        }
      } else {
        provinceItems = this.works.province
      }
      if (this.city && this.city.length > 0) {
        if (this.city.length === 1) {
          this.works.city.forEach(plan => {
            if (plan.province === this.city[0]) {
              cityItems.push(plan)
            }
          })
        }
        if (this.city.length === 2) {
          this.works.city.forEach(plan => {
            if (plan.city === this.city[1]) {
              cityItems.push(plan)
            }
          })
        }
      } else {
        cityItems = this.works.city
      }
      setTimeout(() => {
        this.loading = false
        this.tableData.province = provinceItems
        this.tableData.city = cityItems
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
      width: 500px;
    }
    .works {
      width: calc((100% - 500px) / 2);
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
  .card {
    border: 1px solid #0faafb54;
    padding: 10px;
    border-radius: 3px;
    background: #0faafb3b;
    display: flex;
    &.city {
      background-color: #cdcdcd1c;
      border-color: #9797972e;
    }
    .image {
      margin: 10px 5px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .members {
      .name {
        font-size: 14px;
        color: #e3efff;
      }
      padding-left: 5px;
      color: #89bbf7;
    }
    .name {
    }
    .unit {
      color: #c7c7c7;
    }
    .mobile {
    }
    .leader {
      font-size: 16px;
    }
  }
}
</style>
