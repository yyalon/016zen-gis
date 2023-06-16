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
  mounted() {
  },
  unmounted() { },
  methods: {
  },
}
</script>

<template>
  <div class="popup-container">
    <ElDescriptions :title="`气象站名称 :${popupData.STATION_NAME}`" :column="1" border size="small">
      <ElDescriptionsItem v-if="popupData.ALTI" label="测站高度(米)">
        {{ popupData.ALTI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PRS_SENSOR_ALTI" label="气压传感器海拔高度(米)">
        {{ popupData.PRS_SENSOR_ALTI }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.WIN_S_SENSOR_HEIGH" label="风速传感器距地面高度(米)">
        {{ popupData.WIN_S_SENSOR_HEIGH }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.STATION_LEVL" label="测站级别">
        {{ popupData.STATION_LEVL }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="行政区">
        {{ popupData.COUNTRY }}{{ popupData.PROVINCE }}{{ popupData.CITY }}{{ popupData.CNTY }}{{ popupData.TOWN }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<style lang="scss" scoped>
.popup-container {
  :deep .el-descriptions__title {
    text-wrap: wrap;
  }

  :deep .el-descriptions__body {
    max-width: 450px;

    .el-descriptions__content {
      min-width: 300px;
      text-wrap: wrap;
    }
  }
}
</style>
