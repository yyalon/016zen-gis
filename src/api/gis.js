import request from '@/utils/request'

export function planningRoutes(data) {
  return request({
    url: `/v1/fire/lbs/planning/routes`,
    method: 'post',
    data
  })
}

export function subscribeWeather(data) {
  return request({
    url: `/v1/fire/lbs/weather/subscribe`,
    method: 'post',
    data
  })
}

export function unsubscribeWeather(data) {
  return request({
    url: `/v1/fire/lbs/weather/unsubscribe`,
    method: 'post',
    data
  })
}

export function getReverseGeoCode(data) {
  return request({
    url: `/v1/fire/lbs/reverse/geocoding`,
    method: 'post',
    data
  })
}

export function getDrivingPath(data) {
  return request({
    url: `/v1/fire/lbs/driving/path`,
    method: 'post',
    data
  })
}

export function getWeatherReport(params) {
  return request({
    url: `/v1/fire/lbs/weather/report`,
    params
  })
}

export function searchPlace(data) {
  return request({
    url: `/v1/fire/lbs/search/place`,
    method: 'post',
    data
  })
}
