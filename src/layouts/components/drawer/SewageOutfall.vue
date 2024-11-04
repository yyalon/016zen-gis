<script>
import gisData from '@/api/modules/gis'

import direct from '@/assets/images/direct.png'

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    drawerData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['close'],
  data() {
    return { direct, dialogVisible: false, sewageOutfallDetails: [], outfall: null }
  },
  watch: {
    async visible() {
      this.dialogVisible = this.visible
      if (this.dialogVisible) {
        this.outfall = this.drawerData?.name
        await this.getData()
      }
    },
  },
  async mounted() {},
  unmounted() {
    this.handleClose()
  },
  methods: {
    async getData() {
      const { code, data } = await gisData.getResponsiblePartyOutfallInfo({ id: this.drawerData.id })
      if (code === 1000) {
        this.sewageOutfallDetails = []
        data.forEach((item) => {
          const findItem = this.sewageOutfallDetails.find((o) => o.id === item.id)
          if (!findItem) {
            this.sewageOutfallDetails.push(item)
          }
        })
      }
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="drawerData?.responsibleParty"
      :append-to-body="true"
      width="447"
      class="outfall-dialog"
      @close="handleClose()"
    >
      <template #default>
        <div class="dialog-body">
          <el-tabs
            v-model="outfall"
            type="card"
            class="outfall-tabs"
            @tab-click="handleClick"
          >
            <el-tab-pane v-for="item in sewageOutfallDetails" :key="item.name" :label="item.name" :name="item.name">
              <div class="outfalls-title">
                <div class="left">
                  <img :src="direct">监测信息
                </div>
                <div class="right">
                  更新时间：2024-04
                </div>
              </div>
              <div class="outfalls-content">
                <div class="outfalls-items">
                  <div class="outfalls-number">
                    8
                  </div>
                  <div class="outfalls-label">
                    pH
                  </div>
                </div>
                <div class="outfalls-items">
                  <div class="outfalls-number">
                    10.6
                  </div>
                  <div class="outfalls-label">
                    DO
                  </div>
                </div>
                <div class="outfalls-items exceeStatus">
                  <div class="outfalls-number">
                    11.4
                  </div>
                  <div class="outfalls-label">
                    IMn
                  </div>
                </div>
                <div class="outfalls-items">
                  <div class="outfalls-number">
                    0.17
                  </div>
                  <div class="outfalls-label">
                    NH3-N
                  </div>
                </div>
                <div class="outfalls-items">
                  <div class="outfalls-number">
                    0.04
                  </div>
                  <div class="outfalls-label">
                    TP
                  </div>
                </div>
              </div>
              <div class="outfalls-tip">
                <span />表示该指标超标 （mg/L，PH值除外）
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.outfalls-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 8px;

  .left {
    display: flex;
    align-items: center;
    font-size: 20px;
  }
}

.outfalls-content {
  display: flex;
  align-items: stretch;
  margin-bottom: 8px;
}

.outfalls-items {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 93px;
  background: rgb(20 112 204 / 15%);
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  &::before {
    content: "";
    position: absolute;
    top: 4px;
    right: 4px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }

  .outfalls-number {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .outfalls-label {
    font-weight: 700;
    color: rgb(255 255 255 / 80%);
  }

  &.exceeStatus {
    background: rgb(255 43 43 / 20%);

    &::before {
      background: #ff2b2b;
    }

    .outfalls-number {
      color: #ea0000;
    }
  }
}

.outfalls-tip {
  display: flex;
  align-items: center;
  color: rgb(255 255 255 / 80%);

  > span {
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #ff2b2b;
    margin-right: 4px;
  }
}

:deep(.el-tabs) {
  .el-tabs__header {
    height: 64px;
    padding: 0 22px;
    margin: 0;
    background: linear-gradient(180deg, rgb(35 129 248 / 0%) 28%, rgb(35 129 248 / 30%) 100%), rgb(2 47 135 / 90%);
    border-bottom: 2px solid #2381f8;
  }

  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    width: auto;
    line-height: 37px;

    .el-icon {
      color: #fff;
    }
  }

  .el-tabs__nav-next {
    margin-left: 12px;
  }

  .el-tabs__nav-prev {
    margin-right: 12px;
  }

  &.el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 0;
  }

  &.el-tabs--card > .el-tabs__header .el-tabs__item {
    font-size: 20px;
    font-weight: 700;
    color: rgb(255 255 255 / 80%);
    display: flex;
    justify-content: center;
    padding: 0 20px;
    height: 37px;
    margin-right: 10px;
    border: 1px solid #4595fe;
    background: rgb(2 47 135 / 10%);
    box-shadow: inset 0 0 8px 0 rgb(0 115 255 / 49%), inset 0 0 12px 0 #235cf8;

    &:last-child {
      margin-right: 0;
    }
  }

  &.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    color: #fff;
    background: linear-gradient(180deg, rgb(35 181 248 / 0%) 0%, #0ba4ee 100%);
    border: 1px solid;
    border-image: linear-gradient(270deg, #0ff 14%, #fff 49%, #0ff 77%) 1;
    box-shadow: inset 0 0 8px 0 rgb(0 115 255 / 49%), inset 0 0 12px 0 #235cf8;
  }

  .el-tabs__content {
    padding: 30px;
  }
}
</style>
