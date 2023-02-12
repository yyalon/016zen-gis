const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_INFO = 'userInfo'
const EXPIRATION = '_expiration'
import { adminHost } from '@/config/env'

export function toAdmin(path) {
  window.location.href = adminHost + ('/#' + (path || '/'))
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setRefreshToken(token) {
  return localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function getExpiration(key) {
  return localStorage.getItem(key + EXPIRATION)
}

export function isExpired(key) {
  return (getExpiration(key) || 0) - Date.parse(new Date()) <= 2000
}

export function setExpiration(key, value) {
  return localStorage.setItem(key + EXPIRATION, value)
}

export function setToken(token) {
  return localStorage.setItem(TOKEN_KEY, token)
}

export function removeRefreshToken() {
  return localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY)
}

export function getUser() {
  let user = localStorage.getItem(USER_INFO)
  if (user === 'undefined') user = null
  if (user) {
    user = JSON.parse(user)
  }
  return user
}

export function setUser(user) {
  return localStorage.setItem(USER_INFO, JSON.stringify(user))
}

export function removeUser() {
  return localStorage.removeItem(USER_INFO)
}
