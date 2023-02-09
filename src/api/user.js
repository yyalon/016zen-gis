import request from '@/utils/request'

export function getPermissions() {
  return request({
    url: '/admin/base/comm/permmenu'
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/base/comm/person'
  })
}

export function refreshToken(token) {
  return request({
    url: '/admin/base/open/refreshToken',
    params: {
      refreshToken: token
    }
  })
}
