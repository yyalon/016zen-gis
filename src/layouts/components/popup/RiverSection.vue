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
  data() { return { a: 'abc' } },
  mounted() {
  },
  unmounted() { },
  methods: {
    alert() {
      ElMessage('this is a message.')
    },
  },
}
</script>

<template>
  <div>
    <ElDescriptions :title="`断面名称 :${popupData.name}`" :column="1" border size="small">
      <ElDescriptionsItem v-if="popupData.code" width="20" label="断面编码">
        {{ popupData.code }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.waterSystem" width="20" label="水系">
        {{ popupData.waterSystem }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.function" width="20" label="断面功能">
        {{ popupData.function }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.watershed" width="20" label="流域">
        {{ popupData.watershed }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.at" width="20" label="所在水体">
        {{ popupData.at }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.to" width="20" label="汇入水体">
        {{ popupData.to }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.riverLevel" width="20" label="河流级别">
        {{ popupData.riverLevel }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.type" width="20" label="断面属性">
        {{ popupData.type }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.ofProvince" width="20" label="责任省份">
        {{ popupData.ofProvince }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.ofCity" width="20" label="责任城市">
        {{ popupData.ofCity }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.atProvince" width="20" label="所在省份">
        {{ popupData.atProvince }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.atCity" width="20" label="所在城市">
        {{ popupData.atCity }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.riverCenter" width="20" label="流域中心">
        {{ popupData.riverCenter }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.from" width="20" label="断面来源">
        {{ popupData.from }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.lake" width="20" label="湖库所属分区">
        {{ popupData.lake }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.waterType" width="20" label="水体类型">
        {{ popupData.waterType }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.crossover" width="20" label="跨界情况">
        {{ popupData.crossover }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.pointName" width="20" label="测点名称">
        {{ popupData.pointName }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.pointName" width="20" label="所属行政区">
        {{ popupData.area }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.areaCode" width="20" label="行政编码">
        {{ popupData.areaCode }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.pointName" width="20" label="湖库级别">
        {{ popupData.lakeLevel }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.pointName" width="20" label="所属时段">
        {{ popupData.plan }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.riverSystem" width="20" label="水系">
        {{ popupData.riverSystem }}
      </ElDescriptionsItem>
      <ElDescriptionsItem v-if="popupData.attributes" width="20" label="断面属性">
        {{ popupData.attributes }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>
