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
            <h3>
              {{ stationDetails.station.name }}[{{
                stationDetails.station.code
              }}]
            </h3>
            <p>
              坐标{{ stationDetails.station.latitude }} ,
              {{ stationDetails.station.longitude }}
            </p>
            <p>下放长度: {{ stationDetails.station.probeDepth }} 米</p>
            <p>
              最新数据上传:
              {{
                stationDetails.latestSensorData.createTime
                  | moment('YYYY-MM-DD HH:mm:ss')
              }}
            </p>
            <p>
              瞬时流向:
              {{ stationDetails.latestSensorData.direction }}，最大:
              {{ stationDetails.maxDirection }}，最小:
              {{ stationDetails.minDirection }}
            </p>
            <p>
              瞬时流速:
              {{ stationDetails.latestSensorData.velocity }}，最大:
              {{ stationDetails.maxVelocity }}，最小:
              {{ stationDetails.minVelocity }}
            </p>
            <p>探头距水面: {{ stationDetails.latestSensorData.depth }} 米</p>
            <p>地下水埋深: {{ stationDetails.station.probeDepth }} 米</p>
            <p>水温: {{ stationDetails.latestSensorData.temperature }} ℃</p>
            <p>水压: {{ stationDetails.latestSensorData.pressure }} 毫巴</p>
            <p>大气压:</p>
            <p>监测参数: {{ stationDetails.station.applications }}</p>
            <p>应急方案: {{ stationDetails.station.contingencyPlans }}</p>
          </div>
        </div>
        <div v-if="!loading" class="chart-polar">
          <velocity-direction-polar-chart :chart-data="polarData" />
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

export default {
  name: 'StationPopup',
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
      },
      polarData: []
    }
  },
  async mounted() {
    if (this.popupData && this.popupData.id) {
      this.loading = true
      this.stationDetails = await getStationDetails(this.popupData.id)
      const { sensorData } = await getStationSensorData(this.popupData.id)

      if (sensorData && sensorData.length > 0) {
        sensorData.forEach(item => {
          let direction = item.direction
          let velocity = item.velocity

          this.scatterData.timeline.push(item.createTime)
          this.scatterData.directions.push(direction)
          this.scatterData.velocities.push(velocity)
          this.polarData.push([velocity, direction])
        })
      } else {
        const ary = new Array(this._.random(100, 2000))
        this._.fill(ary, 'a')
        ary.forEach((_, index) => {
          const r = this._.random(15.2, 50.3)
          const t = this._.random(15.2, 50.2)
          const direction = this._.random(r, r + r)
          const velocity = this._.random(10.2, t)
          this.scatterData.timeline.push(new Date(+new Date() - 5000 * index))
          this.scatterData.directions.push(direction)
          this.scatterData.velocities.push(velocity)
          this.polarData.push([velocity, direction])
        })
      }
      this.loading = false
    }
  },
  beforeDestroy() {},
  methods: {
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
}
.station-info-content-wrapper {
  width: 600px;
  height: 450px;
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
  }
  .chart-scatter {
    width: 100%;
    height: 140px;
  }
}
</style>
