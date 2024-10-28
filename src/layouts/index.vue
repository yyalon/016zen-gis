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
import GraphCockpit from './components/graph/Cockpit.vue'
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
    GraphCockpit,
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
      activeGraph: 'cockpit',
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

    this.activeGraph = 'cockpit'

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
      }
      else {
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
                    }
                    else {
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
        <GraphSwitcher v-model:active-graph="activeGraph">
          <div class="title">
            <div class="titleBeforeLine" />
            <img src="/breadcrumb/abbreviation.png">
            <div class="titleAfterLine" />
          </div>
        </GraphSwitcher>
      </div>
      <div class="layout-body">
        <GraphCockpit :visible="activeGraph === 'cockpit'" />
        <GraphRiver :visible="activeGraph === 'river'" />
        <GraphOutfall :visible="activeGraph === 'outfall'" />
        <GraphOcean :visible="activeGraph === 'ocean'" />
        <GraphBiology :visible="activeGraph === 'biology'" />
        <GraphMeteorology :visible="activeGraph === 'meteorology'" />
      </div>
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
    background-color: #071a3f;
  }

  &-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2000;

    .header {
      width: 100%;
      height: 94px;
      padding-bottom: 20px;
      pointer-events: all;
      display: flex;
      justify-content: center;
      background-color: #071a3f;

      .title {
        position: relative;
        flex-shrink: 0;
        width: 690px;
        height: 100%;
        padding: 15px 0;
        text-align: center;
        margin-left: -57px;
        margin-right: -37px;
        z-index: 1;

        .titleBeforeLine {
          width: 60px;
          height: 61px;
          position: absolute;
          top: 3px;
          left: -16px;
          background-image: url("@/assets/images/header/union.png");
          transform: rotateY(180deg);
        }

        .titleAfterLine {
          width: 60px;
          height: 61px;
          position: absolute;
          top: 3px;
          right: -35px;
          background-image: url("@/assets/images/header/union.png");
        }

        img {
          margin-top: -29px;
        }
      }
    }

    .layout-body {
      width: 100%;
      height: calc(100% - 94px);
      position: relative;
      padding-bottom: 6px;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background-color: #071a3f;
      }
    }
  }
}
</style>
