<script>
import ZFrame from '../ZFrame.vue'
import gisData from '@/api/modules/gis'
import water from '@/assets/images/water.png'
import eventBus from '@/utils/eventBus'

export default {
  components: { ZFrame },
  data() {
    return {
      loading: false,
      water,
      data: [],
      activeIndex: 0, // 当前激活的轮播项索引
      autoPlayInterval: null, // 自动播播的定时器
    }
  },
  created() {
    // this.getData()
  },
  async mounted() {
    eventBus.on('refreshSeaWaterQualityChart', (param) => {
      this.param = param
      console.log('refreshSeaWaterQualityChart',param)
      this.getData(param)
    })
  },
  beforeUnmount() {
    eventBus.off('refreshSeaWaterQualityChart')
    this.stopAutoPlay() // 组件销毁前停止自动轮播
  },
  methods: {
    getData(param) {
      this.loading = true
      gisData.getSeaWaterQualityCompliance(param).then(({ data }) => {
        this.loading = false
        this.data = data.map((item) => {
          return {
            province: item.province,
            compliance: item.seaWaterComplianceResult.isCompliance ? '已达标' : '未达标',
            percent: item.seaWaterComplianceResult.currentSeasonComplianceRate,
            diff: item.seaWaterComplianceResult.lastYearDifference,
            complianceTargetRate: item.seaWaterComplianceResult.targetComplianceRate,
          }
        })

        if (this.data.length > 2) {
          this.startAutoPlay()
        }
      })
    },
    next() {
      this.activeIndex = this.activeIndex + 2
      if (this.activeIndex > this.data.length) {
        this.activeIndex = 0
      }
    },
    startAutoPlay() {
      if (this.autoPlayInterval) {
        // empty
      }
      else {
        this.autoPlayInterval = setInterval(this.next, 3000) // 每3秒自动播放下一张
      }
    },
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval)
        this.autoPlayInterval = null
      }
    },
  },
}
</script>

<template>
  <ZFrame title="近岸海域水质达标考核">
    <div class="sea-water">
      <div v-for="(item, index) in data" :key="item.province" :class="(activeIndex === index || (activeIndex + 1) === index) ? 'active' : ''" class="river-water-wrapper">
        <div class="river-water-title">
          <img :src="water"><span style="margin: 0 4px;">{{ item.province }}：水质优良 (一、二类)比例</span><span :class="item.compliance === '未达标' ? 'notup' : 'up'">{{ item.compliance }}</span>
        </div>
        <el-divider />
        <div class="river-water-content">
          <div style="width: 50%;">
            <div class="river-water-label">
              现状
            </div>
            <div>
              <span class="number">{{ item.percent }}</span>%<span class="status" :class="item.diff >= 0 ? 'succes' : 'error'">{{ item.diff }}%</span>
            </div>
          </div>
          <el-divider direction="vertical" />
          <div style="width: 25%;" />
          <div style="width: 25%;">
            <div class="river-water-label">
              2025年
            </div>
            <div>
              <span class="number" style="color: #cd303b;">{{ item.complianceTargetRate }}</span>%
            </div>
          </div>
        </div>
      </div>
      <div v-if="data.length === 0">
        暂无数据
      </div>
    </div>
  </ZFrame>
</template>

<style lang="scss" scoped>
.sea-water {
  margin-top: 24px;
  height: 323px;
  overflow: hidden;
  position: relative;
}

.river-water-wrapper {
  position: absolute;
  top: 0;
  left: 21px;
  opacity: 0;
  width: 400px;
  background-image: url("@/assets/images/waterQualityBg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transition: opacity 1s ease-in-out;

  &:nth-child(2) {
    top: 171px;
  }

  &.active {
    opacity: 1;
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
