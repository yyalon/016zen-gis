<script>
import ZFrame from '../ZFrame.vue'
import gisData from '@/api/modules/gis'
import eventBus from '@/utils/eventBus'

export default {
  name: 'CockpitOcean',
  components: { ZFrame },
  data() {
    return {
      loading: false,
      lists: [
        {
          text: '监测断面数量',
          num: 0,
          unit: '个',
          percent: 0,
          diff: 0,
          items: [{ goal: 0, diff: 0, text: '' }, { goal: 0, diff: 0, text: '' }],
        },
        {
          text: '监测面积（km2）',
          num: 0,
          percent: 0,
          diff: 0,
          items: [{ goal: 0, diff: 0, text: '' }, { goal: 0, diff: 0, text: '' }],
        },
      ],
      param: {},
    }
  },
  mounted() {
    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })
  },
  beforeUnmount() {
    eventBus.off('filterparam')
  },
  methods: {
    getData(param) {
      this.loading = true
      gisData.getSeaWaterOverall(param).then(({ data }) => {
        this.loading = false
        this.lists[0].num = data.point.currentMonthTotal
        this.lists[0].percent = data.point.currentMonthGoodAreaRatio
        this.lists[0].diff = data.point.goodAreaRatioDifference
        this.lists[0].items = data.point.provinceResults.map(item => {
          return {
            goal: item.target,
            diff: item.targetDifference,
            text: item.province,
          }
        })

        this.lists[1].num = data.area.currentMonthTotal
        this.lists[1].percent = data.area.currentMonthGoodAreaRatio
        this.lists[1].diff = data.area.goodAreaRatioDifference
        this.lists[1].items = data.area.provinceResults.map(item => {
          return {
            goal: item.target,
            diff: item.targetDifference,
            text: item.province,
          }
        })
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="近岸海域">
    <div class="cockpit-ocean-card">
      <div
        v-for="(group, index) in lists" :key="index"
        class="cockpit-ocean-item"
      >
        <div class="cockpit-ocean-left">
          <div><span class="number">{{ group.num }}</span>{{ group.unit || '' }}</div>
          <div>{{ group.text }}</div>
        </div>
        <div class="cockpit-ocean-right">
          <div class="cockpit-ocean-percent">
            <div class="cockpit-ocean-label">
              水质优良比例
            </div>
            <div><span class="number">{{ group.percent }}</span>%<span :class="`status ${group.diff >= 0 ? 'succes' : 'error'}`">{{ group.diff }}%</span></div>
          </div>
          <el-divider />
          <div class="cockpit-ocean-analysis">
            <el-table :data="group.items" :height="95" style="width: 100%;">
              <el-table-column prop="text" width="43" />
              <el-table-column prop="goal" align="center" label="考核目标">
                <template #default="scope">
                  <span class="number" style="color: #f90;">{{ scope.row.goal }}</span>%
                </template>
              </el-table-column>
              <el-table-column prop="diff" align="center" label="优于目标">
                <template #default="scope">
                  <span class="number" style="color: rgb(0 202 3 / 80%);">{{ scope.row.diff }}</span>%
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </ZFrame>
</template>

<style lang="scss" scoped>
.cockpit-ocean-card {
  margin-top: -16px;

  .cockpit-ocean-item {
    display: flex;
    background: linear-gradient(180deg, rgb(93 204 255 / 0%) 0%, rgb(91 203 255 / 6%) 100%);
    border-radius: 4px;

    & + .cockpit-ocean-item {
      margin-top: 12px;
    }
  }

  .cockpit-ocean-left {
    width: 167px;
    height: 182px;
    padding-top: 36px;
    text-align: center;
    background-image: url("@/assets/images/oceanBg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .number {
      font-size: 34px;
    }
  }

  .cockpit-ocean-right {
    flex: 1;
    padding: 8px 8px 0;

    .status {
      position: relative;
      margin-left: 8px;
      padding-left: 16px;

      &::before {
        content: "";
        position: absolute;
        top: -2px;
        left: 0;
        width: 0;
        height: 0;
        border: 6px solid transparent;
      }

      &.succes::before {
        border-bottom-color: rgb(0 202 3 / 80%);
      }

      &.error::before {
        border-bottom-color: rgb(255 53 53 / 80%);
      }
    }

    ::v-deep .el-divider {
      border: 0;
      background: linear-gradient(270deg, rgb(72 179 255 / 0%) 0%, rgb(81 183 255 / 80%) 52%, rgb(81 183 255 / 0%) 100%);

      &.el-divider--horizontal {
        margin: 14px 0;
      }

      &.el-divider--vertical {
        margin: 0;
        height: auto;
        background: linear-gradient(rgb(25 117 255 / 0%) 0%, rgb(25 117 255 / 60%) 51%, rgb(25 117 255 / 0%) 100%);
      }
    }

    .cockpit-ocean-label {
      margin-bottom: 4px;
    }
  }

  .cockpit-ocean-percent {
    .number {
      font-size: 36px;
    }
  }

  .cockpit-ocean-analysis {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 108px;
      width: 1px;
      background: linear-gradient(rgb(25 117 255 / 0%) 0%, rgb(25 117 255 / 60%) 51%, rgb(25 117 255 / 0%) 100%);
    }

    ::v-deep .el-table {
      th.el-table__cell {
        color: #fff;
        padding: 0 !important;
      }

      td.el-table__cell {
        padding-top: 4.5px !important;
        padding-bottom: 4.5px !important;
      }

      td.el-table__cell:first-child {
        padding-left: 0 !important;
        padding-right: 0 !important;

        .cell {
          padding: 0;
        }
      }
    }

    .number {
      font-size: 24px;
    }
  }
}
</style>
