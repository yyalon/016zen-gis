import { getWaterQualityStations } from '@/api/data'

export default {
  computed: {},
  mounted() {
    this.$nextTick(() => {
      // this.getWaterQualityStations()
    })
  },
  methods: {
    getWaterQualityStations() {
      getWaterQualityStations({
        province: '浙江',
        year: 2022
      }).then(res => {
        const icons = []
        const count = Math.floor(Math.random() * (40 - 30)) + 30
        for (let i = 0; i < count; i++) {
          const index = Math.floor(Math.random() * (res.length - 1))
          icons.push(res[index])
        }
        icons.forEach(item => {
          item.level = Math.floor(Math.random() * (5 - 1)) + 1
          const data = {
            point: [item.longitude, item.latitude, 0],
            layer: 'waterQualityStation',
            tooltip: item.province + item.city + '海水质量监测点'
          }
          if (item.level) {
            data.icon = `sea_${item.level}.png`
          } else {
            data.icon = 'nomal.png'
          }
          this.addIcon(data)
        })
      })
    }
  }
}
