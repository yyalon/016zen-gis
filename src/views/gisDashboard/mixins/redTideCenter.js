import { getWaterQualityStations } from '@/api/data'

export default {
  computed: {},
  mounted() {
    this.$nextTick(() => {
      // this.getRedTideCenter()
    })
  },
  methods: {
    getRedTideCenter() {
      getWaterQualityStations({
        province: '浙江',
        year: 2022
      }).then(res => {
        const icons = []
        const count = Math.floor(Math.random() * (20 - 10)) + 10
        for (let i = 0; i < count; i++) {
          const index = Math.floor(Math.random() * (res.length - 1))
          icons.push(res[index])
        }
        icons.forEach(item => {
          const data = {
            point: [item.longitude, item.latitude, 0],
            layer: 'redTideCenter',
            icon: 'icon_red_tide_center.png',
            tooltip: '赤潮中心'
          }
          this.addIcon(data)
        })
      })
    }
  }
}
