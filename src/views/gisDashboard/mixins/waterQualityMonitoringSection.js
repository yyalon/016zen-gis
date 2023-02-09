import { getRiverSections } from '@/api/data'

export default {
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.getWaterQualityMonitoringSection()
    })
  },
  methods: {
    getWaterQualityMonitoringSection() {
      getRiverSections().then(res => {
        res.forEach(item => {
          item.level = Math.floor(Math.random() * (6 - 1)) + 1
          const data = {
            level: item.level,
            point: [item.longitude, item.latitude, 0],
            layer: 'waterQualityMonitoringSection',
            tooltip:
              item.city + item.county + item.name + '入海河流水质监测断面'
          }
          data.attr = {
            scope: {
              showPopup: true,
              popupData: {
                type: 'riverSection',
                name:
                  item.city + item.county + item.name + '入海河流水质监测断面'
              },
              'popup-component': require(`@/components/RiverSectionStationPopup`)
                .default
            }
          }
          if (item.level) {
            data.icon = `water_${item.level}.png`
          } else {
            data.icon = 'nomal.png'
          }
          this.addIcon(data)
        })
      })
    }
  }
}
