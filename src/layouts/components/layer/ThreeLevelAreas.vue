<script>
import eventBus from '@/utils/eventBus'
import {
  EUTROPHICATION_LEVEL1_COLOR,
  EUTROPHICATION_THREE_LEVEL_STYLE_EVENT,
  THREE_LEVEL_AREAS_RESET_DEFAULT_STYLE_EVENT,
  latestThreeLevelEutrophicationRegionColors,
} from '@/utils/eutrophicationFlow'

let _layer = null

/** 与 GeoJsonLayer 初始 symbol.styleOptions 一致 */
const THREE_LEVEL_AREAS_INITIAL_HEX = '#ffff56'

const THREE_LEVEL_DEFAULT_FILL_OPACITY = 0.2
const THREE_LEVEL_EUTROPHICATION_FILL_OPACITY = 0.5

/** GeoJSON name 如「陆域影响区」→ 接口 region 键「陆域」 */
function featureNameToApiRegion(name) {
  if (!name || typeof name !== 'string') {
    return null
  }
  if (name.includes('陆域')) {
    return '陆域'
  }
  if (name.includes('近岸')) {
    return '近岸'
  }
  if (name.includes('离岸')) {
    return '离岸'
  }
  return null
}

function applyEutrophicationRegionColorsToLayer(layer, regionHexMap) {
  if (!layer || typeof layer.getGraphics !== 'function') {
    return
  }
  const graphics = layer.getGraphics()
  if (!graphics || !graphics.length) {
    return
  }
  const map = (regionHexMap && typeof regionHexMap === 'object') ? regionHexMap : null
  for (let i = 0; i < graphics.length; i++) {
    const g = graphics[i]
    const featureName = g.attr?.name
    const regionKey = featureNameToApiRegion(featureName)
    let hex = EUTROPHICATION_LEVEL1_COLOR
    if (regionKey && map && map[regionKey]) {
      hex = map[regionKey]
    }
    g.setStyle({
      fillColor: hex,
      color: hex,
      outlineColor: hex,
      fillOpacity: THREE_LEVEL_EUTROPHICATION_FILL_OPACITY,
    })
  }
}

function applyInitialDefaultStyleToLayer(layer) {
  if (!layer || typeof layer.getGraphics !== 'function') {
    return
  }
  const graphics = layer.getGraphics()
  if (!graphics || !graphics.length) {
    return
  }
  const hex = THREE_LEVEL_AREAS_INITIAL_HEX
  for (let i = 0; i < graphics.length; i++) {
    graphics[i].setStyle({
      fillColor: hex,
      color: hex,
      outlineColor: hex,
      fillOpacity: THREE_LEVEL_DEFAULT_FILL_OPACITY,
    })
  }
}

export default {
  async mounted() {
    eventBus.on(EUTROPHICATION_THREE_LEVEL_STYLE_EVENT, this.onEutrophicationThreeLevelStyle)
    eventBus.on(THREE_LEVEL_AREAS_RESET_DEFAULT_STYLE_EVENT, this.onThreeLevelAreasResetDefaultStyle)
    this.showLayer()
  },
  beforeUnmount() {
    eventBus.off(EUTROPHICATION_THREE_LEVEL_STYLE_EVENT, this.onEutrophicationThreeLevelStyle)
    eventBus.off(THREE_LEVEL_AREAS_RESET_DEFAULT_STYLE_EVENT, this.onThreeLevelAreasResetDefaultStyle)
  },
  unmounted() {
    if (_layer) {
      _layer.show = false
    }
  },
  methods: {
    onThreeLevelAreasResetDefaultStyle() {
      if (_layer) {
        applyInitialDefaultStyleToLayer(_layer)
      }
    },
    onEutrophicationThreeLevelStyle(payload) {
      const regionColors = payload?.regionColors
      if (regionColors && typeof regionColors === 'object' && _layer) {
        applyEutrophicationRegionColorsToLayer(_layer, regionColors)
        return
      }
      /** 兼容旧事件：单一 color */
      const hex = payload?.color
      if (hex && typeof hex === 'string' && _layer) {
        const map = { 陆域: hex, 近岸: hex, 离岸: hex }
        applyEutrophicationRegionColorsToLayer(_layer, map)
      }
    },
    showLayer() {
      if (_layer) {
        _layer.show = true
      }
      else {
        const loading = this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })

        const tileLayer = new window.$ZMap.layer.GeoJsonLayer({
          /** 高于 PollutantSections 栅格（overlayPane 内为 0），避免区划面被污染源影像盖住 */
          zIndex: 360,
          name: 'layerThreeLevelAreas',
          url: '/file/json/three_level_areas.geojson',
          symbol: {
            styleOptions: {
              width: 3,
              color: THREE_LEVEL_AREAS_INITIAL_HEX,
              fillColor: THREE_LEVEL_AREAS_INITIAL_HEX,
              fillOpacity: THREE_LEVEL_DEFAULT_FILL_OPACITY,
              outlineColor: THREE_LEVEL_AREAS_INITIAL_HEX,
              opacity: 1,
              outlineWidth: 2,
            },
          },
        })
        window.$zMap.addLayer(tileLayer)
        tileLayer.on(window.$ZMap.EventType.load, (e) => {
          setTimeout(() => {
            e.graphics.forEach((graphic) => {
              graphic.bindTooltip(null, {
                className: 'custom_tooltip',
              })
              graphic.on(window.$ZMap.EventType.tooltipopen, async (e) => {
                e.target.setTooltipContent(e.target.attr.name)
              })
            })
            if (latestThreeLevelEutrophicationRegionColors.current) {
              applyEutrophicationRegionColorsToLayer(tileLayer, latestThreeLevelEutrophicationRegionColors.current)
            }
            tileLayer.show = true
            loading.close()
          }, 500)
        })
        _layer = tileLayer
      }
    },
  },
}
</script>

<template>
  <div />
</template>

<style>
.label-river-name {
  background: #ffc500cf;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>

<style lang="scss" scoped>
.filters {
  padding: 10px;

  :deep(.el-select) {
    margin-right: 10px;
    min-width: 140px;

    &:hover .el-input__wrapper {
      box-shadow: none;
      border: 1px solid #72b3f0;
    }

    .el-input__wrapper {
      border: 1px solid #64b4ff;
      background: #070e14;
      color: #64b4ff;
      box-shadow: none;
    }

    .el-input__inner {
      cursor: pointer;
      color: #64b4ff;
    }
  }
}
</style>
