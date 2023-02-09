<template>
  <div class="toolbar">
    <div class="button home " @click="flyHome()">
      <i class="el-icon-s-home"></i>
    </div>
    <div class="button zoom-in" @click="zoomIn()">
      <i class="el-icon-plus"></i>
    </div>
    <div class="button zoom-out" @click="zoomOut()">
      <i class="el-icon-minus"></i>
    </div>
    <div class="button-grounp">
      <div
        @click="toggleVisible('all')"
        class="button all"
        :class="visibility.all ? 'active' : ''"
      >
        <svg-icon v-if="visibility.all" class="icon" icon-class="eye-open" />
        <svg-icon v-else class="icon" icon-class="eye" />
        <div class="name">全部</div>
      </div>
      <div
        @click="toggleVisible('waterQualityMonitoringSection')"
        class="button water-quality-monitoring-section"
        :class="visibility.waterQualityMonitoringSection ? 'active' : ''"
      >
        <svg-icon class="icon" icon-class="section" />
        <div class="name">入海河流</div>
      </div>
      <div
        @click="toggleVisible('outfallArea')"
        class="button  outfall-area"
        :class="visibility.outfallArea ? 'active' : ''"
      >
        <svg-icon class="icon" icon-class="outfall" />
        <div class="name">海洋倾倒区</div>
      </div>
      <!--<div
        @click="toggleVisible('waterQualityStation')"
        class="button water-quality-station"
        :class="visibility.waterQualityStation ? 'active' : ''"
      >
        <svg-icon class="icon" icon-class="water" />
        <div class="name">水质监测点位</div>
      </div>
      <div
        @click="toggleVisible('waterQualityMonitoringSection')"
        class="button water-quality-monitoring-section"
        :class="visibility.waterQualityMonitoringSection ? 'active' : ''"
      >
        <svg-icon class="icon" icon-class="section" />
        <div class="name">入海河流水质监测断面</div>
      </div>
      <div
        @click="toggleVisible('fishingWaterQualityStation')"
        class="button fishing-water-quality-station"
        :class="visibility.fishingWaterQualityStation ? 'active' : ''"
      >
        <svg-icon class="icon" icon-class="fish" />
        <div class="name">渔业水质监测点位</div>
      </div>
      <div
        @click="toggleVisible('redTideCenter')"
        class="button red-tide-center"
        :class="visibility.redTideCenter ? 'active' : ''"
      >
        <svg-icon class="icon" icon-class="tide" />
        <div class="name">赤潮中心</div>
      </div>
      <div
        @click="toggleVisible('wasteMonitoringStation')"
        class="button waste-monitoring-station"
        :class="visibility.wasteMonitoringStation ? 'active' : ''"
      >
        <svg-icon class="icon" icon-class="waste" />
        <div class="name">海洋垃圾微塑料监测点位</div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {},
  data() {
    return {
      visibility: {
        all: true,
        outfallArea: true,
        waterQualityStation: true,
        wasteMonitoringStation: true,
        redTideCenter: true,
        fishingWaterQualityStation: true,
        waterQualityMonitoringSection: true
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    toggleVisible(type) {
      if (type === 'all') {
        this.visibility.all = !this.visibility.all
        for (const key in this.visibility) {
          if (key !== 'all' && this.visibility[key] === !this.visibility.all) {
            this.visibility[key] = !this.visibility[key]
            this.$emit('toggle-visible', key)
          }
        }
      } else {
        this.visibility[type] = !this.visibility[type]
        this.$emit('toggle-visible', type)
        let allVisible = true
        for (const key in this.visibility) {
          if (key !== 'all') {
            if (!this.visibility[key]) {
              allVisible = false
            }
          }
        }
        if (allVisible) {
          this.visibility.all = true
        }

        let allInvisible = true
        for (const key in this.visibility) {
          if (key !== 'all') {
            if (this.visibility[key]) {
              allInvisible = false
            }
          }
        }
        if (allInvisible) {
          this.visibility.all = false
        }
      }
    },
    zoomIn() {
      this.$zMap.zoomIn()
    },
    zoomOut() {
      this.$zMap.zoomOut()
    },
    flyHome() {
      this.$zMap.flyHome()
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  width: 25px;
  bottom: 13px;
  left: 5px;
  position: absolute;
  user-select: none;
  .button-grounp {
    position: relative;
    width: 25px;
    background-color: #001a3e;
    margin-top: 14px;
    &::before {
      left: 0;
      width: 25px;
      background-color: #001a3e;
      border-radius: 14px;
      position: absolute;
      top: -10px;
      bottom: -10px;
      right: 0;
      content: '';
    }
  }
  .button {
    position: relative;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    color: white;
    background-color: #001a3e;
    margin-bottom: 3px;
    cursor: pointer;
    &:active {
      transform: translateY(2px);
      &::after {
        top: 2px;
      }
    }
    &:hover {
      background-color: #22a9f199;
    }
    .name {
      font-size: 12px;
      position: absolute;
      left: 25px;
      top: 0;
      height: 25px;
      transition: background-color 0.3s;
      text-shadow: 0px 0px 4px black;
      line-height: 25px;
      border-radius: 1.2em;
      text-align: left;
      padding-left: 5px;
      width: max-content;
      padding: 0 10px;
      &:hover {
        background-color: #22a9f199;
      }
    }
    &.all {
      &.active {
        background-color: #0faafb;
        .name {
          &:hover {
            background-color: #0faafb;
          }
        }
      }
    }
    &.outfall-area,
    &.water-quality-station,
    &.fishing-water-quality-station,
    &.waste-monitoring-station,
    &.water-quality-monitoring-section {
      &.active {
        background-color: #e6dfdf;
        .icon {
          color: #979797;
        }
        .name {
          &:hover {
            background-color: #e6dfdf;
          }
        }
      }
    }
    &.red-tide-center {
      &.active {
        background-color: #d3160a;
        .name {
          &:hover {
            background-color: #d3160a;
          }
        }
      }
    }
  }
}
</style>
