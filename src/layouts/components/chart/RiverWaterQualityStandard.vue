<script lang="ts">
import ZFrame from '../ZFrame.vue'

import water from '@/assets/images/water.png'
import gisData from '@/api/modules/gis'
import type { WaterQualityComplianceResult } from '@/api/modules/resultTypes'

export default {
  components: { ZFrame },
  data() {
    return {
      loading: false,
      water,
      data: {} as WaterQualityComplianceResult,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      gisData.getWaterQualityComplianceResult({ time: '2023-09-01' }).then(({ data }) => {
        this.loading = false
        this.data = data
      })
    },
  },
}
</script>

<template>
  <ZFrame title="河流水质达标考核">
    <div class="river-water-wrapper">
      <div class="river-water-title">
        <img :src="water"><span style="margin: 0 4px;">达到攻坚战水质要求</span>
        <span :class="data.complianceRate >= data.complianceTargetRate ? 'up' : 'notup'">
          {{ data.complianceRate >= data.complianceTargetRate ? '已达标' : '未达标' }}
        </span>
      </div>
      <el-divider />
      <div class="river-water-content">
        <div style="width: 50%;">
          <div class="river-water-label">
            现状
          </div>
          <div>
            <span class="number">{{ data.complianceRate }}</span>%
            <span :class="data.yoyComplianceRate >= 0 ? 'succes' : 'error'" class="status">{{ data.yoyComplianceRate }}%</span>
          </div>
        </div>
        <el-divider direction="vertical" />
        <div style="width: 25%;">
          <div class="river-water-label">
            考核目标
          </div>
          <div>
            <span class="number" style="color: #f90;">{{ data.complianceTargetRate }}</span>%
          </div>
        </div>
        <el-divider direction="vertical" />
        <div style="width: 25%;">
          <div class="river-water-label">
            劣于目标
          </div>
          <div>
            <span class="number" style="color: #cd303b;">{{ data.worseComplianceTargetRate }}</span>%
          </div>
        </div>
      </div>
    </div>
    <div class="river-water-wrapper">
      <div class="river-water-title">
        <img :src="water"><span style="margin: 0 4px;">劣V类比例</span>
        <span :class="data.poorRate <= data.poorTargetRate ? 'up' : 'notup'">
          {{ data.poorRate <= data.poorTargetRate ? '已达标' : '未达标' }}
        </span>
      </div>
      <el-divider />
      <div class="river-water-content">
        <div style="width: 50%;">
          <div class="river-water-label">
            现状
          </div>
          <div>
            <span class="number">{{ data.poorRate }}</span>%
            <span :class="data.yoyPoorRate <= 0 ? 'succes' : 'error'" class="status">{{ data.yoyPoorRate }}%</span>
          </div>
        </div>
        <el-divider direction="vertical" />
        <div style="width: 25%;">
          <div class="river-water-label">
            考核目标
          </div>
          <div>
            <span class="number" style="color: #f90;">{{ data.poorTargetRate }}</span>%
          </div>
        </div>
        <el-divider direction="vertical" />
        <div style="width: 25%;">
          <div class="river-water-label">
            劣于目标
          </div>
          <div>
            <span class="number" style="color: #cd303b;">{{ data.worsePoorTargetRate }}</span>%
          </div>
        </div>
      </div>
    </div>
  </ZFrame>
</template>

<style lang="scss" scoped>
.river-water-wrapper {
  width: 400px;
  margin: 24px auto;
  background-image: url("@/assets/images/waterQualityBg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  &:not(:last-child) {
    margin-bottom: 48px;
  }
}

.river-water-title {
  display: flex;
  align-items: center;
  padding: 6px 18px;
  font-size: 16px;

  img {
    width: 32px;
    height: 32px;
  }

  .notup {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65px;
    height: 21px;
    font-size: 14px;
    color: rgb(255 53 53 / 80%);
    background-image: url("@/assets/images/notupBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .up {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65px;
    height: 21px;
    font-size: 14px;
    color: rgb(0 202 3 / 80%);
    background-image: url("@/assets/images/upBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}

::v-deep .el-divider {
  border: 0;
  background: linear-gradient(270deg, rgb(72 179 255 / 0%) 0%, rgb(81 183 255 / 80%) 52%, rgb(81 183 255 / 0%) 100%);

  &.el-divider--horizontal {
    margin: 0;
  }

  &.el-divider--vertical {
    margin: 0;
    height: auto;
    background: linear-gradient(rgb(25 117 255 / 0%) 0%, rgb(25 117 255 / 60%) 51%, rgb(25 117 255 / 0%) 100%);
  }
}

.river-water-content {
  display: flex;
  align-items: stretch;
  padding: 12px 18px;
  text-align: center;

  .number {
    font-size: 24px;
    margin-right: 2px;
  }

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

  > div:first-child {
    text-align: left;

    .number {
      font-size: 36px;
    }

    .river-water-label + div {
      justify-content: flex-start;
    }
  }
}

.river-water-label {
  margin-bottom: 4px;

  & + div {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 36px;
  }
}
</style>
