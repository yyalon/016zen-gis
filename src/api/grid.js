import request from '@/utils/request'

export function getGrids(pageno = 1, perpagesize = 1000) {
  return request({
    url: `/v1/fire/grids?pageno=${pageno}&perpagesize=${perpagesize}`,
    method: 'get'
  })
}

export function getGrid(id) {
  return request({
    url: `/v1/fire/grid/${id}`,
    method: 'get'
  })
}

export function delGrid(id) {
  return request({
    url: `/v1/fire/grid/${id}`,
    method: 'delete'
  })
}

export function saveGrid(data) {
  return request({
    url: data.id ? `/v1/fire/grid/${data.id}` : '/v1/fire/grid',
    method: data.id ? 'put' : 'post',
    data
  })
}
