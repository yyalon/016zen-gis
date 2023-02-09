import request from '@/utils/request'

export function getAllTile3Ds() {
  return request({
    url: `/v1/fire/tile3d/all`
  })
}

export function addCatalog(data) {
  return request({
    url: `/v1/fire/tile3d/catalog`,
    method: 'post',
    data
  })
}

export function delCatalog(data) {
  return request({
    url: `/v1/fire/tile3d/catalog`,
    method: 'delete',
    data
  })
}

export function editCatalog(data) {
  return request({
    url: `/v1/fire/tile3d/catalog`,
    method: 'put',
    data
  })
}

export function delTile3D(data) {
  return request({
    url: `/v1/fire/tile3d/tiles`,
    method: 'delete',
    data
  })
}

export function saveTile3D(data) {
  const { id } = data.item
  return request({
    url: `/v1/fire/tile3d/tiles`,
    method: id ? 'put' : 'post',
    data
  })
}
