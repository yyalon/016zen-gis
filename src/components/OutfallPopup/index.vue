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
          <div v-if="outfall">
            <h3>{{ popupData.name }} [{{ outfall.code }}]</h3>
            <p>
              坐标：
              <span class="value font-digital">
                {{ outfall.longitude }} , {{ outfall.latitude }}
              </span>
            </p>
            <p>
              责任地：
              <span class="value font-digital">
                {{ outfall.city }}{{ outfall.county }}</span
              >
            </p>
            <p>
              地址：
              <span class="value font-digital">
                {{ outfall.address }}
              </span>
            </p>
            <p>
              所属海域：
              <span class="value font-digital">
                {{ outfall.sea }}
              </span>
            </p>
            <p>
              排口类型：
              <span class="value font-digital"> {{ outfall.type }}</span>
            </p>
            <p>
              污水排放方式
              <span class="value font-digital"> {{ outfall.frequency }}</span>
            </p>
            <p>
              整治阶段
              <span class="value font-digital"> {{ outfall.frequency }}</span>
            </p>
          </div>
        </div>
        <div class="chart-polar">
          <div id="videoElem"></div>
        </div>
      </div>
    </box>
  </div>
</template>
<script>
import Box from '@/layout/components/box'
import { getSewageOutfallInfo } from '@/api/data'
import Player from 'xgplayer'

const _random = (min, max) => {
  const length = _.random(1, 4, true)
  return _.round(_.random(min / 0.999, max / 0.999), length)
}

export default {
  name: 'OutfallPopup',
  components: {
    Box
  },
  props: {
    popupData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      player: null,
      levels: ['一类', '二类', '三类'],
      loading: false,
      outfall: {},
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
      this.outfall = await getSewageOutfallInfo({ id: this.popupData.id })
      this.$nextTick(() => {
        setTimeout(() => {
          const url = `${window.config.videoUrl}${_.random(1, 3)}.mp4`
          this.playVideo(url)
        }, 1000)
      })
      this.loading = false
    }
  },
  beforeDestroy() {},
  methods: {
    destoryVideo(player) {
      if (player) {
        player.destroy && player.destroy()
        player = null
      }
    },
    playVideo(url) {
      const config = {
        id: 'videoElem',
        width: 300,
        height: 300,
        url,
        autoplay: true,
        loop: true
      }
      this.player = new Player(config)
    },
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
.chart-polar {
  background-image: url('../../assets/img/video_bg.png');
}
.station-info-content-wrapper {
  width: 600px;
  height: 300px;
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
  #videoElem {
    width: 100%;
    height: 100%;
    video {
      width: 100%;
      height: 100%;
      background-image: url('../../assets/img/video_bg.png');
      background-repeat: no-repeat;
      background-size: 30%;
      background-position: 50% 50%;
      object-fit: fill;
    }
  }
}
</style>
