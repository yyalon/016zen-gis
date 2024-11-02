<script>
import ZFrame from '../ZFrame.vue'

import water from '@/assets/images/water.png'
import gisData from '@/api/modules/gis'
import eventBus from '@/utils/eventBus'

export default {
  components: { ZFrame },
  data() {
    return {
      water,
      loading: false,
      data: {},
      param: {},
      waterQualityDimension: '水质',
    }
  },
  mounted() {
    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })

    eventBus.on('waterQualityDimension', (param) => {
      if (param && param.waterQualityDimension) {
        this.waterQualityDimension = param.waterQualityDimension
      }
    })
  },
  beforeUnmount() {
    // eventBus.off('filterparam')
  },
  methods: {
    getData(param) {
      this.loading = true
      gisData.getWaterYoyProportion(param).then((res) => {
        this.loading = false
        this.data = res.data
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="水质现状统计分析">
    <div v-if="waterQualityDimension === '总氮'" class="river-water-wrapper">
      <div class="river-water-title">
        <div>时间</div>
        <div>{{ data?.seaYoyProportion?.header?.[0] || data?.battleYoyProportion?.header?.[0] }}</div>
        <div>{{ data?.seaYoyProportion?.header?.[1] || data?.battleYoyProportion?.header?.[1] }}</div>
      </div>
      <div class="river-water-item">
        <div>东海区域</div>
        <div>
          <div class="river-water-type-item">
            <span>达标</span>
            <span>{{ data?.seaYoyProportion?.data?.good?.[0]?.currrentTnMon }}%</span>
            <span :style="`color: ${data?.seaYoyProportion?.data?.good?.[0]?.yoyTnRate >= 0 ? '#0bffa2' : '#f90'}`">{{ data?.seaYoyProportion?.data?.good?.[0]?.yoyTnRate >= 0 ? `+${data?.seaYoyProportion?.data?.good?.[0]?.yoyTnRate}` : data?.seaYoyProportion?.data?.good?.[0]?.yoyTnRate }}%</span>
          </div>
          <div class="river-water-type-item">
            <span>不达标</span>
            <span>{{ data?.seaYoyProportion?.data?.poor?.[0]?.currrentTnMon }}%</span>
            <span :style="`color: ${data?.seaYoyProportion?.data?.poor?.[0]?.yoyTnRate <= 0 ? '#0bffa2' : '#f90'}`">{{ data?.seaYoyProportion?.data?.poor?.[0]?.yoyTnRate >= 0 ? `+${data?.seaYoyProportion?.data?.poor?.[0]?.yoyTnRate}` : data?.seaYoyProportion?.data?.poor?.[0]?.yoyTnRate }}%</span>
          </div>
        </div>
        <div>
          <div class="river-water-type-item">
            <span>达标</span>
            <span>{{ data?.seaYoyProportion?.data?.good?.[1]?.currrentTnMon }}%</span>
            <span :style="`color: ${data?.seaYoyProportion?.data?.good?.[1]?.yoyTnRate >= 0 ? '#0bffa2' : '#f90'}`">{{ data?.seaYoyProportion?.data?.good?.[1]?.yoyTnRate >= 0 ? `+${data?.seaYoyProportion?.data?.good?.[1]?.yoyTnRate}` : data?.seaYoyProportion?.data?.good?.[1]?.yoyTnRate }}%</span>
          </div>
          <div class="river-water-type-item">
            <span>不达标</span>
            <span>{{ data?.seaYoyProportion?.data?.poor?.[1]?.currrentTnMon }}%</span>
            <span :style="`color: ${data?.seaYoyProportion?.data?.poor?.[1]?.yoyTnRate <= 0 ? '#0bffa2' : '#f90'}`">{{ data?.seaYoyProportion?.data?.poor?.[1]?.yoyTnRate >= 0 ? `+${data?.seaYoyProportion?.data?.poor?.[1]?.yoyTnRate}` : data?.seaYoyProportion?.data?.poor?.[1]?.yoyTnRate }}%</span>
          </div>
        </div>
      </div>
      <div class="river-water-item">
        <div>攻坚战区域</div>
        <div>
          <div class="river-water-type-item">
            <span>达标</span>
            <span>{{ data?.battleYoyProportion?.data?.good?.[0]?.currrentTnMon }}%</span>
            <span :style="`color: ${data?.battleYoyProportion?.data?.good?.[0]?.yoyTnRate >= 0 ? '#0bffa2' : '#f90'}`">{{ data?.battleYoyProportion?.data?.good?.[0]?.yoyTnRate >= 0 ? `+${data?.battleYoyProportion?.data?.good?.[0]?.yoyTnRate}` : data?.battleYoyProportion?.data?.good?.[0]?.yoyTnRate }}%</span>
          </div>
          <div class="river-water-type-item">
            <span>不达标</span>
            <span>{{ data?.battleYoyProportion?.data?.poor?.[0]?.currrentTnMon }}%</span>
            <span :style="`color: ${data?.battleYoyProportion?.data?.poor?.[0]?.yoyTnRate <= 0 ? '#0bffa2' : '#f90'}`">{{ data?.battleYoyProportion?.data?.poor?.[0]?.yoyTnRate >= 0 ? `+${data?.battleYoyProportion?.data?.poor?.[0]?.yoyTnRate}` : data?.battleYoyProportion?.data?.poor?.[0]?.yoyTnRate }}%</span>
          </div>
        </div>
        <div>
          <div class="river-water-type-item">
            <span>达标</span>
            <span>{{ data?.battleYoyProportion?.data?.good?.[1]?.currrentTnMon }}%</span>
            <span :style="`color: ${data?.battleYoyProportion?.data?.good?.[1]?.yoyTnRate >= 0 ? '#0bffa2' : '#f90'}`">{{ data?.battleYoyProportion?.data?.good?.[1]?.yoyTnRate >= 0 ? `+${data?.battleYoyProportion?.data?.good?.[1]?.yoyTnRate}` : data?.battleYoyProportion?.data?.good?.[1]?.yoyTnRate }}%</span>
          </div>
          <div class="river-water-type-item">
            <span>不达标</span>
            <span>{{ data?.battleYoyProportion?.data?.poor?.[1]?.currrentTnMon }}%</span>
            <span :style="`color: ${data?.battleYoyProportion?.data?.poor?.[1]?.yoyTnRate <= 0 ? '#0bffa2' : '#f90'}`">{{ data?.battleYoyProportion?.data?.poor?.[1]?.yoyTnRate >= 0 ? `+${data?.battleYoyProportion?.data?.poor?.[1]?.yoyTnRate}` : data?.battleYoyProportion?.data?.poor?.[1]?.yoyTnRate }}%</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="river-water-wrapper">
      <div class="river-water-title">
        <div>时间</div>
        <div>{{ data?.seaYoyProportion?.header?.[0] || data?.battleYoyProportion?.header?.[0] }}</div>
        <div>{{ data?.seaYoyProportion?.header?.[1] || data?.battleYoyProportion?.header?.[1] }}</div>
      </div>
      <div class="river-water-item">
        <div>东海区域</div>
        <div>
          <div class="river-water-type-item">
            <span>I-III类</span>
            <span>{{ data?.seaYoyProportion?.data?.good?.[0]?.currrentMon }}%</span>
            <span :style="`color: ${data?.seaYoyProportion?.data?.good?.[0]?.yoyRate >= 0 ? '#0bffa2' : '#f90'}`">{{ data?.seaYoyProportion?.data?.good?.[0]?.yoyRate >= 0 ? `+${data?.seaYoyProportion?.data?.good?.[0]?.yoyRate}` : data?.seaYoyProportion?.data?.good?.[0]?.yoyRate }}%</span>
          </div>
          <div class="river-water-type-item">
            <span>劣V类</span>
            <span>{{ data?.seaYoyProportion?.data?.poor?.[0]?.currrentMon }}%</span>
            <span :style="`color: ${data?.seaYoyProportion?.data?.poor?.[0]?.yoyRate <= 0 ? '#0bffa2' : '#f90'}`">{{ data?.seaYoyProportion?.data?.poor?.[0]?.yoyRate >= 0 ? `+${data?.seaYoyProportion?.data?.poor?.[0]?.yoyRate}` : data?.seaYoyProportion?.data?.poor?.[0]?.yoyRate }}%</span>
          </div>
        </div>
        <div>
          <div class="river-water-type-item">
            <span>I-III类</span>
            <span>{{ data?.seaYoyProportion?.data?.good?.[1]?.currrentMon }}%</span>
            <span :style="`color: ${data?.seaYoyProportion?.data?.good?.[1]?.yoyRate >= 0 ? '#0bffa2' : '#f90'}`">{{ data?.seaYoyProportion?.data?.good?.[1]?.yoyRate >= 0 ? `+${data?.seaYoyProportion?.data?.good?.[1]?.yoyRate}` : data?.seaYoyProportion?.data?.good?.[1]?.yoyRate }}%</span>
          </div>
          <div class="river-water-type-item">
            <span>劣V类</span>
            <span>{{ data?.seaYoyProportion?.data?.poor?.[1]?.currrentMon }}%</span>
            <span :style="`color: ${data?.seaYoyProportion?.data?.poor?.[1]?.yoyRate <= 0 ? '#0bffa2' : '#f90'}`">{{ data?.seaYoyProportion?.data?.poor?.[1]?.yoyRate >= 0 ? `+${data?.seaYoyProportion?.data?.poor?.[1]?.yoyRate}` : data?.seaYoyProportion?.data?.poor?.[1]?.yoyRate }}%</span>
          </div>
        </div>
      </div>
      <div class="river-water-item">
        <div>攻坚战区域</div>
        <div>
          <div class="river-water-type-item">
            <span>I-III类</span>
            <span>{{ data?.battleYoyProportion?.data?.good?.[0]?.currrentMon }}%</span>
            <span :style="`color: ${data?.battleYoyProportion?.data?.good?.[0]?.yoyRate >= 0 ? '#0bffa2' : '#f90'}`">{{ data?.battleYoyProportion?.data?.good?.[0]?.yoyRate >= 0 ? `+${data?.battleYoyProportion?.data?.good?.[0]?.yoyRate}` : data?.battleYoyProportion?.data?.good?.[0]?.yoyRate }}%</span>
          </div>
          <div class="river-water-type-item">
            <span>劣V类</span>
            <span>{{ data?.battleYoyProportion?.data?.poor?.[0]?.currrentMon }}%</span>
            <span :style="`color: ${data?.battleYoyProportion?.data?.poor?.[0]?.yoyRate <= 0 ? '#0bffa2' : '#f90'}`">{{ data?.battleYoyProportion?.data?.poor?.[0]?.yoyRate >= 0 ? `+${data?.battleYoyProportion?.data?.poor?.[0]?.yoyRate}` : data?.battleYoyProportion?.data?.poor?.[0]?.yoyRate }}%</span>
          </div>
        </div>
        <div>
          <div class="river-water-type-item">
            <span>I-III类</span>
            <span>{{ data?.battleYoyProportion?.data?.good?.[1]?.currrentMon }}%</span>
            <span :style="`color: ${data?.battleYoyProportion?.data?.good?.[1]?.yoyRate >= 0 ? '#0bffa2' : '#f90'}`">{{ data?.battleYoyProportion?.data?.good?.[1]?.yoyRate >= 0 ? `+${data?.battleYoyProportion?.data?.good?.[1]?.yoyRate}` : data?.battleYoyProportion?.data?.good?.[1]?.yoyRate }}%</span>
          </div>
          <div class="river-water-type-item">
            <span>劣V类</span>
            <span>{{ data?.battleYoyProportion?.data?.poor?.[1]?.currrentMon }}%</span>
            <span :style="`color: ${data?.battleYoyProportion?.data?.poor?.[1]?.yoyRate <= 0 ? '#0bffa2' : '#f90'}`">{{ data?.battleYoyProportion?.data?.poor?.[1]?.yoyRate >= 0 ? `+${data?.battleYoyProportion?.data?.poor?.[1]?.yoyRate}` : data?.battleYoyProportion?.data?.poor?.[1]?.yoyRate }}%</span>
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
