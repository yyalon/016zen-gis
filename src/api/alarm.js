import request from '@/utils/request'

export function getAlarms(params) {
  return request({
    url: `/v1/fire/alarms`,
    params
  })
}

export function getAlarmConfirmTypes() {
  return request({
    url: `/v1/fire/ack/type`
  })
}

export function handleAlarm(data) {
  return request({
    url: `/v1/fire/alarm`,
    method: 'put',
    data
  })
}

export function getAlarmsByDate(params) {
  return request({
    url: `/v1/fire/alarm/stat/bydate`,
    params
  })
}

export function getAlarmsByDevice(params) {
  return request({
    url: `/v1/fire/alarm/stat/bydevice`,
    params
  })
}

export function getAlarmTypes() {
  return request({
    url: `/v1/fire/alarm/type`
  })
}
