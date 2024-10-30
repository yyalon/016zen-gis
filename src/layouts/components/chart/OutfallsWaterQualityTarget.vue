<script>
import ZFrame from '../ZFrame.vue'

import direct3 from '@/assets/images/direct3.png'

export default {
  name: 'OutfallsWaterQualityTarget',
  components: { ZFrame },
  data() {
    return {
      lists: [
        { type: 'I', num: 10, exceed: 3 },
        { type: 'II', num: 40, exceed: 12 },
        { type: 'III', num: 50, exceed: 15 },
      ],
      direct3,
    }
  },
}
</script>

<template>
  <ZFrame title="受纳水体水质目标统计">
    <div class="outfalls-lists">
      <div
        v-for="(group, index) in lists" :key="index"
        class="outfalls-group"
      >
        <div class="outfalls-title">
          <img :src="direct3">
          <div class="outfalls-type">
            {{ group.type }}类
          </div>
          <div class="outfalls-percent">
            <div class="outfalls-proportion" :style="{ width: `${group.num / lists.reduce((sum, o) => o.num + sum, 0) * 100}%` }" />
            <div class="outfalls-percent-content">
              <span>{{ group.num }}个</span>
              <span style="font-weight: 700;">{{ group.num / lists.reduce((sum, o) => o.num + sum, 0) * 100 }}%</span>
            </div>
          </div>
        </div>
        <div class="outfalls-content">
          <div class="outfalls-item">
            <div class="outfalls-item-label">
              排污口总数
            </div>
            <div class="outfalls-item-value">
              {{ group.num }}
            </div>
          </div>
          <div class="outfalls-item">
            <div class="outfalls-item-label">
              超标数量
            </div>
            <div class="outfalls-item-value">
              {{ group.exceed }}
            </div>
          </div>
          <div class="outfalls-item">
            <div class="outfalls-item-label">
              超标占比
            </div>
            <div class="outfalls-item-value">
              {{ group.exceed / group.num * 100 }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </ZFrame>
</template>

<style lang="scss" scoped>
  .outfalls-lists {
    margin-top: -22px;
  }

  .outfalls-group {
    & + .outfalls-group {
      margin-top: 16px;
    }
  }

  .outfalls-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-bottom: 16px;

    .outfalls-type {
      flex: 1;
      margin-left: 10px;
    }

    .outfalls-percent {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      width: 343px;
      background: rgb(0 167 252 / 20%);
      padding: 11px 10px;

      .outfalls-proportion {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(270deg, #00a7fc 0%, rgb(0 167 252 / 50%) 100%);
      }
    }
  }

  .outfalls-content {
    display: flex;
    align-items: stretch;
  }

  .outfalls-item {
    margin-right: 10px;
    flex: 1;
    height: 63px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    text-align: center;

    &:nth-child(1) {
      background-image: url("@/assets/images/waterBodyBg1.png");
    }

    &:nth-child(2) {
      background-image: url("@/assets/images/waterBodyBg2.png");
    }

    &:nth-child(3) {
      background-image: url("@/assets/images/waterBodyBg3.png");
    }

    &:last-child {
      position: relative;
      margin-right: 0;

      &::before {
        content: "";
        position: absolute;
        top: -1px;
        left: -11px;
        width: 12px;
        background-image: url("/zen-gis/src/assets/images/line.png");
        height: 7px;
        background-color: #061b41;
      }
    }

    .outfalls-item-label {
      width: 74px;
      height: 16px;
      font-size: 12px;
      margin-bottom: 13px;
      margin-top: -8px;
      background: radial-gradient(67% 67% at 50% 50%, rgb(10 204 204 / 52%) 0%, rgb(10 204 204 / 4%) 88%);
      border: 0.5px solid;
      border-image: linear-gradient(270deg, rgb(10 204 204 / 0%) 0%, rgb(10 204 204 / 48%) 52%, rgb(10 204 204 / 0%) 100%) 0.5;
    }

    .outfalls-item-value {
      font-size: 36px;
      font-weight: 700;
      background: linear-gradient(180deg, #ff835a 0%, #ff3c3c 99%);
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    &:first-child {
      .outfalls-item-value {
        background: linear-gradient(180deg, #ffe95a 0%, #ff3c3c 99%);
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
    }
  }

  .outfalls-percent-content {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
