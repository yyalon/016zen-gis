import request from '@/utils/request'

export function getNaturalReserves() {
  return request({
    url: '/admin/data/natural-reserve/list',
    method: 'POST'
  })
}

export function getRedTides() {
  return request({
    url: '/admin/data/red-tide/list',
    method: 'POST'
  })
}

export function getSewageOutfallInfo(params) {
  return request({
    url: `/admin/data/sewage-outfall/info`,
    params
  })
}
export function getSewageOutfall(data) {
  return request({
    url: '/admin/data/sewage-outfall/page',
    method: 'POST',
    data
  })
}

export function getSewageOutfalls() {
  return request({
    url: '/admin/data/sewage-outfall/list',
    method: 'POST'
  })
}

export function getRenovationTasks(data) {
  return request({
    url: '/admin/data/environmental-renovation/page',
    method: 'POST',
    data
  })
}
export function getWaterQualityRecords(data) {
  return request({
    url: '/admin/data/water-quality/page',
    method: 'POST',
    data
  })
}

export function getWaterQualityStations(data) {
  return request({
    url: '/admin/data/water-quality/stations',
    method: 'POST',
    data
  })
}

export function getGjzWaterQualityStations(data) {
  return request({
    url: '/admin/data/water-quality/gjz',
    method: 'POST',
    data
  })
}
export function getRiverSection(params) {
  return request({
    url: `/admin/data/river-section/info`,
    params
  })
}

export function getRiverSections() {
  return request({
    url: '/admin/data/river-section/list',
    method: 'POST'
  })
}

export function getPollutions(data) {
  return request({
    url: '/admin/data/outfall-area/page',
    method: 'POST',
    data
  })
}

export function getOutfallAreas(data) {
  return request({
    url: '/admin/data/outfall-area/list',
    method: 'POST',
    data
  })
}
