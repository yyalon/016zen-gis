<script>
import ZFrame from '../ZFrame.vue'

import water from '@/assets/images/water.png'

export default {
  components: { ZFrame },
  data() {
    return {
      water,
    }
  },
}
</script>

<template>
  <ZFrame title="水质现状统计分析">
    <div class="river-water-wrapper">
      <div class="river-water-title">
        <div>时间</div>
        <div>9月</div>
        <div>1-9月</div>
      </div>
      <div class="river-water-item">
        <div>东海区域</div>
        <div>
          <div class="river-water-type-item">
            <span>I-III类</span>
            <span>77.3%</span>
            <span style="color: #0bffa2;">+8个</span>
          </div>
          <div class="river-water-type-item">
            <span>劣V类</span>
            <span>0.3%</span>
            <span style="color: #f90;">-8个</span>
          </div>
        </div>
        <div>
          <div class="river-water-type-item">
            <span>I-III类</span>
            <span>77.3%</span>
            <span style="color: #0bffa2;">+8个</span>
          </div>
          <div class="river-water-type-item">
            <span>劣V类</span>
            <span>0.3%</span>
            <span style="color: #f90;">-8个</span>
          </div>
        </div>
      </div>
      <div class="river-water-item">
        <div>攻坚战区域</div>
        <div>
          <div class="river-water-type-item">
            <span>I-III类</span>
            <span>77.3%</span>
            <span style="color: #0bffa2;">+8个</span>
          </div>
          <div class="river-water-type-item">
            <span>劣V类</span>
            <span>0.3%</span>
            <span style="color: #f90;">-8个</span>
          </div>
        </div>
        <div>
          <div class="river-water-type-item">
            <span>I-III类</span>
            <span>77.3%</span>
            <span style="color: #0bffa2;">+8个</span>
          </div>
          <div class="river-water-type-item">
            <span>劣V类</span>
            <span>0.3%</span>
            <span style="color: #f90;">-8个</span>
          </div>
        </div>
      </div>
    </div>
  </ZFrame>
</template>

<style lang="scss" scoped>
  .river-water-wrapper {
    width: 391px;
    margin: 22px auto 0;
  }

  .river-water-title,
  .river-water-item {
    display: flex;

    > div {
      height: 100%;
      vertical-align: middle;
      padding: 0 8px;

      &:not(:first-child) {
        flex: 1;
        border-left: 1px solid rgb(116 202 255 / 18%);
      }
    }

    > div:nth-child(1) {
      width: 88px;
      text-align: center;
    }
  }

  .river-water-title {
    height: 44px;
    color: #00ebff;
    padding: 12px 0;
    text-align: center;
    background: radial-gradient(30% 17% at 50% 0%, rgb(135 225 255 / 30%) 0%, rgb(135 225 255 / 0%) 100%), linear-gradient(180deg, rgb(39 135 213 / 30%) 0%, rgb(39 135 213 / 0%) 100%);
    border: 1px solid;
    border-image: linear-gradient(180deg, #2787d5 0%, rgb(39 135 213 / 0%) 85%) 1;
  }

  .river-water-item {
    margin-top: 26px;
    height: 95px;
    padding: 8px 0;
    background: linear-gradient(270deg, rgb(0 94 255 / 0%) 0%, rgb(39 135 213 / 20%) 25%, rgb(39 135 213 / 20%) 75%, rgb(39 135 213 / 0%) 100%);

    > div {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
    }
  }

  .river-water-type-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & + .river-water-type-item {
      margin-top: 14px;
    }
  }
</style>
