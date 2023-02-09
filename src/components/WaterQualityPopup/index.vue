<template>
  <div
    v-loading="loading"
    class="station-info"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <box slot="content"
      ><div class="top">
        <div class="left"></div>
        <div class="actions">
          <div class="action close" @click="handleClickClose" />
        </div>
      </div>
      <div class="station-info-content-wrapper">
        <div v-if="!loading" class="base-info">
          <div v-if="waterQualityStation">
            <h3>编号：{{ popupData.code }}</h3>
            <p>
              坐标：
              <span class="value font-digital">
                {{ waterQualityStation.longitude }} ,
                {{ waterQualityStation.latitude }}
              </span>
            </p>
            <p>
              责任地：
              <span class="value font-digital">
                {{ waterQualityStation.province }}</span
              >

              <span class="value font-digital">{{
                waterQualityStation.city
              }}</span>
            </p>
            <chart-line-sea-water-quality> </chart-line-sea-water-quality>
          </div>
        </div>
        <div v-if="!loading && waterQualityStation" class="chart-polar">
          <el-image
            :src="waterQualityStation.image"
            :preview-src-list="[waterQualityStation.image]"
            :z-index="3000"
          >
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div> </el-image
          ><br />
          <el-button type="primary" size="medium" @click="toStationAdmin()"
            >站点管理</el-button
          >
        </div>
        <div v-if="!loading" class="chart-scatter">
          <chart-t-n-years> </chart-t-n-years>
        </div>
      </div>
    </box>
  </div>
</template>
<script>
ChartTNYears
import Box from '@/layout/components/box'
import ChartLineSeaWaterQuality from './ChartLineSeaWaterQuality'
import ChartTNYears from './ChartTNYears'

const _random = (min, max) => {
  const length = _.random(1, 4, true)
  return _.round(_.random(min / 0.999, max / 0.999), length)
}

export default {
  name: 'RiverSectionPopup',
  components: {
    Box,
    ChartLineSeaWaterQuality,
    ChartTNYears
  },
  props: {
    popupData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      waterQualityStation: {}
    }
  },
  async mounted() {
    this.waterQualityStation = this.popupData
    this.waterQualityStation.image = `img/station${parseInt(_random(1, 3))}.png`
  },
  beforeDestroy() {},
  methods: {
    toStationAdmin() {
      this.$router.push('/station/index')
    },
    handleClickClose() {
      this.$emit('closePopup')
    }
  }
}
</script>

<style lang="scss" scoped>
.station-info {
  overflow: hidden;
  .z-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    .top {
      height: 24px;
      background: linear-gradient(90deg, #00609c 0%, #001f44 95%);
      .left {
        width: 50px;
        height: 100%;
        background: url('../../assets/img/top_left.png') no-repeat;
        background-size: 100%;
        border-top-left-radius: 2px;
      }
      .actions {
        position: absolute;
        right: 5px;
        top: 4px;
        display: flex;
        height: 20px;
        .action {
          width: 20px;
          height: 20px;
          background-size: cover;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
          &.hide {
            background: url('../../assets/img/left_hide.png') no-repeat;
          }
          &.close {
            background: url('../../assets/img/close.png') no-repeat;
          }
          &.fullscreen {
            background: url('../../assets/img/fullscreen.png') no-repeat;
          }
          &.exit-fullscreen {
            background: url('../../assets/img/exit_fullscreen.png') no-repeat;
          }
        }
      }
    }
  }
  &::after {
    content: '';
    position: absolute;
    left: 47.4%;
    width: 0px;
    height: 0px;
    border-top: 10px solid #0695e3;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }
}
.station-info-content-wrapper {
  width: 600px;
  height: 480px;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  background: #001a3e;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .base-info {
    padding: 10px;
    color: white;
    width: 300px;
    overflow: auto;
  }
  .chart-polar {
    width: 300px;
    height: 300px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
  .chart-scatter {
    width: 100%;
    height: 140px;
  }
  .value {
    font-size: 14px;
    color: #ffc162;
  }
  .el-image__error {
    background: none;
    color: #0faafb;
  }
}
</style>
