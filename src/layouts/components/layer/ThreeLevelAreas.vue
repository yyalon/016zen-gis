<script>
import { featureCollection, intersect, point, voronoi } from '@turf/turf'
import eventBus from '@/utils/eventBus'
import {
  EUTROPHICATION_THREE_LEVEL_STYLE_EVENT,
  THREE_LEVEL_AREAS_RESET_DEFAULT_STYLE_EVENT,
  latestThreeLevelEutrophicationResults,
} from '@/utils/eutrophicationFlow'

let _layer = null
let _interpolatedLayer = null
let _baseGeojson = null

/** 与 GeoJsonLayer 初始 symbol.styleOptions 一致 */
const THREE_LEVEL_AREAS_INITIAL_HEX = '#ffff56'

const THREE_LEVEL_DEFAULT_FILL_OPACITY = 0.2
const THREE_LEVEL_EUTROPHICATION_FILL_OPACITY = 0.5

const LEVEL_COLORS = {
  1: '#FFFFFF',
  2: '#03FF00',
  3: '#FFFF00',
  4: '#FFBF00',
  5: '#FF0000',
}

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
    if (_interpolatedLayer) {
      _interpolatedLayer.show = false
    }
  },
  methods: {
    onThreeLevelAreasResetDefaultStyle() {
      if (_layer) {
        applyInitialDefaultStyleToLayer(_layer)
      }
      if (_interpolatedLayer) {
        _interpolatedLayer.show = false
      }
    },
    async onEutrophicationThreeLevelStyle(payload) {
      const results = payload?.results
      let interpolated = false
      if (results && Array.isArray(results) && results.length > 0) {
        // We have results with points, do interpolation
        interpolated = await this.generateInterpolatedLayer(results)

        if (interpolated) {
          // Hide the fill of the base layer, keep outline
          if (_layer && typeof _layer.getGraphics === 'function') {
            const graphics = _layer.getGraphics()
            for (let i = 0; i < graphics.length; i++) {
              graphics[i].setStyle({
                fillOpacity: 0,
                color: '#ffffff',
                outlineColor: '#ffffff',
              })
            }
          }
        }
      }

      if (!interpolated) {
        if (_interpolatedLayer) {
          _interpolatedLayer.show = false
        }
      }
    },
    async generateInterpolatedLayer(results) {
      try {
        // Filter valid points
        const validPoints = results.filter(r => r.longitude && r.latitude)
        if (validPoints.length < 3) {
          return false
        }

        // Check if we use comprehensiveIndex or level
        const useIndex = validPoints.some(r => r.comprehensiveIndex !== undefined && r.comprehensiveIndex !== null)

        const features = validPoints.map((r) => {
          let val = 0
          if (useIndex) {
            val = r.comprehensiveIndex || 0
          }
          else {
            val = r.level || 1
          }
          return point([r.longitude, r.latitude], { value: val })
        })

        const points = featureCollection(features)
        const bbox = [
          120.4229354945451,
          26.814115686995695,
          123.44629675000647,
          31.88615602878212,
        ]

        let baseGeojson = _baseGeojson
        if (!baseGeojson) {
          try {
            const res = await fetch('/file/json/three_level_areas.geojson')
            baseGeojson = await res.json()
            _baseGeojson = baseGeojson
          }
          catch (e) {
            console.error('Failed to fetch base geojson', e)
          }
        }

        const options = { bbox }
        const voronoiPolygons = voronoi(points, options)

        const clippedFeatures = []
        voronoiPolygons.features.forEach((feature, i) => {
          if (!feature) {
            return // skip coincident points
          }

          const val = points.features[i].properties.value
          let level = 1
          if (useIndex) {
            if (val <= 0.2) {
              level = 1
            }
            else if (val <= 0.4) {
              level = 2
            }
            else if (val <= 0.6) {
              level = 3
            }
            else if (val <= 0.8) {
              level = 4
            }
            else {
              level = 5
            }
          }
          else {
            if (val <= 1) {
              level = 1
            }
            else if (val <= 2) {
              level = 2
            }
            else if (val <= 3) {
              level = 3
            }
            else if (val <= 4) {
              level = 4
            }
            else {
              level = 5
            }
          }

          feature.properties = { level }

          if (baseGeojson && baseGeojson.features) {
            baseGeojson.features.forEach((clipPoly) => {
              try {
                const clipped = intersect(feature, clipPoly)
                if (clipped) {
                  clipped.properties = { level }
                  clippedFeatures.push(clipped)
                }
              }
              catch (e) {
                // ignore topological errors
              }
            })
          }
          else {
            clippedFeatures.push(feature)
          }
        })

        const resultGeojson = featureCollection(clippedFeatures)

        if (!_interpolatedLayer) {
          _interpolatedLayer = new window.$ZMap.layer.GeoJsonLayer({
            zIndex: 359,
            name: 'layerThreeLevelAreasInterpolated',
            symbol: {
              styleOptions: {
                fill: true,
                fillOpacity: THREE_LEVEL_EUTROPHICATION_FILL_OPACITY,
                outline: false,
              },
              callback: (attr) => {
                const level = attr.level || 1
                return {
                  fillColor: LEVEL_COLORS[level] || LEVEL_COLORS[1],
                }
              },
            },
          })
          window.$zMap.addLayer(_interpolatedLayer)
          _interpolatedLayer.on(window.$ZMap.EventType.load, () => {
            _interpolatedLayer.show = true
          })
        }

        _interpolatedLayer.load({ data: resultGeojson })
        return true
      }
      catch (e) {
        console.error('Interpolation failed:', e)
        return false
      }
    },
    showLayer() {
      if (_layer) {
        applyInitialDefaultStyleToLayer(_layer)
        _layer.show = true
        if (latestThreeLevelEutrophicationResults.results) {
          this.onEutrophicationThreeLevelStyle({
            results: latestThreeLevelEutrophicationResults.results,
          })
        }
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
            if (latestThreeLevelEutrophicationResults.results) {
              this.onEutrophicationThreeLevelStyle({
                results: latestThreeLevelEutrophicationResults.results,
              })
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
