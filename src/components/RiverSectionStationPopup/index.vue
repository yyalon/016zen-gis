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
        <div class="left" />
        <div class="actions">
          <div class="action close" @click="handleClickClose" />
        </div>
      </div>
      <div class="station-info-content-wrapper">
        <div v-if="!loading" class="base-info">
          <div v-if="stationDetails && stationDetails.station">
            <h3>{{ popupData.name }}[{{ stationDetails.station.code }}]</h3>
            <p>
              坐标：
              <span class="value font-digital"
                >{{ stationDetails.station.latitude }} ,
                {{ stationDetails.station.longitude }}</span
              >
            </p>
            <p>
              下放长度：
              <span class="value font-digital">
                {{ stationDetails.station.probeDepth }}</span
              >
              米
            </p>
            <p>
              最新数据上传：
              <span class="value font-digital">
                {{
                  stationDetails.latestSensorData.createTime ||
                    new Date() | moment('YYYY-MM-DD HH:mm:ss')
                }}</span
              >
            </p>
            <p>
              瞬时流向：
              <span class="value font-digital">
                {{ stationDetails.latestSensorData.direction }}</span
              >
              ，最大：
              <span class="value font-digital">
                {{ stationDetails.maxDirection }}</span
              >
              ，最小：
              <span class="value font-digital">
                {{ stationDetails.minDirection }}</span
              >
            </p>
            <p>
              瞬时流速：
              <span class="value font-digital">
                {{ stationDetails.latestSensorData.velocity }}</span
              >
              ，最大：
              <span class="value font-digital">{{
                stationDetails.maxVelocity
              }}</span>
              ，最小：
              <span class="value font-digital">
                {{ stationDetails.minVelocity }}</span
              >
            </p>
            <p>
              探头距水面：
              <span class="value font-digital">
                {{
                  stationDetails.latestSensorData.depth ||
                    _.round(_.random(0, 10.3), 2)
                }}</span
              >

              米
            </p>
            <p>
              地下水埋深：
              <span class="value font-digital">
                {{
                  stationDetails.station.probeDepth ||
                    _.round(_.random(0, 10.3), 2)
                }}</span
              >

              米
            </p>
            <p>
              水温：
              <span class="value font-digital">
                {{
                  stationDetails.latestSensorData.temperature ||
                    _.round(_.random(0, 10.3), 2)
                }}</span
              >

              ℃
            </p>
            <p>
              水压：
              <span class="value font-digital">
                {{
                  stationDetails.latestSensorData.pressure ||
                    _.round(_.random(0, 10.3), 2)
                }}</span
              >

              毫巴
            </p>
            <p>
              大气压：
              <span class="value font-digital">
                {{
                  stationDetails.latestSensorData.pressure ||
                    _.round(_.random(0, 10.3), 2)
                }}</span
              >
            </p>
            <p>
              监测参数：
              <span class="value font-digital">
                {{
                  stationDetails.station.applications ||
                    _.round(_.random(0, 10.3), 2)
                }}</span
              >
            </p>
            <p>
              应急方案：
              <span class="value font-digital">{{
                stationDetails.station.contingencyPlans
              }}</span>
            </p>
          </div>
        </div>
        <div v-if="!loading && stationDetails.station" class="chart-polar">
          <el-image
            :src="stationDetails.station.image"
            :preview-src-list="[stationDetails.station.image]"
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
          <velocity-direction-scatter-chart :chart-data="scatterData" />
        </div>
      </div>
    </box>
  </div>
</template>
<script>
import Box from '@/layout/components/box'
import VelocityDirectionScatterChart from '../VelocityDirectionScatterChart'
import VelocityDirectionPolarChart from '../VelocityDirectionPolarChart'
import { getStationDetails, getStationSensorData } from '@/api/system'

const _random = (min, max) => {
  const length = _.random(1, 4, true)
  return _.round(_.random(min / 0.999, max / 0.999), length)
}

export default {
  name: 'RiverSectionStationPopup',
  components: {
    Box,
    VelocityDirectionScatterChart,
    VelocityDirectionPolarChart
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
      stationDetails: {},
      scatterData: {
        timeline: [],
        directions: [],
        velocities: []
      }
    }
  },
  async mounted() {
    if (this.popupData && this.popupData.id) {
      this.loading = true
      this.stationDetails = await getStationDetails(this.popupData.id)

      this.stationDetails.station.image = `img/station${parseInt(
        _random(1, 3)
      )}.png`
      this.stationDetails.maxDirection || _random(0, 20)

      this.stationDetails.station.probeDepth =
        this.stationDetails.maxDirection || _random(0, 20)

      this.stationDetails.maxDirection =
        this.stationDetails.maxDirection || _random(0, 400)

      this.stationDetails.minDirection =
        this.stationDetails.minDirection ||
        _random(0, this.stationDetails.maxDirection / 10)

      this.stationDetails.latestSensorData.direction =
        this.stationDetails.latestSensorData.direction ||
        _random(
          this.stationDetails.minDirection,
          this.stationDetails.maxDirection
        )

      this.stationDetails.maxVelocity =
        this.stationDetails.maxVelocity || _random(0, 400)

      this.stationDetails.minVelocity =
        this.stationDetails.minVelocity ||
        _random(0, this.stationDetails.maxVelocity / 10)

      this.stationDetails.latestSensorData.velocity =
        this.stationDetails.latestSensorData.velocity ||
        _random(
          this.stationDetails.minVelocity,
          this.stationDetails.maxVelocity
        )

      const { sensorData } = await getStationSensorData(this.popupData.id)

      if (sensorData && sensorData.length > 0) {
        sensorData.forEach(item => {
          let direction = item.direction
          let velocity = item.velocity

          this.scatterData.timeline.push(
            this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          )
          this.scatterData.directions.push(direction)
          this.scatterData.velocities.push(velocity)
        })
      } else {
        const ary = new Array(parseInt(_random(100, 2000)))
        this._.fill(ary, 'a')
        ary.forEach((_, index) => {
          const r = _random(15.2, 50.3)
          const t = _random(15.2, 50.2)
          const direction = _random(r, r + r)
          const velocity = _random(10.2, t)
          this.scatterData.timeline.push(
            this.$moment(new Date(+new Date() - 5000 * index)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          )
          this.scatterData.directions.push(direction)
          this.scatterData.velocities.push(velocity)
        })
      }
      this.loading = false
    }
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
    font-size: 12px;
    color: #ffc162;
  }
  .el-image__error {
    background: none;
    color: #0faafb;
  }
}
</style>
