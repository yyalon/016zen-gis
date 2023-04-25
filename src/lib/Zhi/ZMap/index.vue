<script>
import ZMapViewer from './z-map.vue'
import defaultConfig from './config/default.json'

export default {
  name: 'ZMap',
  components: {
    ZMapViewer,
  },
  props: {
    // 地图唯一性标识
    mapKey: {
      type: String,
      default: '',
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
    this.config = { ...this.config, ...this.mapOptions }
  },
  mounted() {},
  unmounted() {},
  methods: {
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
    <ZMapViewer
      :map-key="mapKey || 'zMap'"
      :options="config"
      @onload="onMapload"
    />
  </div>
</template>

<style lang="scss" scoped>
  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
