<script lang="ts"  name="Layout">
import dayjs from 'dayjs'
import GraphSwitcher from './components/GraphSwitcher.vue'
import GraphOutfall from './components/GraphOutfall.vue'
import GraphRiver from './components/GraphRiver.vue'
import GraphOcean from './components/GraphOcean.vue'
import GraphBiology from './components/GraphBiology.vue'
import GraphMeteorology from './components/GraphMeteorology.vue'
import settings from '@/settings.default'
import { toAdmin } from '@/utils/index'
import 'dayjs/locale/zh-cn'

import geoApi from '@/api/modules/layers'

const width = 1920
const height = 1080

export default {
  components: { GraphSwitcher, GraphOutfall, GraphRiver, GraphOcean, GraphBiology, GraphMeteorology },
  data() {
    return {
      loading: false,
      activeGraph: 'river',
      settings,
      transform: 'scale(1,1) translate(-50%, -50%)',
      transformContent: 'scale(1,1)',
      transformX: 'scale(1,1)',
      transformY: 'scale(1,1)',
    }
  },
  watch: {
    activeGraph: {
      deep: true,
      handler(n) {
        // if (n) {
        //   router.push({ query: { graph: n } })
        // }
      },
    },
  },
  async mounted() {
    // getGeoSerevrLayers().then((res) => {
    //   console.error(res)
    // })

    const { data } = await geoApi.getGeoSerevrLayers()

    this.loading = this.$loading({
      lock: true,
      text: '正在加载地图数据...',
      spinner: 'el-icon-loading',
      background: '#100d17e3',
    })
    const layers = data.layers.layer
    layers.forEach((layer: any) => {
      const tileLayer = new window.$ZMap.layer.WmsLayer({
        name: layer.name,
        type: 'wms',
        url: 'http://139.9.41.23:8078/geoserver/sea/wms',
        layers: `sea:${layer.name}`,
        parameters: {
          service: 'WMS',
          format: 'image/png',
          transparent: true,
        },
        maxLength: -1,
        popup: 'all',
        opacity: 0.2,
        show: true,
      })
      tileLayer.on('load', () => {
        setTimeout(() => {
          tileLayer.show = true
          this.loading.close()
        }, 1000)
      })
      window.$zMap.addLayer(tileLayer)
    })
    this.activeGraph = 'river'
    this.setScale()
    window.addEventListener('resize', () => {
      this.setScale()
    })
  },
  unmounted() { },
  methods: {
    getScale() {
      const w = window.innerWidth / width
      const h = window.innerHeight / height
      return { x: w, y: h }
    },
    setScale() {
      const scale = this.getScale()
      this.transform = `scale(${scale.x},${scale.y}) translate(-50%, -50%)`
      const scaleContent = scale.x < scale.y ? scale.x : scale.y
      this.transformContent = `scale(${scaleContent},${scaleContent})`
      this.transformX = `scale(${scale.x},${scale.x})`
      this.transformY = `scale(${scale.y},${scale.y})`
    },
    toLogin() {
      toAdmin('/logout')
    },
    toAdminIndex() {
      toAdmin('')
    },
    moment(date: any, format: any) {
      return date
        ? dayjs(date).locale('zh-cn').format(format)
        : dayjs().locale('zh-cn').format(format)
    },
  },
}
</script>

<template>
  <div class="layout">
    <div class="layout-background" />
    <ZMap />
    <div class="layout-mask" />
    <div class="layout-content">
      <div class="title" :style="{ transform: transformContent }" @click="toAdminIndex()">
        {{ settings.app.abbreviation }}
      </div>
      <div class="title-en" :style="{ transform: transformContent }">
        {{ settings.app.titleEn }}
      </div>
      <div class="time" :style="{ transform: transformContent }" @click="toLogin()">
        {{ moment(null, 'HH:mm') }}
      </div>
      <div class="date" :style="{ transform: transformContent }">
        {{ moment(null, 'YYYY-MM-DD') }}
      </div>
      <div class="weekday" :style="{ transform: transformContent }">
        {{ moment(null, 'dddd') }}
      </div>
      <GraphSwitcher v-model:active-graph="activeGraph" :style="{ transform: transformContent }" />
      <GraphRiver
        :visible="activeGraph === 'river'" :style="{
          transform: transformY,
          transformOrigin: '100% 0px',
        }"
      />
      <GraphOutfall
        :visible="activeGraph === 'outfall'" :style="{
          transform: transformY,
          transformOrigin: '100% 0px',
        }"
      />
      <GraphOcean
        :visible="activeGraph === 'ocean'" :style="{
          transform: transformY,
          transformOrigin: '100% 0px',
        }"
      />
      <GraphBiology
        :visible="activeGraph === 'biology'" :style="{
          transform: transformY,
          transformOrigin: '100% 0px',
        }"
      />
      <GraphMeteorology
        :visible="activeGraph === 'meteorology'" :style="{
          transform: transformY,
          transformOrigin: '100% 0px',
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
  overflow: hidden;

  .layout-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    background-image: url("@/assets/images/bg.png");
  }

  .layout-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    pointer-events: none;
    background-image: url("@/assets/images/mask.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .title {
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 2000;
    width: 424px;
    height: 32px;
    font-family: SourceHanSansCN-Regular;
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    text-shadow: rgb(11 113 230 / 0%) 1px 1px 1px;
    user-select: none;
    transform-origin: 50% 50%;
  }

  .title-en {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 45px;
    z-index: 2000;
    width: 327px;
    height: 16px;
    clip-path: inset(1px 0);
    font-family: SourceHanSansCN-Regular;
    font-size: 13px;
    color: transparent;
    text-align: center;
    user-select: none;
    background:
      linear-gradient(360deg,
        rgb(155 155 155) 0%,
        rgb(255 255 255) 100%);
    background-clip: text !important;
  }

  .time {
    position: absolute;
    top: 14px;
    left: 100px;
    z-index: 2000;
    width: 64px;
    height: 22px;
    font-family: DINPro-Regular;
    font-size: 26px;
    line-height: 26px;
    user-select: none;
  }

  .date {
    position: absolute;
    top: 12px;
    left: 10px;
    z-index: 2000;
    width: 90px;
    height: 11px;
    font-family: DINPro-Regular;
    font-size: 14px;
    line-height: 14px;
    user-select: none;
  }

  .weekday {
    position: absolute;
    top: 27px;
    left: 50px;
    z-index: 2000;
    width: 42px;
    height: 12px;
    font-family: DINPro-Regular;
    font-size: 14px;
    line-height: 14px;
    user-select: none;
  }
}
</style>
