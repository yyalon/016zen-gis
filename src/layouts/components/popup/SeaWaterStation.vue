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
    <ElDescriptions :title="`点位编码 :${popupData.site}`" :column="1" border size="small">
      <ElDescriptionsItem v-if="popupData.sea" label="海区">
        {{ popupData.sea }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.province || popupData.city" label="所属行政区">
        {{ popupData.province }} {{ popupData.city }}
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
    max-width: 350px;

    .el-descriptions__content {
      min-width: 200px;
      text-wrap: wrap;
    }
  }
}
</style>
