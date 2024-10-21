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
    <ElDescriptions :title="`名称 :${popupData['名称']}`" :column="1" border size="small">
      <!-- area: 5546.91306126
      二级_1: 0.152564
      二级区: 0.291077
      保护区: 0
      功能: "农业用水安全"
      功能V3: "农业水资源供给和非点源控制"
      功能_孔: "农业用水安全"
      功能目: null
      加功能: null
      变化情: "略有改动"
      名称: "曹娥江控制单元"
      土壤_1: null
      土壤保: 51.9667
      所属_1: null
      所属省: null
      新编码: "G-019"
      水源_1: null
      流域: "东南片"
      湿地: 0
      生多极: 0.517944
      生态资: 2.72589
      生物_1: null
      生物多: 54.6284
      编码: "R7-006"
      面积: 6475.96 -->

      <ElDescriptionsItem v-if="popupData['编码']" label="编码">
        {{ popupData['编码'] }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData['功能']" label="功能">
        {{ popupData['功能'] }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData['流域']" label="流域">
        {{ popupData['流域'] }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData['变化情况']" label="变化情况">
        {{ popupData['变化情况'] }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData['面积']" label="面积">
        {{ popupData['面积'] }} 平方公里
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
      text-wrap: wrap;
    }
  }
}
</style>
