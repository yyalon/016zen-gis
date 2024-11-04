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
  data() {
    return { details: {} }
  },
  created() {
    this.details = this.popupData
  },
  unmounted() {},
  methods: {},
}
</script>

<template>
  <div class="popup-container">
    <ElDescriptions :title="`排污口名称: ${details.name || '未设置'}`" :column="1" border size="small">
      <ElDescriptionsItem v-if="details.code" width="20" label="排口编号">
        {{ details.code }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.name" width="20" label="排口名称">
        {{ details.name }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.address" width="20" label="排口地址">
        {{ details.address }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.province" width="20" label="行政区">
        {{ details.province }} {{ details.city }} {{ details.county }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.type" width="20" label="排口类型">
        {{ details.type }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.mode" width="20" label="入海方式">
        {{ details.mode }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.subType" width="20" label="排口类型子类">
        {{ details.subType }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.waterBodyName" width="20" label="受纳水体名称">
        {{ details.waterBodyName }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.shoreType" width="20" label="岸线类型">
        {{ details.shoreType }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.responsibleParty" width="20" label="责任主体">
        {{ details.responsibleParty }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.pollutionSource" width="20" label="污染源">
        {{ details.pollutionSource }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.note" width="20" label="备注">
        {{ details.note }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.detailDescription" width="20" label="详情描述">
        {{ details.detailDescription }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.keyBay" width="20" label="所属重点海湾河口">
        {{ details.keyBay }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.gateType" width="20" label="口门形态">
        {{ details.gateType }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.drainageCharacteristic" width="20" label="排水特征">
        {{ details.drainageCharacteristic }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.sewageDischargeMode" width="20" label="污水排放方式">
        {{ details.sewageDischargeMode }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.primaryResponsiblePartyRegion" width="20" label="首要责任主体信息行政区划">
        {{ details.primaryResponsiblePartyRegion }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.dischargeName" width="20" label="排污口名称（别称）">
        {{ details.dischargeName }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.canTraceBack" width="20" label="是否能够开展溯源">
        {{ details.canTraceBack }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.primaryResponsiblePartyWater" width="20" label="首要责任主体信息水量（t/年）">
        {{ details.primaryResponsiblePartyWater }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.primaryResponsiblePartyEmissionStandard" width="20" label="首要责任主体信息排放标准">
        {{ details.primaryResponsiblePartyEmissionStandard }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="details.waterQualityGoal" width="20" label="排入水体水质目标">
        {{ details.waterQualityGoal }}
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
