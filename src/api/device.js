import request from '@/utils/request'

// 野保相机列表及相机今日视频数
export function getDeviceLog(params) {
  return request({
    url: `/v1/fire/device/zlyb/${params.id}/log`,
    params
  })
}

// 野保相机列表及相机今日视频数
export function getDeviceStat(data) {
  return request({
    url: `/v1/fire/device/stat`,
    method: 'post',
    data
  })
}

// 获取硬件设备列表
export function getDevices(params) {
  return request({
    url: `/v1/fire/device/list`,
    params
  })
}

// 获取硬件设备详情
export function getDevice({ id }) {
  return request({
    url: `/v1/fire/device/zlyb/${id}`
  })
}

// 删除硬件设备
export function delDevice(id) {
  return request({
    url: `/v1/fire/device/zlyb/${id}`,
    method: 'delete'
  })
}

export function saveDevice(data) {
  return request({
    url:
      data.item && data.item.id
        ? `/v1/fire/device/zlyb/${data.item.id}`
        : '/v1/fire/device/zlyb',
    method: data.item && data.item.id ? 'put' : 'post',
    data
  })
}

// 发送云台命令
export function sendPtzCmd(data) {
  return request({
    url: `/v1/fire/live/ptzcmd`,
    method: 'put',
    data
  })
}

// 获取预置位列表
export function getPdpList(params) {
  return request({
    url: `/v1/fire/live/pdplist`,
    params
  })
}

// 添加预置位
export function addPdp(data) {
  return request({
    url: `/v1/fire/live/addpdp`,
    method: 'post',
    data
  })
}

export function startLive(data) {
  return request({
    url: `/v1/fire/live/start`,
    method: 'post',
    data
  })
}

export function stopLive(data) {
  return request({
    url: `/v1/fire/live/stop`,
    method: 'post',
    data
  })
}

export function getMonitor(query) {
  return request({
    url: `/v1/fire/live/devices`,
    query
  })
}

export function getCameras() {
  return request({
    url: `/v1/fire/device/camera`
  })
}

export function getCamera(id) {
  return request({
    url: `/v1/fire/device/camera/${id}`
  })
}

export function saveCameras(data) {
  return request({
    url: `/v1/fire/device/camera`,
    method: 'post',
    data
  })
}

export function delCameras(id) {
  return request({
    url: `/v1/fire/device/camera/${id}`,
    method: 'delete'
  })
}

export function getSoldier(timelineId) {
  return request({
    url: `/v1/emergency/timeline/${timelineId}/users`
  })
}

export function getSoldierTrack(timelineId, userId = 1) {
  return request({
    url: `/v1/emergency/user/${userId}/timeline/${timelineId}/track`
  })
}
