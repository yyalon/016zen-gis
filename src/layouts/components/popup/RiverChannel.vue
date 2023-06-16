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
    <ElDescriptions :title="`河道测站名称 :${popupData.STNM}`" :column="1" border size="small">
      <ElDescriptionsItem v-if="popupData.WEBSTLC" label="站址">
        {{ popupData.WEBSTLC }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.RVNM" label="河名">
        {{ popupData.RVNM }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.POINTTYPE_NAME" label="测点类型">
        {{ popupData.POINTTYPE_NAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.WRZ" label="警戒水位(米)">
        {{ popupData.WRZ }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="行政区">
        {{ popupData.PROVINCE }}{{ popupData.CITY }}
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
