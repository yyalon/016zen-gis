<script>
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

export default defineComponent({
  name: 'ZMap',
  props: {
    // 地图唯一性标识
    mapKey: {
      type: String,
      default: '',
    },
    // 自定义参数
    options: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  mounted() {
    if (!this.mapKey) {
      console.warn('ZMap Error: 没有设置地图组件的标识，可能会造成组件冲突')
    }
    let options = {}
    if (this.options) {
      options = mars3d.Util.merge(options, this.options)
    }
    this.initMars3d(options)
  },
  methods: {
    initMars3d(mapOptions) {
      if (this[`map${this.mapKey}`]) {
        this[`map${this.mapKey}`].destroy()
      }
      // 创建三维地球场景
      const map = new mars3d.Map(`zmap-container-${this.mapKey}`, mapOptions)

      this[`map${this.mapKey}`] = map

      // 抛出事件
      // this.$emit('onload', map)
    },
  },
})
</script>

<template>
  <div :id="`zmap-container-${mapKey}`" class="zmap-container" />
</template>

<style>
  .zmap-container {
    height: 100%;
    overflow: hidden;
  }
</style>
