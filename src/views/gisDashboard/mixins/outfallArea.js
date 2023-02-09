import { getOutfallAreas } from '@/api/data'

export default {
  computed: {},
  mounted() {
    this.$nextTick(() => {
      // this.getOutfallAreas()
    })
  },
  methods: {
    
    addOutfallAreaPolygon(item) {
      const polygon = new this.$ZMap.graphic.PolygonEntity({
        positions: item.points,
        style: {
          color: '#ff0000',
          opacity: 0.5,
          outline: true,
          outlineWidth: 2,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0.0,
            100000
          ),
          outlineColor: '#ffffff',
          clampToGround: true
        },
        highlight: {
          scale: 0.7
        },
        tooltip: item.name,
        tooltipOptions: { offsetY: -40 }
      })
      this.layer.outfallArea.addGraphic(polygon)
      item.level = Math.floor(Math.random() * (5 - 1)) + 1
      const data = {
        distanceDisplay: true,
        point: item.points[0],
        layer: 'outfallArea',
        tooltip: item.name + (item.radius ? ` 半径：${item.radius}公里` : '')
      }
      if (item.level) {
        data.icon = `sea_${item.level}.png`
      } else {
        data.icon = 'nomal.png'
      }
      this.addIcon(data)
    },
    addOutfallAreaCircle(item) {
      const circle = new this.$ZMap.graphic.CircleEntity({
        position: item.points[0],
        style: {
          radius: item.radius * 1000,
          color: '#ff0000',
          opacity: 0.5,
          outline: true,
          outlineWidth: 2,
          outlineColor: '#ffffff',
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            0.0,
            100000
          ),
          clampToGround: true
        },
        highlight: {
          opacity: 0.7
        },
        tooltip: item.name + (item.radius ? ` 半径：${item.radius}公里` : ''),
        tooltipOptions: { offsetY: -20 }
      })
      this.layer.outfallArea.addGraphic(circle)

      item.level = Math.floor(Math.random() * (5 - 1)) + 1
      const data = {
        distanceDisplay: true,
        point: item.points[0],
        layer: 'outfallArea',
        tooltip: item.name + (item.radius ? ` 半径：${item.radius}公里` : '')
      }
      if (item.level) {
        data.icon = `sea_${item.level}.png`
      } else {
        data.icon = 'nomal.png'
      }
      this.addIcon(data)
    },
    getOutfallAreas() {
      getOutfallAreas({ keyword: '东海区' }).then(res => {
        this.outfallAreas = res.map(item => {
          item.points = JSON.parse(item.points)
          if (item.shape === 'c') {
            this.addOutfallAreaCircle(item)
          }
          if (item.shape === 'p') {
            this.addOutfallAreaPolygon(item)
          }
          return {
            ...item
          }
        })
      })
    }
  }
}
