<script lang="ts" name="Layout">
import autofit from 'autofit.js'
import dayjs from 'dayjs'
import { area, intersect } from '@turf/turf'

import LayerWaterSections from './components/layer/WaterSections.vue'
import LayerRivers from './components/layer/Rivers.vue'
import LayerControlUnit from './components/layer/ControlUnit.vue'
import LayerThreeLevelAreas from './components/layer/ThreeLevelAreas.vue'
import LayerSeaShanghai from './components/layer/SeaShanghai.vue'
import LayerSeaJiangsu from './components/layer/SeaJiangsu.vue'
import LayerSeaZhejiang from './components/layer/SeaZhejiang.vue'
import LayerSeaFujian from './components/layer/SeaFujian.vue'
import LayerLandJiangsu from './components/layer/LandJiangsu.vue'
import LayerLandShanghai from './components/layer/LandShanghai.vue'
import LayerLandZhejiang from './components/layer/LandZhejiang.vue'
import LayerLandFujian from './components/layer/LandFujian.vue'
import LayergerMeteorologyStations from './components/layer/MeteorologyStations.vue'
import LayergerAtmosphereStations from './components/layer/AtmosphereStations.vue'
import LayergerEnterprises from './components/layer/Enterprises.vue'
import LayerReservoirs from './components/layer/Reservoirs.vue'
import LayerCellAbundance from './components/layer/CellAbundance.vue'
import LayerWaterQualityModel from './components/layer/WaterQualityModel.vue'
import LayerPollutionSourceInventory from './components/layer/PollutionSourceInventory.vue'
import LayerRiverChannels from './components/layer/RiverChannels.vue'
import LayerWaterPowerModel from './components/layer/WaterPowerModel.vue'

import GraphSwitcher from './components/GraphSwitcher.vue'
import GraphCockpit from './components/graph/Cockpit.vue'
import GraphOutfall from './components/graph/Outfall.vue'
import GraphRiver from './components/graph/River.vue'
import GraphOcean from './components/graph/Ocean.vue'
import GraphPollutant from './components/graph/Pollutant.vue'
import GraphBiology from './components/graph/Biology.vue'
import GraphMeteorology from './components/graph/Meteorology.vue'

import Toolbar from './components/Toolbar.vue'
import settings from '@/settings.default'
import { toAdmin } from '@/utils/index'
import 'dayjs/locale/zh-cn'

import geoApi from '@/api/modules/layers'
import apiData from '@/api/modules/data'
import eventBus from '@/utils/eventBus'
import {
  THREE_LEVEL_AREAS_RESET_DEFAULT_STYLE_EVENT,
  cancelEutrophicationPolling,
  latestThreeLevelEutrophicationResults,
} from '@/utils/eutrophicationFlow'
import { ensureSeaLandOperationalLayersOnMap } from '@/utils/ensureSeaLandLayers'
import zmapDefaultConfig from '@/lib/Zhi/ZMap/config/default.json'

/** 污染源专题下天地图 vec_z 单独挂 overlayPane，高于栅格(zIndex 0)、低于海域/陆域业务层(约 1100/2000) */
const POLLUTANT_ADMIN_LABEL_LAYER_NAME = '污染源行政区注记'
const POLLUTANT_ADMIN_LABEL_Z_INDEX = 100

export default {
  components: {
    LayerControlUnit,
    LayerThreeLevelAreas,
    GraphSwitcher,
    GraphCockpit,
    GraphOutfall,
    GraphRiver,
    GraphOcean,
    GraphPollutant,
    GraphBiology,
    LayerSeaShanghai,
    LayerSeaJiangsu,
    LayerSeaZhejiang,
    LayerSeaFujian,
    LayerLandJiangsu,
    LayerLandShanghai,
    LayerLandZhejiang,
    LayerLandFujian,
    LayergerMeteorologyStations,
    LayergerAtmosphereStations,
    LayergerEnterprises,
    LayerReservoirs,
    LayerCellAbundance,
    LayerWaterQualityModel,
    LayerWaterPowerModel,
    LayerPollutionSourceInventory,
    LayerRiverChannels,
    LayerRivers,
    GraphMeteorology,
    Toolbar,
    LayerWaterSections,
  },
  data() {
    console.log('test123')
    return {
      abbreviationSrc: './breadcrumb/abbreviation.png',
      loading: null,
      activeGraph: 'cockpit',
      settings,
      buttons: [
        {
          name: '细胞丰度',
          value: 'layerCellAbundance',
          command: 'toggleLayer',
          visibility: false,
          icon: 'reservoir',
        },
        // {
        //   name: '四类污染物',
        //   value: 'layerReservoirs',
        //   command: 'toggleLayer',
        //   visibility: false,
        //   icon: 'reservoir',
        // },
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
          name: '大气站',
          value: 'layerAtmosphereStations',
          command: 'toggleLayer',
          visibility: false,
          icon: 'ep:mostly-cloudy',
        },
        {
          name: '水质模型',
          value: 'layerWaterQualityModel',
          command: 'toggleLayer',
          visibility: false,
          icon: 'ep:monitor',
        },
        {
          name: '污染企业',
          value: 'layerEnterprises',
          command: 'toggleLayer',
          visibility: false,
          icon: 'ep:management',
        },
        {
          name: '控制单元',
          value: 'controlUnit',
          command: 'toggleLayer',
          visibility: false,
          icon: 'river',
        },
        {
          name: '三级分区',
          value: 'threeLevelAreas',
          visibility: false,
          icon: 'river',
          showSubButtons: false,
          subButtons: [
            {
              name: '富营养化评价',
              command: 'eutrophicationUpload',
              value: '',
              active: false,
            },
          ],
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
        {
          name: '污染源清单（总氮）',
          value: 'tnAllMonths',
          command: 'toggleLayer',
          visibility: false,
          icon: 'ep:memo',
        },
        {
          name: '污染源清单（总磷）',
          value: 'tpAllMonths',
          command: 'toggleLayer',
          visibility: false,
          icon: 'ep:memo',
        },
        {
          name: '水动力模型',
          value: 'waterPowerModel',
          command: 'toggleLayer',
          visibility: false,
          icon: 'ep:monitor',
        },
      ],
      visibilities: {
        sea: true,
        land: true,
        layerReservoirs: false,
        layerRiverChannels: false,
        layerMeteorologyStations: false,
        layerAtmosphereStations: false,
        layerEnterprises: false,
        layerRiver: false,
        controlUnit: false,
        threeLevelAreas: false,
        layerCellAbundance: false,
        layerWaterQualityModel: false,
        waterPowerModel: false,
        tnAllMonths: false,
        tpAllMonths: false,
      },
      riverLevels: [],
      riverLevel: undefined as string | undefined,
      riverLevelShow: false,
    }
  },
  watch: {
    activeGraph: {
      deep: true,
      handler(n: string, o: string) {
        if (o === 'pollutant' && n !== 'pollutant') {
          this.applyPollutantBasemap('default')
        }
        if (n === 'pollutant') {
          const run = () => ensureSeaLandOperationalLayersOnMap({
            sea: this.visibilities.sea,
            land: this.visibilities.land,
          })
          this.$nextTick(run)
          window.setTimeout(run, 800)
        }
        // if (n) {
        //   router.push({ query: { graph: n } })
        // }
      },
    },
  },
  async mounted() {
    autofit.init({
      el: '.layout-wrapper',
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
    //     url: 'http://10.245.183.33/geoserver/sea/wms',
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
    eventBus.on('pollutantBasemap', this.onPollutantBasemap as (...args: unknown[]) => void)
    // setTimeout(() => {
    //   const bounds1 = window.$zMap.getLayerById(2000).getBounds()
    //   const bounds2 = window.$zMap.getLayerById(2001).getBounds()
    //   const bounds3 = window.$zMap.getLayerById(2002).getBounds()
    //   const bounds4 = window.$zMap.getLayerById(2003).getBounds()
    //   bounds1.extend(bounds2)
    //   bounds1.extend(bounds3)
    //   bounds1.extend(bounds4)
    //   window.$zMap.fitBounds(bounds1, { padding: [0, 0] })
    // }, 1000)
    // setTimeout(async () => {
    //   await this.initSeaWaterQualityAreas()
    // }, 3000)
  },
  unmounted() {
    eventBus.off('pollutantBasemap', this.onPollutantBasemap as (...args: unknown[]) => void)
  },
  methods: {
    _leafletMapFromZ() {
      const map = window.$zMap as any
      if (!map) {
        return null
      }
      return map._map || map._leaflet || map
    },
    /** 仅 GeoJSON 自定义底图；setPane 纠偏用，不含单独挂接的注记层 */
    _pollutantBasemapTilePaneGeoNames(): string[] {
      return [
        '深蓝底',
        '行政边界',
        '陆域TN底',
        '陆域TN界',
        '陆域TP底',
        '陆域TP界',
      ]
    },
    /** 污染源自定义底图相关图层名；切换前摘除残留（含 programmatic vec_z 注记） */
    _pollutantCustomBasemapGeoNames(): string[] {
      return [...this._pollutantBasemapTilePaneGeoNames(), POLLUTANT_ADMIN_LABEL_LAYER_NAME]
    },
    _removePollutantCustomBasemapOrphans() {
      const zmap = window.$zMap as any
      const leafletMap = this._leafletMapFromZ()
      if (!leafletMap || typeof leafletMap.eachLayer !== 'function') {
        return
      }
      const names = new Set(this._pollutantCustomBasemapGeoNames())
      const toRemove: any[] = []
      leafletMap.eachLayer((ly: any) => {
        const n = ly?.options?.name ?? ly?.name
        if (n && names.has(n)) {
          toRemove.push(ly)
        }
      })
      toRemove.forEach((ly) => {
        try {
          if (zmap && typeof zmap.removeLayer === 'function') {
            zmap.removeLayer(ly)
          }
          else {
            leafletMap.removeLayer(ly)
          }
        }
        catch (_) { /* noop */ }
      })
    },
    /** 污染源矢量自定义底图须在 tilePane，与大气逻辑相同 */
    _ensurePollutantVectorBasemapInTilePane() {
      const leafletMap = this._leafletMapFromZ()
      if (!leafletMap || typeof leafletMap.eachLayer !== 'function') {
        return
      }
      const names = new Set(this._pollutantBasemapTilePaneGeoNames())
      leafletMap.eachLayer((ly: any) => {
        const n = ly?.options?.name ?? ly?.name
        if (!n || !names.has(n) || typeof ly.setPane !== 'function') {
          return
        }
        try {
          ly.setPane('tilePane')
        }
        catch (_) { /* noop */ }
      })
    },
    _ensurePollutantAdminLabelLayer() {
      const map = window.$zMap as any
      const Z = window.$ZMap as any
      if (!map || typeof map.addLayer !== 'function' || !Z?.layer?.TdtLayer) {
        return
      }
      const leafletMap = this._leafletMapFromZ()
      const dup: any[] = []
      if (leafletMap && typeof leafletMap.eachLayer === 'function') {
        leafletMap.eachLayer((ly: any) => {
          const n = ly?.options?.name ?? ly?.name
          if (n === POLLUTANT_ADMIN_LABEL_LAYER_NAME) {
            dup.push(ly)
          }
        })
      }
      dup.forEach((ly) => {
        try {
          map.removeLayer(ly)
        }
        catch (_) { /* noop */ }
      })
      try {
        const ly = new Z.layer.TdtLayer({
          name: POLLUTANT_ADMIN_LABEL_LAYER_NAME,
          layer: 'vec_z',
          key: zmapDefaultConfig.tdtKeys,
          pane: 'overlayPane',
          zIndex: POLLUTANT_ADMIN_LABEL_Z_INDEX,
          show: true,
        })
        map.addLayer(ly)
      }
      catch (err) {
        console.warn('Layout: 污染源行政区注记层添加失败', err)
      }
    },
    /** 污染源专用底图；其它模块保持 default.json 默认（天地图卫星） */
    applyPollutantBasemap(
      mode: 'land' | 'air' | 'default',
      landType?: 'tn' | 'tp',
    ) {
      const map = window.$zMap
      if (!map) {
        return
      }
      this._removePollutantCustomBasemapOrphans()
      let name = '天地图卫星'
      if (mode === 'land') {
        name = landType === 'tp' ? '污染源陆域TP' : '污染源陆域TN'
      }
      else if (mode === 'air') {
        /** 与专题图一致：深蓝底 + 浅灰省界线；行政区注记由 programmatic vec_z（overlayPane）叠加 */
        name = '污染源大气深蓝'
      }
      try {
        map.basemap = name
      }
      catch (err) {
        console.warn('Layout: 底图切换失败', name, err)
      }
      if (mode === 'air' || mode === 'land') {
        this.$nextTick(() => {
          this._ensurePollutantVectorBasemapInTilePane()
          this._ensurePollutantAdminLabelLayer()
          window.setTimeout(() => {
            this._ensurePollutantVectorBasemapInTilePane()
            this._ensurePollutantAdminLabelLayer()
          }, 450)
          const run = () => ensureSeaLandOperationalLayersOnMap({
            sea: this.visibilities.sea,
            land: this.visibilities.land,
          })
          run()
          window.setTimeout(run, 500)
          window.setTimeout(run, 1200)
        })
      }
      else if (mode === 'default') {
        const run = () => ensureSeaLandOperationalLayersOnMap({
          sea: this.visibilities.sea,
          land: this.visibilities.land,
        })
        this.$nextTick(() => {
          run()
          window.setTimeout(run, 400)
        })
      }
    },
    onPollutantBasemap(e: { mode?: string; landType?: string }) {
      const m = e && e.mode
      if (m === 'land' || m === 'air' || m === 'default') {
        const lt = (e && e.landType === 'tp') ? 'tp' : 'tn'
        this.applyPollutantBasemap(m, m === 'land' ? lt : undefined)
      }
    },
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
          break
        case 'toggleThreeLevelAreasToolbar':
          this.onThreeLevelAreasToolbarToggle()
          break
      }
    },
    onThreeLevelAreasToolbarToggle() {
      const wasOn = this.visibilities.threeLevelAreas
      if (wasOn) {
        cancelEutrophicationPolling()
        latestThreeLevelEutrophicationResults.results = null
        eventBus.emit(THREE_LEVEL_AREAS_RESET_DEFAULT_STYLE_EVENT)
      }
      this.toggleLayer('threeLevelAreas')
      const btn = this.buttons.find((b: any) => b.value === 'threeLevelAreas')
      if (btn) {
        btn.showSubButtons = !wasOn
      }
    },
    switchRiverLayer(riverLevel: any) {
      this.riverLevel = riverLevel
      if (!this.riverLevels.includes(riverLevel as never)) {
        this.riverLevels.push(riverLevel as never)
        this.riverLevelShow = true
        this.visibilities.layerRiver = true
        this.buttons.forEach((button) => {
          if (button.value === 'layerRiver') {
            button.visibility = true
            button.subButtons?.forEach((subButton) => {
              if (subButton.value === riverLevel) {
                subButton.active = true
              }
            })
          }
        })
      }
      else {
        this.riverLevelShow = false
        this.riverLevels = this.riverLevels.filter(item => item !== riverLevel)
        this.visibilities.layerRiver = !!this.riverLevels.length
        this.buttons.forEach((button) => {
          if (button.value === 'layerRiver') {
            button.visibility = !!this.riverLevels.length
            button.subButtons?.forEach((subButton) => {
              if (subButton.value === riverLevel) {
                subButton.active = false
              }
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
    toggleLayerClose(name: keyof typeof this.visibilities) {
      const key: keyof typeof this.visibilities = name
      this.visibilities[key] = false
      this.buttons.forEach((button) => {
        if (button.value === name) {
          button.visibility = false
        }
      })
    },
    async initSeaWaterQualityAreas() {
      const provinces: any = {
        shanghai: window.$zMap.getLayerById(2000),
        jiangsu: window.$zMap.getLayerById(2001),
        zhejiang: window.$zMap.getLayerById(2002),
        fujian: window.$zMap.getLayerById(2003),
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
            fujian: [],
          }
          const queryMapServer = new window.$ZMap.query.QueryGeoServer({
            url: 'http://10.245.183.33/geoserver/sea/ows',
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
  <div class="container">
    <div class="layout-wrapper">
      <div class="layout">
        <div class="layout-background" />
        <ZMap @map-loaded="mapLoaded" />
        <LayerControlUnit v-if="visibilities.controlUnit" />
        <LayerThreeLevelAreas v-if="visibilities.threeLevelAreas" />
        <LayerSeaShanghai v-if="visibilities.sea" />
        <LayerSeaZhejiang v-if="visibilities.sea" />
        <LayerSeaJiangsu v-if="visibilities.sea" />
        <LayerSeaFujian v-if="visibilities.sea" />
        <LayerLandJiangsu v-if="visibilities.land" />
        <LayerLandShanghai v-if="visibilities.land" />
        <LayerLandZhejiang v-if="visibilities.land" />
        <LayerLandFujian v-if="visibilities.land" />
        <LayergerMeteorologyStations v-if="visibilities.layerMeteorologyStations" />
        <LayergerAtmosphereStations v-if="visibilities.layerAtmosphereStations" />
        <LayergerEnterprises v-if="visibilities.layerEnterprises" />
        <LayerReservoirs v-if="visibilities.layerReservoirs" />
        <LayerCellAbundance :visible="visibilities.layerCellAbundance" />
        <LayerWaterQualityModel v-if="visibilities.layerWaterQualityModel" />
        <LayerWaterPowerModel v-if="visibilities.waterPowerModel" @close="toggleLayerClose('waterPowerModel')" />
        <LayerPollutionSourceInventory v-if="visibilities.tnAllMonths" image-path="tnAllMonths" :bounds="[13138262.40256834, 3128667.7067795335, 13686187.328218153, 3655897.626244731]" />
        <LayerPollutionSourceInventory v-if="visibilities.tpAllMonths" image-path="tpAllMonths" :bounds="[13138262.40256834, 3128667.7067795335, 13686187.328218153, 3655897.626244731]" />
        <LayerRiverChannels v-if="visibilities.layerRiverChannels" />
        <LayerRivers v-if="visibilities.layerRiver" :river-level="riverLevel" :river-level-show="riverLevelShow" />
        <Toolbar :buttons="buttons" class="custom-toolbar" @excute-command="excuteCommand" />
        <!-- <LayerAllBorderMask /> -->
        <div class="layout-container">
          <div class="header">
            <GraphSwitcher v-model:active-graph="activeGraph">
              <div class="title">
                <!-- <div class="titleBeforeLine" /> -->
                <div class="titleCenter">
                  近岸海域陆海气协同防治可视化智慧决策支持平台
                </div>
                <!-- <div class="titleAfterLine" /> -->
              </div>
            </GraphSwitcher>
          </div>
          <div class="layout-body">
            <LayerWaterSections v-if="activeGraph !== 'ocean' && activeGraph !== 'pollutant'" :active-graph="activeGraph" />
            <GraphCockpit :visible="activeGraph === 'cockpit'" />
            <GraphRiver :visible="activeGraph === 'river'" />
            <GraphOutfall :visible="activeGraph === 'outfall'" />
            <GraphOcean :visible="activeGraph === 'ocean'" />
            <GraphPollutant :visible="activeGraph === 'pollutant'" />
            <GraphBiology :visible="activeGraph === 'biology'" />
            <GraphMeteorology :visible="activeGraph === 'meteorology'" />
          </div>
        </div>
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
.container {
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
  overflow: hidden;
}

.layout-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}

.layout {
  width: 1920px;
  height: 1080px;

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
      overflow: hidden;

      .title {
        position: relative;
        flex-shrink: 0;
        width: 926px;
        height: 100%;
        padding: 15px 0;
        text-align: center;
        margin-left: -57px;
        margin-right: -37px;
        z-index: 1;
        display: flex;

        .titleBeforeLine {
          width: 60px;
          height: 61px;
          position: absolute;
          top: 3px;
          left: -16px;
          background-image: url("@/assets/images/header/union.png");
          transform: rotateY(180deg);
        }

        .titleCenter {
          height: 123px;
          top: 3px;
          background-image: url("@/assets/images/header/abbreviation.png");
          flex: 1;
          background-size: 100% 90px;
          margin-left: 18px;
          margin-right: 0;
          font-family: YouSheBiaoTiHei;
          font-size: 34px;
          font-weight: normal;
          line-height: 44px;
          text-align: center;
          letter-spacing: 1.32px;
          color: #fff;
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

.custom-toolbar {
  bottom: 20px;
}
</style>
