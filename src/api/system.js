import request from '@/utils/request'

export function getOutfallAreas() {
  return request({
    url: '/admin/data/outfall-area/list',
    method: 'POST'
  })
}

export function getStations() {
  return request({
    url: '/admin/system/station/list',
    method: 'POST'
  })
}

export function getStationDetails(id) {
  return request({
    url: `/app/system/station/${id}/details`,
    method: 'POST'
  })
}

export function getStationSensorData(id) {
  return request({
    url: `/app/system/station/${id}/sensor/data`,
    method: 'POST'
  })
}
