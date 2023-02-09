<template>
  <div :id="`zmap-container-${mapKey}`" class="zmap-container" />
</template>

<script>
import Vue from 'vue'

import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

Vue.prototype.$ZMap = mars3d
Vue.prototype.Cesium = mars3d.Cesium

export default {
  name: 'ZMapViewer',

  props: {
    // 地图唯一性标识
    mapKey: {
      type: String,
      default: ''
    },

    // 初始化配置config.json的地址
    url: { type: String, default: '' },
    // 自定义参数
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  mounted() {
    if (!this.mapKey) {
      console.warn('ZMap Error: 没有设置地图组件的标识，可能会造成组件冲突')
    }
    // let options = config.map3d
    let options = {}
    if (this.options) {
      options = mars3d.Util.merge(options, this.options)
    }
    if (this.url) {
      mars3d.Resource.fetchJson({ url: this.url }).then(data => {
        // 构建地图
        const _options = mars3d.Util.merge(data.map3d, options)
        this.initMars3d(_options)
      })
    } else {
      this.initMars3d(options)
    }
  },

  beforeDestroy() {
    const map = this[`map${this.mapKey}`]
    if (map) {
      map.destroy()
      delete this[`map${this.mapKey}`]
    }
    if (Vue.prototype[`$${this.mapKey}`]) {
      delete this[`$${this.mapKey}`]
    }
  },

  methods: {
    initMars3d(mapOptions) {
      if (this[`map${this.mapKey}`]) {
        this[`map${this.mapKey}`].destroy()
      }
      // 创建三维地球场景
      var map = new mars3d.Map(`zmap-container-${this.mapKey}`, mapOptions)

      map.Event = new Vue()

      this[`map${this.mapKey}`] = map

      Vue.prototype[`$${this.mapKey}`] = map

      // 抛出事件
      this.$emit('onload', map)
    }
  }
}
</script>

<style>
.zmap-container {
  height: 100%;
  overflow: hidden;
}
</style>
