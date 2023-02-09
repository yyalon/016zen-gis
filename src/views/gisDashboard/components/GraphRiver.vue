<template>
  <div>
    <panel-right :width="400"
      ><div slot="content">
        <chart-pie-pollutions></chart-pie-pollutions>
        <chart-river-section-water-quality-years
          @click-text="openDrawerRiver()"
        ></chart-river-section-water-quality-years>
        <chart-t-n-years @click-text="openDrawerRiver()"></chart-t-n-years>
        <chart-line-main-factors></chart-line-main-factors></div
    ></panel-right>
    <drawer-river
      v-if="detailsVisible"
      :drawer-visible.sync="detailsVisible"
      @close="detailsVisible = false"
    />
  </div>
</template>

<script>
import DrawerRiver from '../../components/DrawerRiver'
import { getRiverSections } from '@/api/data'
import PanelRight from '@/views/components/PanelRight'
import ChartPiePollutions from './ChartPiePollutions'
import ChartTNYears from './ChartTNYears'
import ChartRiverSectionWaterQualityYears from './ChartRiverSectionWaterQualityYears'
import ChartLineMainFactors from './ChartLineMainFactors'
import layer from '../mixins/layer'

export default {
  name: 'GraphRiver',
  props: {},
  components: {
    DrawerRiver,
    PanelRight,
    ChartTNYears,
    ChartPiePollutions,
    ChartRiverSectionWaterQualityYears,
    ChartLineMainFactors
  },
  mixins: [layer],
  data() {
    return { detailsVisible: false, graphicLayer: null }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.getWaterQualityMonitoringSection()
    })
  },
  methods: {
    openDrawerRiver() {
      this.detailsVisible = true
    },
    getWaterQualityMonitoringSection() {
      getRiverSections().then(res => {
        res.forEach(item => {
          item.level = _.random(1, 6)
          const data = {
            level: item.level,
            position: [
              parseFloat(item.longitude),
              parseFloat(item.latitude),
              0
            ],
            layer: 'waterQualityMonitoringSection',
            tooltip: `名称：${
              item.name
            }入海河流水质监测断面<br>所属省市：${item.province ||
              ''}${item.city || ''}${item.county ||
              ''}<br>流域水体：${item.river || ''}${item.system || ''}`
          }
          data.attr = {
            scope: {
              showPopup: true,
              popupData: {
                id: item.id,
                type: 'riverSection',
                name: `${item.province || ''}${item.city || ''}${item.county ||
                  ''}${item.name}水质监测断面`
              },
              'popup-component': require(`@/components/RiverSectionPopup`)
                .default
            }
          }
          if (item.level) {
            data.image = window.config.iconUrl + `water_${item.level}.png`
          } else {
            data.image = window.config.iconUrl + 'nomal.png'
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
