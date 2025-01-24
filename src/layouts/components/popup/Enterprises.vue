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
    <ElDescriptions :title="`污染企业: ${popupData.PSNAME}`" :column="1" border size="small">
      <ElDescriptionsItem v-if="popupData.AREANAME" label="地区名称">
        {{ popupData.AREANAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.ATTENTIONDEGREECODE" label="关注程度">
        {{ popupData.ATTENTIONDEGREECODE }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.COMMENT" label="备注">
        {{ popupData.COMMENT }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.province" label="通讯地址">
        {{ popupData.COMMUNICATEADDR }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.CORPORATIONNAME" label="法定代表人">
        {{ popupData.CORPORATIONNAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.DISPOSETYPENAME" label="处理厂类型">
        {{ popupData.DISPOSETYPENAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.EMAIL" label="电子邮箱">
        {{ popupData.EMAIL }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.ENVIRONMENTMANS" label="专职环保人员数">
        {{ popupData.ENVIRONMENTMANS }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.ENVIRONMENTPRINCIPAL" label="环保负责人">
        {{ popupData.ENVIRONMENTPRINCIPAL }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.FAX" label="传真">
        {{ popupData.FAX }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.IFALREADYONLINE" label="是否已联网">
        {{ popupData.IFALREADYONLINE }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.IFTHIRTYTENTHOUSANDKILOWAT" label="是否30万千瓦电力企业">
        {{ popupData.IFTHIRTYTENTHOUSANDKILOWAT }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.INDUSTRYTYPENAME" label="行业类别">
        {{ popupData.INDUSTRYTYPENAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.LICENSENUM" label="许可证编号">
        {{ popupData.LICENSENUM }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.LINKMAN" label="联系人">
        {{ popupData.LINKMAN }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.MOBILEPHONE" label="移动电话">
        {{ popupData.MOBILEPHONE }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.OFFICEPHONE" label="办公电话">
        {{ popupData.OFFICEPHONE }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.ONLINESTATUS" label="在线状态">
        {{ popupData.ONLINESTATUS }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PSADDRESS" label="污染源地址">
        {{ popupData.PSADDRESS }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PSCLASSNAME" label="污染源类别">
        {{ popupData.PSCLASSNAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PSENVIRONMENTDEPT" label="污染源环保部门">
        {{ popupData.PSENVIRONMENTDEPT }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PSSCALENAME" label="污染源规模">
        {{ popupData.PSSCALENAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.PSWEBSITE" label="污染源网址">
        {{ popupData.PSWEBSITE }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.RUNDATE" label="投产日期">
        {{ popupData.RUNDATE }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.STOPWASTESTATUS" label="停废业状态">
        {{ popupData.STOPWASTESTATUS }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.SUBJECTIONRELATIONNAME" label="隶属关系">
        {{ popupData.SUBJECTIONRELATIONNAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.TOTALAREA" label="总占地面积">
        {{ popupData.TOTALAREA }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.UNITTYPENAME" label="单位类别">
        {{ popupData.UNITTYPENAME }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.VALLEYNAME" label="流域">
        {{ popupData.VALLEYNAME }}
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
