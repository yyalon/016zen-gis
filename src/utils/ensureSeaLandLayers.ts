/** 与各 LayerSea* / LayerLand* 中 GeoJsonLayer id 一致；切换污染源自定义底图后可能被移出地图，需重新挂上 */

const SEA_OPERATIONAL_IDS = [2000, 2001, 2002, 2003]
const LAND_OPERATIONAL_IDS = [1100, 1101, 1102, 1103]

export interface SeaLandLayerVisibility {
  sea?: boolean
  land?: boolean
}

function applyIds(
  ids: number[],
  shouldShow: boolean,
  map: any,
  leafletMap: any,
): void {
  for (const id of ids) {
    const ly = map.getLayerById(id)
    if (!ly) {
      continue
    }
    if (!shouldShow) {
      ly.show = false
      continue
    }
    ly.show = true
    try {
      const has = (leafletMap && typeof leafletMap.hasLayer === 'function')
        ? leafletMap.hasLayer(ly)
        : false
      if (leafletMap && !has && typeof leafletMap.addLayer === 'function') {
        leafletMap.addLayer(ly)
      }
      else if (!has && typeof map.addLayer === 'function') {
        map.addLayer(ly)
      }
    }
    catch (_) {
      try {
        map.addLayer(ly)
      }
      catch (_e) {
        /* noop */
      }
    }
  }
}

/**
 * 按左侧工具栏「海域」「陆域」开关恢复图层；关着的类型不因换污染源底图而被强行显示。
 */
export function ensureSeaLandOperationalLayersOnMap(visibility: SeaLandLayerVisibility = {}): void {
  const map = window.$zMap as any
  if (!map || typeof map.getLayerById !== 'function') {
    return
  }
  const leafletMap = map._map || map._leaflet || map
  const seaOn = visibility.sea !== false
  const landOn = visibility.land !== false
  applyIds(SEA_OPERATIONAL_IDS, seaOn, map, leafletMap)
  applyIds(LAND_OPERATIONAL_IDS, landOn, map, leafletMap)
}
