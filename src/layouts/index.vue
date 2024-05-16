<script lang="ts" name="Layout">
import autofit from 'autofit.js'
import dayjs from 'dayjs'
import { area, intersect } from '@turf/turf'

import LayerRivers from './components/layer/Rivers.vue'
import LayerControlUnit from './components/layer/ControlUnit.vue'
import LayerSeaShanghai from './components/layer/SeaShanghai.vue'
import LayerSeaJiangsu from './components/layer/SeaJiangsu.vue'
import LayerSeaZhejiang from './components/layer/SeaZhejiang.vue'
import LayerLandJiangsu from './components/layer/LandJiangsu.vue'
import LayerLandShanghai from './components/layer/LandShanghai.vue'
import LayerLandZhejiang from './components/layer/LandZhejiang.vue'
import LayergetMeteorologyStations from './components/layer/MeteorologyStations.vue'
import LayerReservoirs from './components/layer/Reservoirs.vue'
import LayerRiverChannels from './components/layer/RiverChannels.vue'

import GraphSwitcher from './components/GraphSwitcher.vue'
import GraphOutfall from './components/graph/Outfall.vue'
import GraphRiver from './components/graph/River.vue'
import GraphOcean from './components/graph/Ocean.vue'
import GraphBiology from './components/graph/Biology.vue'
import GraphMeteorology from './components/graph/Meteorology.vue'

import Toolbar from './components/Toolbar.vue'
import settings from '@/settings.default'
import { toAdmin } from '@/utils/index'
import 'dayjs/locale/zh-cn'

import geoApi from '@/api/modules/layers'
import apiData from '@/api/modules/data'

export default {
  components: {
    LayerControlUnit,
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
    LayergetMeteorologyStations,
    LayerReservoirs,
    LayerRiverChannels,
    LayerRivers,
    GraphMeteorology,
    Toolbar,
  },
  data() {
    return {
      loading: null,
      activeGraph: 'river',
      settings,
      buttons: [
        {
          name: '水库监测',
          value: 'layerReservoirs',
          command: 'toggleLayer',
          visibility: false,
          icon: 'reservoir',
        },
        {
          name: '河道监测',
          value: 'layerRiverChannels',
          command: 'toggleLayer',
          visibility: false,
          icon: 'river-channel',
        },
        {
          name: '气象站',
          value: 'layerMeteorologyStations',
          command: 'toggleLayer',
          visibility: false,
          icon: 'meteorology-station',
        },
        {
          name: '控制单元',
          value: 'controlUnit',
          command: 'toggleLayer',
          visibility: false,
          icon: 'river',
        },
        {
          name: '河流',
          value: 'layerRiver',
          icon: 'river',
          visibility: false,
          showSubButtons: false,
          subButtons: [
            {
              name: '一级河流',
              value: '1p',
              active: false,
              command: 'switchRiverLayer',
              visibility: false,
            },
            {
              name: '二级，三级河流',
              value: '23p',
              active: false,
              command: 'switchRiverLayer',
              visibility: false,
            },
            {
              name: '四级河流',
              value: '4',
              active: false,
              command: 'switchRiverLayer',
              visibility: false,
              icon: 'river',
            },
            {
              name: '五级河流',
              value: '5',
              active: false,
              command: 'switchRiverLayer',
              visibility: false,
            },
          ],
        },
        {
          name: '海域',
          value: 'sea',
          command: 'toggleLayer',
          visibility: true,
          icon: 'polygon',
        },
        {
          name: '陆域',
          value: 'land',
          command: 'toggleLayer',
          visibility: true,
          icon: 'polygon',
        },
      ],
      visibilities: {
        sea: true,
        land: true,
        layerReservoirs: false,
        layerRiverChannels: false,
        layergetMeteorologyStations: false,
        layerRiver: false,
        controlUnit: false,
      },
      riverLevel: null,
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
    autofit.init({
      el: '.layout',
      dw: 1920,
      dh: 1080,
      resize: true,
      // ignore: ['.leaflet-container'],
      ignore: [],
      transition: 0,
      delay: 0,
    })
    // getGeoSerevrLayers().then((res) => {
    //   console.error(res)
    // })

    // this.loading = this.$loading({
    //   lock: true,
    //   text: '正在加载地图数据...',
    //   spinner: 'el-icon-loading',
    //   background: '#100d17e3',
    // })
    // layers.forEach((layer: any) => {
    //   const tileLayer = new window.$ZMap.layer.WmsLayer({
    //     name: layer.name,
    //     type: 'wms',
    //     url: 'http://10.103.10.80/geoserver/sea/wms',
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

    // setTimeout(async () => {
    //   await this.initSeaWaterQualityAreas()
    // }, 3000)
  },
  unmounted() {},
  methods: {
    mapLoaded() {
      window.$zMap.on(window.$ZMap.EventType.zoom, () => {})
    },
    toLogin() {
      toAdmin('/logout')
    },
    toAdminIndex() {
      toAdmin('')
    },
    moment(date: any, format: any) {
      return date ? dayjs(date).locale('zh-cn').format(format) : dayjs().locale('zh-cn').format(format)
    },
    excuteCommand(data: any) {
      switch (data.command) {
        case 'toggleLayer':
          this.toggleLayer(data.value)
          break
        case 'switchRiverLayer':
          this.switchRiverLayer(data.value)
      }
    },
    switchRiverLayer(riverLevel: any) {
      if (riverLevel !== this.riverLevel) {
        this.riverLevel = riverLevel
        this.visibilities.layerRiver = true
        this.buttons.forEach((button) => {
          if (button.value === 'layerRiver') {
            button.visibility = true
            button.subButtons?.forEach((subButton) => {
              subButton.active = false
              if (subButton.value === riverLevel) {
                subButton.active = true
              }
            })
          }
        })
      } else {
        this.riverLevel = null
        this.visibilities.layerRiver = false
        this.buttons.forEach((button) => {
          if (button.value === 'layerRiver') {
            button.visibility = false
            button.subButtons?.forEach((subButton) => {
              subButton.active = false
            })
          }
        })
      }
    },
    toggleLayer(name: keyof typeof this.visibilities) {
      const key: keyof typeof this.visibilities = name
      this.visibilities[key] = !this.visibilities[key]
      this.buttons.forEach((button) => {
        if (button.value === name) {
          button.visibility = !button.visibility
        }
      })
    },
    async initSeaWaterQualityAreas() {
      const provinces: any = {
        shanghai: window.$zMap.getLayerById(2000),
        jiangsu: window.$zMap.getLayerById(2001),
        zhejiang: window.$zMap.getLayerById(2002),
      }

      const { data } = await geoApi.getGeoSerevrLayers()
      const layers = data.layers.layer
      const objLayers: any = {}
      const objAreas: any = {}

      const aryFinal: any = []

      layers.forEach((layer: any) => {
        if (layer.name.includes('summer') || layer.name.includes('spring') || layer.name.includes('autumn') || layer.name.includes('average')) {
          // if (layer.name.includes('hxlsy') && (layer.name.includes('2018') || layer.name.includes('2017'))) {
          objLayers[layer.name] = null
        }
      })

      layers.forEach((layer: any) => {
        if (layer.name.includes('summer') || layer.name.includes('spring') || layer.name.includes('autumn') || layer.name.includes('average')) {
          // if (layer.name.includes('hxlsy') && (layer.name.includes('2018') || layer.name.includes('2017'))) {
          const objResult: any = {
            shanghai: [],
            jiangsu: [],
            zhejiang: [],
          }
          const queryMapServer = new window.$ZMap.query.QueryGeoServer({
            url: 'http://10.103.10.80/geoserver/sea/ows',
            layer: `sea:${layer.name}`,
          })

          queryMapServer.query({
            success: async (result: any) => {
              const { count, geojson } = result
              if (count > 0) {
                geojson.features.forEach((feature: any) => {
                  for (const key in provinces) {
                    let featureSea = null
                    const geojsonSea = provinces[key].toGeoJSON()
                    geojsonSea.features.forEach((feature: any) => {
                      if (feature.geometry.type === 'Polygon') {
                        featureSea = feature
                        objAreas[key] = window.$ZMap.MeasureUtil.formatArea(area(featureSea))
                      }
                    })
                    if (featureSea) {
                      const result = intersect(featureSea, feature)
                      if (result) {
                        objResult[key].push({ area: area(result), value: feature.properties.Value })
                      }
                    }
                  }
                })
                objLayers[layer.name] = objResult
                let ok = true
                for (const key in objLayers) {
                  if (!objLayers[key]) {
                    ok = false
                  }
                }
                if (ok) {
                  // console.log('shanghai', objAreas.shanghai, 'zhejiang', objAreas.zhejiang, 'jiangsu', objAreas.jiangsu)

                  for (const layerName in objLayers) {
                    let type = ''
                    let year = ''
                    let season = ''
                    if (layerName.includes('average')) {
                      season = 'average'
                      year = layerName.slice(-11, -7)
                      type = layerName.slice(0, -11)
                    } else {
                      season = layerName.slice(-6)
                      year = layerName.slice(-10, -6)
                      type = layerName.slice(0, -10)
                    }
                    for (const province in objLayers[layerName]) {
                      // let area1 = 0
                      objLayers[layerName][province].forEach((item: any) => {
                        // area1 += item.area
                        aryFinal.push({ type, year, season, province, area: item.area.toFixed(2), level: item.value })
                      })
                    }
                  }

                  await apiData.initSeaWaterQualityAreas(aryFinal)
                }
              }
            },
          })
        }
      })
    },
  },
}
</script>

<template>
  <div class="layout">
    <div class="layout-background" />
    <ZMap @map-loaded="mapLoaded" />
    <div class="layout-mask" />
    <LayerControlUnit v-if="visibilities.controlUnit" />
    <LayerSeaShanghai v-if="visibilities.sea" />
    <LayerSeaZhejiang v-if="visibilities.sea" />
    <LayerSeaJiangsu v-if="visibilities.sea" />
    <LayerLandJiangsu v-if="visibilities.land" />
    <LayerLandShanghai v-if="visibilities.land" />
    <LayerLandZhejiang v-if="visibilities.land" />
    <LayergetMeteorologyStations v-if="visibilities.layergetMeteorologyStations" />
    <LayerReservoirs v-if="visibilities.layerReservoirs" />
    <LayerRiverChannels v-if="visibilities.layerRiverChannels" />
    <LayerRivers v-if="visibilities.layerRiver" :river-level="riverLevel" />
    <Toolbar :buttons="buttons" @excute-command="excuteCommand" />
    <!-- <LayerAllBorderMask /> -->
    <div class="layout-container">
      <div class="header">
        <div class="left">
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
        <div class="center">
          <div class="title">
            {{ settings.app.abbreviation }}
          </div>
          <div class="title-en">
            {{ settings.app.titleEn }}
          </div>
        </div>
        <div class="right">
          <div class="setting" @click="toAdminIndex()">
            <el-icon>
              <svg-icon name="ep:setting" />
            </el-icon>
          </div>
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

    .header {
      width: 100%;
      height: 100px;
      pointer-events: all;
      display: flex;

      .left {
        width: 200px;

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

      .center {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
          font-family: SourceHanSansCN-Regular;
          font-weight: bold;
          font-size: 36px;
          text-align: center;
          text-shadow: rgb(11 113 230 / 0%) 1px 1px 1px;
          user-select: none;
        }

        .title-en {
          height: 26px;
          clip-path: inset(1px 0);
          font-family: SourceHanSansCN-Regular;
          font-size: 20px;
          color: transparent;
          text-align: center;
          user-select: none;
          background: linear-gradient(360deg, rgb(155 155 155) 0%, rgb(255 255 255) 100%);
          background-clip: text !important;
        }
      }

      .right {
        width: 200px;

        .setting {
          padding: 20px;
          font-size: 26px;
          text-align: right;
          cursor: pointer;

          :hover {
            color: silver;
          }
        }
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
    background-image: url('@/assets/images/mask.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
