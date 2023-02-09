<template>
  <div class="map">
    <z-map-viewer
      :map-key="mapKey || 'zMap'"
      :options="config"
      @onload="onMapload"
    />
    <popup
      v-if="popupVisible"
      :popup-data="popupData"
      @closePopup="closePopup"
    />
  </div>
</template>

<script>
import Popup from './popup'
import ZMapViewer from './z-map.vue'
import configJSON from './config/index.json'

export default {
  name: 'ZMap',
  components: {
    Popup,
    ZMapViewer
  },
  props: {
    // 地图唯一性标识
    mapKey: {
      type: String,
      default: ''
    },
    mapOptions: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      config: {},
      popupData: {},
      popupVisible: false,
      clicked_entity: null
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    if (configJSON.tdtKeys && configJSON.map3d && configJSON.map3d.basemaps) {
      configJSON.map3d.basemaps.forEach(map => {
        if (map.type === 'tdt') map.key = configJSON.tdtKeys
        if (map.type === 'group') {
          map.layers &&
            map.layers.forEach(layer => {
              if (layer.type === 'tdt') layer.key = configJSON.tdtKeys
            })
        }
      })
    }

    this.config = (configJSON && configJSON.map3d) || {}
    this.config = { ...this.config, ...this.mapOptions }
  },
  mounted() {},
  destroyed() {},
  methods: {
    closePopup() {
      this.popupData = {}
      this.popupVisible = false
      this.clicked_entity = null
    },
    onMapload(map) {
      this[`$${this.mapKey || 'zMap'}`].Event.$on('CLICK_ICON', event => {
        if (
          event &&
          event.attr &&
          event.attr.scope &&
          event.attr.scope.showPopup
        ) {
          event.flyTo()
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
      map.on(this.$ZMap.EventType.click, event => {
        if (
          event &&
          event.graphic &&
          event.graphic.attr &&
          event.graphic.attr.scope &&
          event.graphic.attr.scope.showPopup
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
      map.on(this.$ZMap.EventType.postRender, event => {
        if (this.clicked_entity) {
          this.$set(
            this.popupData,
            'position',
            this.Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              this[`$${this.mapKey || 'zMap'}`].scene,
              this.clicked_entity._position
            )
          )
        }
      })
      this.$emit('map-loaded')
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
