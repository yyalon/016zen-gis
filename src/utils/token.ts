import { storage, tokenTableName, refreshTokenTableName } from '@/config'
import cookie from 'js-cookie'

/**
 * @description 获取token
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTableName)
    } else if ('cookie' === storage) {
      return cookie.get(tokenTableName)
    } else {
      return localStorage.getItem(tokenTableName)
    }
  } else {
    return localStorage.getItem(tokenTableName)
  }
}
/**
 * @description 获取refreshToken
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getRefreshToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(refreshTokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(refreshTokenTableName)
    } else if ('cookie' === storage) {
      return cookie.get(refreshTokenTableName)
    } else {
      return localStorage.getItem(refreshTokenTableName)
    }
  } else {
    return localStorage.getItem(refreshTokenTableName)
  }
}

/**
 * @description 存储token
 * @param token
 * @returns {void|*}
 */
export function setToken(token: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(tokenTableName, token)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(tokenTableName, token)
    } else if ('cookie' === storage) {
      return cookie.set(tokenTableName, token)
    } else {
      return localStorage.setItem(tokenTableName, token)
    }
  } else {
    return localStorage.setItem(tokenTableName, token)
  }
}

/**
 * @description 存储token
 * @param key
 * @param token
 * @returns {void|*}
 */
export function setExpiration(key: string, token: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(key, token)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(key, token)
    } else if ('cookie' === storage) {
      return cookie.set(key, token)
    } else {
      return localStorage.setItem(key, token)
    }
  } else {
    return localStorage.setItem(key, token)
  }
}

/**
 * @description 存储refreshToken
 * @param token
 * @returns {void|*}
 */
export function setRefreshToken(token: string) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(refreshTokenTableName, token)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(refreshTokenTableName, token)
    } else if ('cookie' === storage) {
      return cookie.set(refreshTokenTableName, token)
    } else {
      return localStorage.setItem(refreshTokenTableName, token)
    }
  } else {
    return localStorage.setItem(refreshTokenTableName, token)
  }
}

/**
 * @description 移除token
 * @returns {void|Promise<void>}
 */
export function removeToken() {
  if (storage) {
    if ('localStorage' === storage) {
      localStorage.removeItem('token-expiration')
      localStorage.removeItem('refresh-token-expiration')
      localStorage.removeItem(refreshTokenTableName)
      return localStorage.removeItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else if ('cookie' === storage) {
      cookie.remove(tokenTableName)
      cookie.remove('token-expiration')
      cookie.remove('refresh-token-expiration')
      return cookie.remove(refreshTokenTableName)
    } else {
      localStorage.removeItem('token-expiration')
      localStorage.removeItem('refresh-token-expiration')
      localStorage.removeItem(refreshTokenTableName)
      return localStorage.removeItem(tokenTableName)
    }
  } else {
    localStorage.removeItem('token-expiration')
    localStorage.removeItem('refresh-token-expiration')
    localStorage.removeItem(refreshTokenTableName)
    return localStorage.removeItem(tokenTableName)
  }
}

/**
 * @description 移除refreshToken
 * @returns {void|Promise<void>}
 */
export function removeRefreshToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(refreshTokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else if ('cookie' === storage) {
      return cookie.remove(refreshTokenTableName)
    } else {
      return localStorage.removeItem(refreshTokenTableName)
    }
  } else {
    return localStorage.removeItem(refreshTokenTableName)
  }
}
