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
          <div v-if="riverSection">
            <h3>{{ popupData.name }}</h3>
            <p>
              坐标：
              <span class="value font-digital">
                {{ riverSection.longitude }} , {{ riverSection.latitude }}
              </span>
            </p>
            <p>
              流域水体：
              <span class="value font-digital">
                {{ riverSection.river || ''
                }}{{ riverSection.system || '' }}</span
              >
            </p>
            <p v-if="riverSection.from">
              断面来源：
              <span class="value font-digital"> {{ riverSection.from }}</span>
              ，断面属性：
              <span class="value font-digital">
                {{ riverSection.attribute }}</span
              >
            </p>
            <p>
              责任地：
              <span class="value font-digital">
                {{ riverSection.province || '' }}</span
              >

              <span class="value font-digital">{{
                riverSection.city || ''
              }}</span>

              <span class="value font-digital">
                {{ riverSection.county || '' }}</span
              >
            </p>
            <p>
              水质类别目标：
              <span class="value font-digital">{{
                levels[_.random(0, 2)]
              }}</span>
            </p>
            <p>
              总氮浓度目标：
              <span class="value font-digital">
                {{ _.round(_.random(2.5, 3.5), 1) }} mg/L</span
              >
            </p>
            <chart-water-quality> </chart-water-quality>
          </div>
        </div>
        <div v-if="!loading && riverSection" class="chart-polar">
          <el-image
            :src="riverSection.image"
            :preview-src-list="[riverSection.image]"
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
import Box from '@/layout/components/box'
import ChartWaterQuality from './ChartWaterQuality'
import ChartTNYears from './ChartTNYears'
import { getRiverSection } from '@/api/data'
import { getStationSensorData } from '@/api/system'

const _random = (min, max) => {
  const length = _.random(1, 4, true)
  return _.round(_.random(min / 0.999, max / 0.999), length)
}

export default {
  name: 'WaterQualityPopup',
  components: {
    Box,
    ChartWaterQuality,
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
      levels: ['一类', '二类', '三类'],
      loading: false,
      riverSection: {},
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
      this.riverSection = await getRiverSection({ id: this.popupData.id })

      this.riverSection.image = `img/station${parseInt(_random(1, 3))}.png`

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
    font-size: 14px;
    color: #ffc162;
  }
  .el-image__error {
    background: none;
    color: #0faafb;
  }
}
</style>
