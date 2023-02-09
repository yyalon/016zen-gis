<template>
  <div class="dashboard-container">
    <!-- <panel-left :width="400"
      ><div slot="content"><box1>22222</box1></div>
    </panel-left> -->
    <filter-bar></filter-bar>
    <toolbar @toggle-visible="toggleVisible"></toolbar>
    <graph-meteorology v-if="activeGraph === 'meteorology'"></graph-meteorology>
    <graph-river v-if="activeGraph === 'river'"></graph-river>
    <graph-outfall v-if="activeGraph === 'outfall'"></graph-outfall>
    <graph-water-quality v-if="activeGraph === 'quality'"></graph-water-quality>
    <graph-biology v-if="activeGraph === 'biology'"></graph-biology>
    <graph-satellite v-if="activeGraph === 'satellite'"></graph-satellite>
    <graph-switcher :active-graph.sync="activeGraph"></graph-switcher>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import FilterBar from './components/FilterBar'
import GraphSwitcher from './components/GraphSwitcher'
import GraphRiver from './components/GraphRiver'
import GraphOutfall from './components/GraphOutfall'
import GraphWaterQuality from './components/GraphWaterQuality'
import GraphBiology from './components/GraphBiology'
import GraphSatellite from './components/GraphSatellite'
import GraphMeteorology from './components/GraphMeteorology'
let coastlineLayer = null
let seaFuntionLayer = null
let seaBorderLayer = null
let cityBorderLayer = null
let cityNameLayer = null
let areas = []
let areaType = {}

export default {
  name: 'GisDashboard',
  mixins: [],
  components: {
    GraphSatellite,
    GraphRiver,
    Toolbar,
    FilterBar,
    GraphWaterQuality,
    GraphOutfall,
    GraphBiology,
    GraphMeteorology,
    GraphSwitcher
  },
  watch: {
    activeGraph: {
      deep: true,
      handler(n) {
        if (n) {
          this.$router.push({ query: { graph: n } })
        }
      }
    }
  },
  data() {
    return {
      loading: null,
      activeGraph: '',
      outfallAreas: []
    }
  },
  beforeDestroy() {
    if (seaBorderLayer) {
      seaBorderLayer.clear()
      this.$zMap.removeLayer(seaBorderLayer, true)
      seaBorderLayer = null
    }

    if (seaFuntionLayer) {
      seaFuntionLayer.clear()
      this.$zMap.removeLayer(seaFuntionLayer, true)
      seaFuntionLayer = null
    }

    if (cityNameLayer) {
      cityNameLayer.clear()
      this.$zMap.removeLayer(cityNameLayer, true)
      cityNameLayer = null
    }
  },
  mounted() {
    this.loading = this.$loading({
      lock: true,
      text: '正在加载地图数据...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    // this.getStations()
    if (this.$route && this.$route.query && this.$route.query.graph) {
      this.activeGraph = this.$route.query.graph
    } else {
      this.activeGraph = 'river'
    }
    this.$nextTick(() => {
      const layers = this.$zMap.getLayers()
      const arcgisLayer = layers[0]
      arcgisLayer.brightness = 0.5
      this.initLayer()
    })
  },
  methods: {
    addCityNameLayer() {
      //添加市区名称图层
      cityNameLayer = new this.$ZMap.layer.GeoJsonLayer({
        name: '市区名称',
        url: window.config.geoJsonPath + 'cityName.json',
        symbol: {
          styleOptions: {
            fill: false,
            outline: false,
            label: {
              // 面中心点，显示文字的配置
              text: '{name}', // 对应的属性名称
              opacity: 1,
              font_size: 16,
              color: '#ffffff',

              font_family: '楷体',
              outline: true,
              outlineColor: '#000000',
              outlineWidth: 5,

              font_weight: 'normal',
              font_style: 'normal',

              scaleByDistance: true,
              scaleByDistance_far: 20000000,
              scaleByDistance_farValue: 0.1,
              scaleByDistance_near: 1000,
              scaleByDistance_nearValue: 1,
              clampToGround: true
            }
          }
        },
        flyTo: true
      })
      cityNameLayer.on(this.$ZMap.EventType.load, event => {
        this.loading.close()
      })
      this.$zMap.addLayer(cityNameLayer)
    },

    addCoastLineLayer() {
      // 添加边界图层
      coastlineLayer = new this.$ZMap.layer.GeoJsonLayer({
        name: '分类型岸线',
        url: window.config.geoJsonPath + 'coastline.json',
        symbol: {
          styleOptions: {
            fill: true,
            randomColor: true, // 随机色
            opacity: 0.3,
            outline: true,
            outlineStyle: {
              color: 'blue',
              width: 3,
              opacity: 1
            },
            // 高亮时的样式
            highlight: {
              opacity: 0.9
            },
            label: {
              // 面中心点，显示文字的配置
              text: '{name}', // 对应的属性名称
              opacity: 1,
              font_size: 40,
              color: '#ffffff',

              font_family: '楷体',
              outline: true,
              outlineColor: '#000000',
              outlineWidth: 3,

              background: false,
              backgroundColor: '#000000',
              backgroundOpacity: 0.1,

              font_weight: 'normal',
              font_style: 'normal',

              scaleByDistance: true,
              scaleByDistance_far: 20000000,
              scaleByDistance_farValue: 0.1,
              scaleByDistance_near: 1000,
              scaleByDistance_nearValue: 1,
              clampToGround: true
            }
          }
        },
        flyTo: true
      })
      this.$zMap.addLayer(coastlineLayer)
    },
    addCityBorderLayer() {
      // 添加边界图层
      cityBorderLayer = new this.$ZMap.layer.GeoJsonLayer({
        zIndex: 1,
        name: '市区边界',
        url: window.config.geoJsonPath + 'cityBorder.json',
        symbol: {
          callback: (attr, styleOpt) => {
            return {
              clampToGround: true,
              fill: true,
              color: attr.fill,
              opacity: attr['fill-opacity'],
              outline: true,
              outlineStyle: {
                color: attr['stroke'],
                width: attr['stroke-width'],
                opacity: attr['stroke-opacity']
              }
            }
          }
        }
      })
      cityBorderLayer.on(this.$ZMap.EventType.load, event => {
        if (event.layer) {
          setTimeout(() => {
            this.addCityNameLayer()
          }, 1000)
        }
      })
      this.$zMap.addLayer(cityBorderLayer)
    },
    addSeaFunctionLayer() {
      seaFuntionLayer = new this.$ZMap.layer.GeoJsonLayer({
        name: '分类型岸线',
        url: window.config.geoJsonPath + 'seaFunction.json',
        symbol: {
          callback: function(attr, styleOpt) {
            areas.push(attr)
            areaType[attr['功能区']] = 1
          },
          styleOptions: {
            fill: true,
            randomColor: true, // 随机色
            opacity: 0.1,
            outline: false,
            outlineStyle: {
              color: 'blue',
              width: 4,
              opacity: 1
            },
            // 高亮时的样式
            highlight: {
              opacity: 0.5
            },
            label: {
              // 面中心点，显示文字的配置
              text: '{name}', // 对应的属性名称
              opacity: 1,
              font_size: 40,
              color: '#ffffff',

              font_family: '楷体',
              outline: true,
              outlineColor: '#000000',
              outlineWidth: 3,

              background: false,
              backgroundColor: '#000000',
              backgroundOpacity: 0.1,

              font_weight: 'normal',
              font_style: 'normal',

              scaleByDistance: true,
              scaleByDistance_far: 20000000,
              scaleByDistance_farValue: 0.1,
              scaleByDistance_near: 1000,
              scaleByDistance_nearValue: 1,
              clampToGround: true
            }
          }
        },
        flyTo: true,
        tooltip: e => {
          if (e && e.graphic && e.graphic.attr) {
            const attr = e.graphic.attr
            // OBJECTID: 194
            // Shape_Area: 0.209389868172
            // Shape_Leng: 4.81622556588
            // area: 2250.86283416
            // 代码9: "B6-12"
            // 功能_1: "东海水产种质资源海洋保护区"
            // 功能区: "海洋保护区"
            // 地理范: "舟山市、宁波市、台州市靠近领海外部界线附近海域"
            // 岸线_米: 0
            // 序号: 222
            // 所在县: "椒江区、临海市、象山县、普陀区、"
            // 所在市: "台州市、宁波市、舟山市"
            // 所在省: "浙江省"
            // 海域使: "1、重点保障保护区用海，在不影响整体保护区基本功能前提下，兼容旅游娱乐功能、科研教学用海、交通运输用海和渔业用海；2、禁止改变海域自然属性； 3、严格按照国家关于海洋环境保护"
            // 海洋环: "1、严格保护区域内带鱼产卵亲体和幼鱼等海洋生物资源，加强海洋生态修复；2、维持、恢复、改善海洋生态环境和生物多样性，保护自然景观； 3、海水水质质量执行不劣于第一类，海洋沉积"
            // 面积（: 224965
            return `名称：${attr['功能_1']}`
          }
        }
      })
      seaFuntionLayer.on(this.$ZMap.EventType.load, event => {})
      this.$zMap.addLayer(seaFuntionLayer)
    },
    toggleVisible(type) {
      if (this.layer[type]) this.layer[type].show = !this.layer[type].show
    },
    initLayer() {
      for (const key in this.layer) {
        this.layer[key] = new this.$ZMap.layer.GraphicLayer()
        this.$zMap.addLayer(this.layer[key])
      }

      // this.addSeaBorderLayer()

      // 添加城市区县边界之后，添加区县名称
      this.addCityBorderLayer()
      // this.addCoastLineLayer()
      this.addSeaFunctionLayer()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    position: absolute;
    width: 1px;
    height: calc(100% - 25px);
    z-index: 2000;
  }
}
</style>
