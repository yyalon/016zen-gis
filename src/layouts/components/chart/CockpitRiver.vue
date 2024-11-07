<script>
import ZFrame from '../ZFrame.vue'

import rain from '@/assets/images/rain.png'
import area from '@/assets/images/area.png'
import gisData from '@/api/modules/gis'
import eventBus from '@/utils/eventBus'

export default {
  name: 'CockpitRiver',
  components: { ZFrame },
  data() {
    return {
      lists: [],
      loading: false,
      area,
      rain,
      param: {},
      waterQualityDimension: '水质',
    }
  },
  async mounted() {
    eventBus.on('filterparam', (param) => {
      this.param = param
      this.getData(param)
    })
    eventBus.on('waterQualityDimension', (param) => {
      if (param && param.waterQualityDimension) {
        this.waterQualityDimension = param.waterQualityDimension
        this.getData(this.param)
      }
    })
  },
  beforeUnmount() {
    // eventBus.off('filterparam')
  },
  created() {
    this.getData()
  },
  methods: {
    getData(param) {
      this.loading = true
      gisData.getRiverOverall({ ...param, waterQualityDimension: this.waterQualityDimension }).then((res) => {
        this.loading = false
        this.lists[0] = { ...res.data.sea, text: '东海区' }
        this.lists[1] = { ...res.data.battle, text: '攻坚战区域' }
      })
    },
  },
}
</script>

<template>
  <ZFrame v-loading="loading" title="入海河流">
    <div v-if="waterQualityDimension === '水质'" class="cockpit-river-lists">
      <div v-for="(item, index) in lists" :key="index" class="cockpit-river-item">
        <div class="cockpit-river-title">
          <div><img :src="area" style="vertical-align: middle;">{{ item.text }}</div>
          <div>
            <span class="number">{{ item.triadCategoryCount }}</span>条III类及以上
          </div>
        </div>
        <div class="cockpit-river-content">
          <div>{{ item.time }}，共监测{{ item.sectionCount }}个断面，其中达到水质考核目标的断面{{ item.qualifyCount }}个，达标率{{ item.qualifyRate }}%</div>
          <div class="compliance">
            <div class="compliance-title">
              <div><img :src="rain" style="vertical-align: middle;">水质达标率</div>
              <div>
                <span class="number">{{ item.qualifyRate }}</span> %
              </div>
            </div>
            <div class="compliance-progress">
              <div class="compliance-progress-content">
                <div class="progress-default" />
                <div class="progress-active" :style="{ width: `${item.qualifyRate}%` }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="cockpit-river-lists">
      <div v-for="(item, index) in lists" :key="index" class="cockpit-river-item">
        <div class="cockpit-river-title">
          <div><img :src="area" style="vertical-align: middle;">{{ item.text }}</div>
          <div>
            <span class="number">{{ item.triadCategoryCount }}</span>条总氮达标
          </div>
        </div>
        <div class="cockpit-river-content">
          <div>{{ item.time }}，共监测{{ item.sectionCount }}个断面，其中达到总氮考核目标的断面{{ item.qualifyCount }}个，达标率{{ item.qualifyRate }}%</div>
          <div class="compliance">
            <div class="compliance-title">
              <div><img :src="rain" style="vertical-align: middle;">总氮达标率</div>
              <div>
                <span class="number">{{ item.qualifyRate }}</span> %
              </div>
            </div>
            <div class="compliance-progress">
              <div class="compliance-progress-content">
                <div class="progress-default" />
                <div class="progress-active" :style="{ width: `${item.qualifyRate}%` }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ZFrame>
</template>

<style lang="scss" scoped>
.cockpit-river-lists {
  .number {
    font-size: 20px;
    background: linear-gradient(180deg, #fff -3%, #0085ff 100%);
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  .cockpit-river-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #0f2a5b;
    padding: 6px 12px;
  }

  .cockpit-river-content {
    padding: 12px 0;
    line-height: 1.5;
    font-size: 16;
  }

  .compliance {
    margin-top: 12px;
  }

  .compliance-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .compliance-progress {
    width: 100%;
    height: 12px;
    background: rgb(0 163 255 / 10%);
    border: 1px solid rgb(48 131 255 / 20%);
  }

  .compliance-progress-content {
    position: relative;
    width: 360px;
    height: 12px;
  }

  .progress-default {
    width: 100%;
    height: 12px;
    background-image: url("@/assets/images/progress-default.jpg");
    background-size: auto 100%;
    background-position: top left;
  }

  .progress-active {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-image: url("@/assets/images/progress-active.jpg");
    background-size: auto 100%;
    background-position: top left;
  }

  .cockpit-river-item:last-child {
    margin-top: 10px;
  }
}
</style>
