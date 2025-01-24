<script>
import { ElDescriptions, ElDescriptionsItem } from 'element-plus'

export default {
  components: { ElDescriptions, ElDescriptionsItem },
  props: {
    popupData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  mounted() {},
  unmounted() {},
  methods: {},
}
</script>

<template>
  <div class="popup-container">
    <ElDescriptions :title="`大气站名称 :${popupData.POSITIONNAME}`" :column="1" border size="small">
      <ElDescriptionsItem label="城市名称">
        {{ popupData.AREA }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.AQI" label="AQI">
        {{ popupData.AQI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PRIMARYPOLLUTANT" label="首要污染物">
        {{ popupData.PRIMARYPOLLUTANT }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.QUALITY" label="环境质量等级">
        {{ popupData.QUALITY }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.SO2" label="二氧化硫">
        {{ popupData.SO2 }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.SO2_24H" label="二氧化硫24小时均值">
        {{ popupData.SO2_24H }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.SO2_IAQI" label="二氧化硫AQI">
        {{ popupData.SO2_IAQI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.NO2" label="二氧化氮">
        {{ popupData.NO2 }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.NO2_24H" label="二氧化氮24小时均值">
        {{ popupData.NO2_24H }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.NO2_IAQI" label="二氧化氮AQI">
        {{ popupData.NO2_IAQI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.O3_1H_24H" label="臭氧">
        {{ popupData.O3_1H_24H }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.O3_1H_IAQI" label="臭氧AQI">
        {{ popupData.O3_1H_IAQI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.O3_8H_24H" label="臭氧八小时滑动均值">
        {{ popupData.O3_8H_24H }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.O3_8H_IAQI" label="臭氧八小时滑动均值AQI">
        {{ popupData.O3_8H_IAQI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.CO" label="一氧化碳">
        {{ popupData.CO }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.CO_24H" label="一氧化碳24小时均值">
        {{ popupData.CO_24H }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.CO_IAQI" label="一氧化碳AQI">
        {{ popupData.CO_IAQI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PM10" label="PM10">
        {{ popupData.PM10 }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PM10_24H" label="PM10 24小时均值">
        {{ popupData.PM10_24H }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.CO_IAQI" label="PM10 AQI">
        {{ popupData.PM10_IAQI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PM2_5" label="PM2.5">
        {{ popupData.PM2_5 }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PM2_5_24H" label="PM2.5 24小时均值">
        {{ popupData.PM2_5_24H }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PM2_5_IAQI" label="PM2.5 AQI">
        {{ popupData.PM2_5_IAQI }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<style lang="scss" scoped>
.popup-container {
  :deep(.el-descriptions__title) {
    text-wrap: wrap;
  }

  :deep(.el-descriptions__body) {
    max-width: 450px;

    .el-descriptions__content {
      min-width: 300px;
      white-space: normal;
      word-break: break-all;
      overflow-wrap: break-word;
      word-wrap: break-word; /* 旧版浏览器兜底 */
    }
  }
}
</style>
