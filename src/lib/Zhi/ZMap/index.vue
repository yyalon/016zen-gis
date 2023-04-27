<script>
import { getCurrentInstance } from 'vue'
import defaultConfig from './config/default.json'

export default {
  name: 'ZMap',
  components: {
  },
  props: {
    // 地图唯一性标识
    mapKey: {
      type: String,
      default: 'zMap',
    },
    mapOptions: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['mapLoaded'],
  data() {
    return {
      config: {},
      popupData: {},
      popupVisible: false,
      clicked_entity: null,
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {

  },
  mounted() {
    if (
      defaultConfig.tdtKeys
        && defaultConfig.map3d
        && defaultConfig.map3d.basemaps
    ) {
      defaultConfig.map3d.basemaps.forEach((map) => {
        if (map.type === 'tdt') {
          map.key = defaultConfig.tdtKeys
        }
        if (map.type === 'group') {
          map.layers
              && map.layers.forEach((layer) => {
                if (layer.type === 'tdt') {
                  layer.key = defaultConfig.tdtKeys
                }
              })
        }
      })
    }
    this.config = (defaultConfig && defaultConfig.map3d) || {}
    this.config = this.$ZMap.Util.merge(this.config, this.mapOptions)
    this.initMars3d(this.config)
  },
  unmounted() {},
  methods: {
    initMars3d(mapOptions) {
      if (this[`map${this.mapKey}`]) {
        this[`map${this.mapKey}`].destroy()
      }
      // 创建三维地球场景
      const map = new this.$ZMap.Map(`zmap-container-${this.mapKey}`, mapOptions)

      const instance = getCurrentInstance()
      instance.appContext.config.globalProperties.$zMap = map

    // 抛出事件
    // this.$emit('onload', map)
    },
    onMapload(map) {
      this[`$${this.mapKey || 'zMap'}`].Event.$on('CLICK_ICON', (event) => {
        if (
          event
            && event.attr
            && event.attr.scope
            && event.attr.scope.showPopup
        ) {
          this.clicked_entity = event
          this.popupData = {}
          this.popupVisible = false
          this.$nextTick(() => {
            const { scope } = event.attr
            this.popupData = { scope }
            this.popupVisible = true
          })
        }
      })
      this[`$${this.mapKey || 'zMap'}`].Event.$on('CLOSE_POPUP', () => {
        this.closePopup()
      })
      map.on(this.$ZMap.EventType.click, (event) => {
        if (
          event
            && event.graphic
            && event.graphic.attr
            && event.graphic.attr.scope
            && event.graphic.attr.scope.showPopup
        ) {
          this.clicked_entity = event.graphic
          this.popupData = {}
          this.popupVisible = false
          this.$nextTick(() => {
            const { scope } = event.graphic.attr
            this.popupData = { scope }
            this.popupVisible = true
          })
        }
      })
      map.on(this.$ZMap.EventType.postRender, () => {
        if (this.clicked_entity) {
          this.$set(
            this.popupData,
            'position',
            this.Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              this[`$${this.mapKey || 'zMap'}`].scene,
              this.clicked_entity._position,
            ),
          )
        }
      })
      this.$emit('mapLoaded')
    },
  },
}
</script>

<template>
  <div class="map">
    <div :id="`zmap-container-${mapKey}`" class="zmap-container" />
  </div>
</template>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .zmap-container {
      height: 100%;
      overflow: hidden;
    }
  }
</style>
