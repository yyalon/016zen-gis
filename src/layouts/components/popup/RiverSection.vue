<script>
import { ElDescriptions, ElDescriptionsItem } from 'element-plus'
import { romanToInt } from '@/utils'

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
  unmounted() {},
  methods: {
    romanToInt(s) {
      return romanToInt(s)
    },
  },
}
</script>

<template>
  <div class="popup-container">
    <ElDescriptions :title="`断面名称: ${popupData.name}`" :column="1" border size="small">
      <ElDescriptionsItem v-if="popupData.code" label="断面编码">
        {{ popupData.code }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.N2023 && popupData.W2023" label="达标情况">
        {{ parseFloat(popupData.N2023) > parseFloat(popupData.N2025) ? '总氮不达标' : '' }}&nbsp;{{ romanToInt(popupData.W2023) > romanToInt(popupData.W2025) ? '水质不达标' : '' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.waterSystem" label="水系">
        {{ popupData.waterSystem }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.function" label="断面功能">
        {{ popupData.function }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.watershed" label="流域">
        {{ popupData.watershed }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.at" label="所在水体">
        {{ popupData.at }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.to" label="汇入水体">
        {{ popupData.to }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.riverLevel" label="河流级别">
        {{ popupData.riverLevel }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.type" label="断面属性">
        {{ popupData.type }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.ofProvince" label="责任省份">
        {{ popupData.ofProvince }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.ofCity" label="责任城市">
        {{ popupData.ofCity }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.atProvince" label="所在省份">
        {{ popupData.atProvince }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.atCity" label="所在城市">
        {{ popupData.atCity }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.riverCenter" label="流域中心">
        {{ popupData.riverCenter }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.from" label="断面来源">
        {{ popupData.from }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.lake" label="湖库所属分区">
        {{ popupData.lake }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.waterType" label="水体类型">
        {{ popupData.waterType }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.crossover" label="跨界情况">
        {{ popupData.crossover }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.pointName" label="测点名称">
        {{ popupData.pointName }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.area" label="所属行政区">
        {{ popupData.area }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.areaCode" label="行政编码">
        {{ popupData.areaCode }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.pointName" label="湖库级别">
        {{ popupData.lakeLevel }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.pointName" label="所属时段">
        {{ popupData.plan }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.riverSystem" label="水系">
        {{ popupData.riverSystem }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.attributes" label="断面属性">
        {{ popupData.attributes }}
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
