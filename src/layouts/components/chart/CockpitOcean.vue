<script>
import ZFrame from '../ZFrame.vue'

export default {
  name: 'CockpitOcean',
  components: { ZFrame },
  data() {
    return {
      lists: [
        {
          text: '监测断面数量',
          num: 21,
          unit: '个',
          percent: 89.5,
          items: [{ goal: 64.6, diff: 4.5, text: '江苏' }, { goal: 17.5, diff: 4.5, text: '上海' }],
        },
        {
          text: '监测面积（km2）',
          num: 18507,
          percent: 89.5,
          items: [{ goal: 64.6, diff: 4.5, text: '江苏' }, { goal: 17.5, diff: 4.5, text: '上海' }],
        },
      ],
    }
  },
}
</script>

<template>
  <ZFrame title="近岸海域">
    <div class="cockpit-ocean-card">
      <div
        v-for="(group, index) in lists" :key="index"
        class="cockpit-ocean-item"
      >
        <div class="cockpit-ocean-left">
          <div><span class="number">{{ group.num }}</span>{{ group.unit || '' }}</div>
          <div>{{ group.text }}</div>
        </div>
        <div class="cockpit-ocean-right">
          <div class="cockpit-ocean-percent">
            <div class="cockpit-ocean-label">
              水质优良比例
            </div>
            <div><span class="number">{{ group.percent }}</span>%</div>
          </div>
          <el-divider />
          <div class="cockpit-ocean-analysis">
            <div class="cockpit-ocean-area">
              <div class="cockpit-ocean-label" />
              <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="cockpit-ocean-value">
                {{ item.text }}
              </div>
            </div>
            <div class="cockpit-ocean-analysis-percent">
              <div class="cockpit-ocean-label">
                考核目标
              </div>
              <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="cockpit-ocean-value">
                <span class="number" style="color: #f90;">{{ item.goal }}</span>%
              </div>
            </div>
            <el-divider direction="vertical" />
            <div class="cockpit-ocean-analysis-percent">
              <div class="cockpit-ocean-label">
                优于目标
              </div>
              <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="cockpit-ocean-value">
                <span class="number" style="color: rgb(0 202 3 / 80%);">{{ item.diff }}</span>%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ZFrame>
</template>

<style lang="scss" scoped>
.cockpit-ocean-card {
  margin-top: -13px;

  .cockpit-ocean-item {
    display: flex;
    background: linear-gradient(180deg, rgb(93 204 255 / 0%) 0%, rgb(91 203 255 / 6%) 100%);
    border-radius: 4px;

    & + .cockpit-ocean-item {
      margin-top: 18px;
    }
  }

  .cockpit-ocean-left {
    width: 167px;
    height: 182px;
    padding-top: 36px;
    text-align: center;
    background-image: url("@/assets/images/oceanBg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .number {
      font-size: 34px;
    }
  }

  .cockpit-ocean-right {
    flex: 1;
    padding: 8px 8px 0;

    ::v-deep .el-divider {
      border: 0;
      background: linear-gradient(270deg, rgb(72 179 255 / 0%) 0%, rgb(81 183 255 / 80%) 52%, rgb(81 183 255 / 0%) 100%);

      &.el-divider--horizontal {
        margin: 14px 0;
      }

      &.el-divider--vertical {
        margin: 0;
        height: auto;
        background: linear-gradient(270deg, rgb(25 117 255 / 0%) 0%, rgb(25 117 255 / 60%) 51%, rgb(25 117 255 / 0%) 100%);
      }
    }

    .cockpit-ocean-label {
      margin-bottom: 4px;
    }
  }

  .cockpit-ocean-percent {
    .number {
      font-size: 36px;
    }
  }

  .cockpit-ocean-analysis {
    display: flex;
    align-items: stretch;

    .number {
      font-size: 24px;
    }

    .cockpit-ocean-label {
      height: 16px;
    }

    .cockpit-ocean-area {
      width: 43px;
    }

    .cockpit-ocean-analysis-percent {
      flex: 1;
      text-align: center;

      .cockpit-ocean-value {
        justify-content: center;
      }
    }

    .cockpit-ocean-value {
      height: 24px;
      display: flex;
      align-items: flex-end;

      & + .cockpit-ocean-value {
        margin-top: 9px;
      }
    }
  }
}
</style>
