<template>
  <panel-right :width="400"
    ><template slot="content">
      <chart-pie-outfalls> </chart-pie-outfalls>
      <chart-line-outfall-years></chart-line-outfall-years>
      <chart-bar-outfall-years></chart-bar-outfall-years>
      <chart-text-online-monitoring
        @click-text="openUrl()"
      ></chart-text-online-monitoring> </template></panel-right
></template>

<script>
import { getSewageOutfalls } from '@/api/data'
import PanelRight from '@/views/components/PanelRight'
import ChartPieOutfalls from './ChartPieOutfalls'
import ChartBarOutfallYears from './ChartBarOutfallYears'
import ChartTextOnlineMonitoring from './ChartTextOnlineMonitoring'
import ChartLineOutfallYears from './ChartLineOutfallYears'
import layer from '../mixins/layer'
export default {
  name: 'GraphOutfall',
  props: {},
  components: {
    PanelRight,
    ChartPieOutfalls,
    ChartLineOutfallYears,
    ChartBarOutfallYears,
    ChartTextOnlineMonitoring
  },
  mixins: [layer],
  data() {
    return {
      graphicLayer: null
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.getSewageOutfalls()
    })
  },
  methods: {
    openUrl() {
      window.open('https://zxjk.sthjt.zj.gov.cn/zxjk3/ywgl/index.jsp', '_blank')
    },
    getSewageOutfalls() {
      getSewageOutfalls().then(res => {
        res.forEach(item => {
          // item.level = Math.floor(Math.random() * (6 - 1)) + 1
          const data = {
            level: item.level,
            position: [
              parseFloat(item.longitude),
              parseFloat(item.latitude),
              0
            ],
            color: '#eb5f5f',
            radius: 1,
            layer: 'outfall',
            tooltip: `名称：${item.name}<br>所属省市： ${item.city}${item.county}<br>地址：${item.address}`
          }
          data.attr = {
            scope: {
              showPopup: true,
              popupData: {
                id: item.id,
                type: 'outfall',
                name: item.name
              },
              'popup-component': require(`@/components/OutfallPopup`).default
            }
          }
          this.addIcon(data)
        })
        this.graphicLayer.flyTo()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
