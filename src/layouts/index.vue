<script lang="ts"  name="Layout">
import dayjs from 'dayjs'
import LayerSeaShanghai from './components/layer/SeaShanghai.vue'
import LayerSeaJiangsu from './components/layer/SeaJiangsu.vue'
import LayerSeaZhejiang from './components/layer/SeaZhejiang.vue'
import LayerLandJiangsu from './components/layer/LandJiangsu.vue'
import LayerLandShanghai from './components/layer/LandShanghai.vue'
import LayerLandZhejiang from './components/layer/LandZhejiang.vue'
import LayergetMeteorologyStations from './components/layer/MeteorologyStations.vue'
import LayerReservoirs from './components/layer/Reservoirs.vue'
import LayerRiverChannels from './components/layer/RiverChannels.vue'

// import LayerAllBorderMask from './components/layer/AllBorderMask.vue'
import GraphSwitcher from './components/GraphSwitcher.vue'
import GraphOutfall from './components/graph/Outfall.vue'
import GraphRiver from './components/graph/River.vue'
import GraphOcean from './components/graph/Ocean.vue'
import GraphBiology from './components/graph/Biology.vue'
import GraphMeteorology from './components/graph/Meteorology.vue'
import settings from '@/settings.default'
import { toAdmin } from '@/utils/index'
import 'dayjs/locale/zh-cn'

export default {
  components: {
    GraphSwitcher,
    GraphOutfall,
    GraphRiver,
    GraphOcean,
    GraphBiology,
    LayerSeaShanghai,
    LayerSeaJiangsu,
    LayerSeaZhejiang,
    LayerLandJiangsu,
    LayerLandShanghai,
    LayerLandZhejiang,
    // LayerAllBorderMask,
    LayergetMeteorologyStations,
    LayerReservoirs,
    LayerRiverChannels,
    GraphMeteorology,
  },
  data() {
    return {
      loading: null,
      activeGraph: 'river',
      settings,
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

    // this.loading = this.$loading({
    //   lock: true,
    //   text: '正在加载地图数据...',
    //   spinner: 'el-icon-loading',
    //   background: '#100d17e3',
    // })
    // const { data } = await geoApi.getGeoSerevrLayers()
    // const layers = data.layers.layer
    // layers.forEach((layer: any) => {
    //   const tileLayer = new window.$ZMap.layer.WmsLayer({
    //     name: layer.name,
    //     type: 'wms',
    //     url: 'http://139.9.41.23:8078/geoserver/sea/wms',
    //     layers: `sea:${layer.name}`,
    //     parameters: {
    //       service: 'WMS',
    //       format: 'image/png',
    //       transparent: true,
    //     },
    //     maxLength: -1,
    //     popup: 'all',
    //     show: true,
    //   })
    //   tileLayer.on('load', () => {
    //     setTimeout(() => {
    //       tileLayer.show = true
    //       this.loading.close()
    //     }, 1000)
    //   })
    //   window.$zMap.addLayer(tileLayer)
    // })

    this.activeGraph = 'river'
  },
  unmounted() { },
  methods: {
    mapLoaded() {
      window.$zMap.on(window.$ZMap.EventType.zoom, () => {
      })
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
    <ZMap @map-loaded="mapLoaded" />
    <div class="layout-mask" />
    <LayerSeaShanghai />
    <LayerSeaZhejiang />
    <LayerSeaJiangsu />
    <LayerLandJiangsu />
    <LayerLandShanghai />
    <LayerLandZhejiang />
    <LayergetMeteorologyStations />
    <LayerReservoirs />
    <LayerRiverChannels />
    <!-- <LayerAllBorderMask /> -->
    <div class="layout-container">
      <div class="layout-header">
        <div class="title" @click="toAdminIndex()">
          {{ settings.app.abbreviation }}
        </div>
        <div class="title-en">
          {{ settings.app.titleEn }}
        </div>
        <div class="time" @click="toLogin()">
          {{ moment(null, 'HH:mm') }}
        </div>
        <div class="date">
          {{ moment(null, 'YYYY-MM-DD') }}
        </div>
        <div class="weekday">
          {{ moment(null, 'dddd') }}
        </div>
      </div>
      <div class="layout-body">
        <GraphRiver :visible="activeGraph === 'river'" />
        <GraphOutfall :visible="activeGraph === 'outfall'" />
        <GraphOcean :visible="activeGraph === 'ocean'" />
        <GraphBiology :visible="activeGraph === 'biology'" />
        <GraphMeteorology :visible="activeGraph === 'meteorology'" />
      </div>
      <GraphSwitcher v-model:active-graph="activeGraph" />
    </div>
  </div>
</template>

<style>
.label-name {
  text-shadow: -1px 0 1px rgb(0 0 0 / 60%), 1px 0 1px rgb(0 0 0 / 60%), 0 1px 1px rgb(0 0 0 / 60%), 0 -1px 1px rgb(0 0 0 / 60%);
}
</style>

<style lang="scss" scoped>
.layout {
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
  overflow: hidden;

  &-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
  }

  &-mask,
  &-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &-container {
    z-index: 2000;

    .layout-header {
      width: 1920px;
      height: 100px;

      .title {
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 2000;
        font-family: SourceHanSansCN-Regular;
        font-weight: bold;
        font-size: 36px;
        text-align: center;
        text-shadow: rgb(11 113 230 / 0%) 1px 1px 1px;
        user-select: none;
      }

      .title-en {
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: 60px;
        z-index: 2000;
        height: 26px;
        clip-path: inset(1px 0);
        font-family: SourceHanSansCN-Regular;
        font-size: 20px;
        color: transparent;
        text-align: center;
        user-select: none;
        background:
          linear-gradient(
            360deg,
            rgb(155 155 155) 0%,
            rgb(255 255 255) 100%
          );
        background-clip: text !important;
      }

      .time {
        position: absolute;
        top: 18px;
        left: 120px;
        z-index: 2000;
        width: 64px;
        height: 22px;
        font-size: 30px;
        font-family: DINPro-Regular;
        line-height: 26px;
        user-select: none;
      }

      .date {
        position: absolute;
        top: 12px;
        left: 10px;
        z-index: 2000;
        width: 120px;
        height: 11px;
        font-family: DINPro-Regular;
        font-size: 16px;
        line-height: 14px;
        user-select: none;
      }

      .weekday {
        position: absolute;
        top: 36px;
        left: 55px;
        z-index: 2000;
        width: 120px;
        height: 12px;
        font-size: 16px;
        font-family: DINPro-Regular;
        line-height: 14px;
        user-select: none;
      }
    }

    .layout-body {
      width: 1920px;
      height: 100%;
    }
  }

  .layout-mask {
    z-index: 1000;
    pointer-events: none;
    background-image: url("@/assets/images/mask.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
