<script>
import ZFrame from '../ZFrame.vue'

import water from '@/assets/images/water.png'
import gisData from '@/api/modules/gis'

export default {
  components: { ZFrame },
  data() {
    return {
      loading: false,
      water,
      data: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      gisData.getSeaWaterStats({ time: '2023-09-01' }).then((res) => {
        this.loading = false
        this.data = res.data
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="水质现状统计分析">
    <div class="river-water-wrapper">
      <div class="river-water-title">
        <div>时间</div>
        <div>{{ data.season }}</div>
        <div>本年累计</div>
      </div>
      <div class="river-water-item">
        <div>水质等级（按面积）</div>
        <div>
          <div class="river-water-type-item">
            <span>I-II类</span>
            <span>{{ data.area?.currentSeasonClass1And2Rate }}%</span>
            <span :style="`color: ${data.area?.class1And2SeasonDifference >= 0 ? '#0bffa2' : '#f90'}`">{{ data.area?.class1And2SeasonDifference >= 0 ? `+${data.area?.class1And2SeasonDifference}` : data.area?.class1And2SeasonDifference }}个</span>
          </div>
          <div class="river-water-type-item">
            <span>劣IV类</span>
            <span>{{ data.area?.currentSeasonAboveClass4Rate }}%</span>
            <span :style="`color: ${data.area?.aboveClass4SeasonDifference <= 0 ? '#0bffa2' : '#f90'}`">{{ data.area?.aboveClass4SeasonDifference <= 0 ? `-${Math.abs(data.area?.aboveClass4SeasonDifference)}` : `+${data.area?.aboveClass4SeasonDifference}` }}个</span>
          </div>
        </div>
        <div>
          <div class="river-water-type-item">
            <span>I-II类</span>
            <span>{{ data.area?.currentYearClass1And2Rate }}%</span>
            <span :style="`color: ${data.area?.class1And2YearDifference >= 0 ? '#0bffa2' : '#f90'}`">{{ data.area?.class1And2YearDifference >= 0 ? `+${data.area?.class1And2YearDifference}` : data.area?.class1And2YearDifference }}个</span>
          </div>
          <div class="river-water-type-item">
            <span>劣IV类</span>
            <span>{{ data.area?.currentYearAboveClass4Rate }}%</span>
            <span :style="`color: ${data.area?.aboveClass4YearDifference <= 0 ? '#0bffa2' : '#f90'}`">{{ data.area?.aboveClass4YearDifference <= 0 ? `-${Math.abs(data.area?.aboveClass4YearDifference)}` : `+${data.area?.aboveClass4YearDifference}` }}个</span>
          </div>
        </div>
      </div>
      <div class="river-water-item">
        <div>水质等级（按点位）</div>
        <div>
          <div class="river-water-type-item">
            <span>I-II类</span>
            <span>{{ data.point?.currentSeasonClass1And2Rate }}%</span>
            <span :style="`color: ${data.point?.class1And2SeasonDifference >= 0 ? '#0bffa2' : '#f90'}`">{{ data.point?.class1And2SeasonDifference >= 0 ? `+${data.point?.class1And2SeasonDifference}` : data.point?.class1And2SeasonDifference }}个</span>
          </div>
          <div class="river-water-type-item">
            <span>劣IV类</span>
            <span>{{ data.point?.currentSeasonAboveClass4Rate }}%</span>
            <span :style="`color: ${data.point?.aboveClass4SeasonDifference <= 0 ? '#0bffa2' : '#f90'}`">{{ data.point?.aboveClass4SeasonDifference <= 0 ? `-${Math.abs(data.point?.aboveClass4SeasonDifference)}` : `+${data.point?.aboveClass4SeasonDifference}` }}个</span>
          </div>
        </div>
        <div>
          <div class="river-water-type-item">
            <span>I-II类</span>
            <span>{{ data.point?.currentYearClass1And2Rate }}%</span>
            <span :style="`color: ${data.point?.class1And2YearDifference >= 0 ? '#0bffa2' : '#f90'}`">{{ data.point?.class1And2YearDifference >= 0 ? `+${data.point?.class1And2YearDifference}` : data.point?.class1And2YearDifference }}个</span>
          </div>
          <div class="river-water-type-item">
            <span>劣IV类</span>
            <span>{{ data.point?.currentYearAboveClass4Rate }}%</span>
            <span :style="`color: ${data.point?.aboveClass4YearDifference <= 0 ? '#0bffa2' : '#f90'}`">{{ data.point?.aboveClass4YearDifference <= 0 ? `-${Math.abs(data.point?.aboveClass4YearDifference)}` : `+${data.point?.aboveClass4YearDifference}` }}个</span>
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
