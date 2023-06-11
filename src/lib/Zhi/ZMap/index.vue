<script>
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
  beforeCreate() { },
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
    this.config = $ZMap.Util.merge(this.config, this.mapOptions)
    this.initMap(this.config)
  },
  unmounted() { },
  methods: {
    initMap(mapOptions) {
      if (this[`map${this.mapKey}`]) {
        this[`map${this.mapKey}`].destroy()
      }
      // 创建三维地球场景

      const map = new $ZMap.Map(`zmap-container-${this.mapKey}`, mapOptions)

      window.$zMap = map
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
