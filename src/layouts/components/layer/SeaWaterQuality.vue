<script>
const options1 = [
  { value: '选项1', label: '黄金糕' },
  { value: '选项2', label: '双皮奶' },
  { value: '选项3', label: '蚵仔煎' },
  { value: '选项4', label: '龙须面' },
  { value: '选项5', label: '北京烤鸭' },
]

export default {
  props: {

  },
  data() {
    return { options1, value1: '', year: 2022, season: 'spring', type: 'wq' }
  },
  watch: {
    year() { },
    season() { },
    type() { },
  },
  mounted() {
    const loading = this.$loading({
      lock: true,
      text: '正在加载地图数据...',
      spinner: 'el-icon-loading',
      background: '#100d17e3',
    })
    const name = this.type + this.year + this.season
    const tileLayer = new window.$ZMap.layer.WmsLayer({
      name,
      type: 'wms',
      url: 'http://139.9.41.23:8078/geoserver/sea/wms',
      layers: `sea:${name}`,
      parameters: {
        tiled: true,
        VERSION: '1.3.0',
        format: 'image/png',
        transparent: true,
      },
      popup: 'all',
      show: true,
    })
    tileLayer.on(window.$ZMap.EventType.load, () => {
      setTimeout(() => {
        tileLayer.show = true
        loading.close()
      }, 1000)
    })
    window.$zMap.addLayer(tileLayer)
  },
}
</script>

<template>
  <div>
    <el-select v-model="value1" placeholder="请选择">
      <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>
