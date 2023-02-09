import { getUserInfo, refreshToken } from '@/api/user'
import {
  getToken,
  getRefreshToken,
  removeRefreshToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  setToken,
  setRefreshToken,
  setExpiration
} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    refreshToken: getRefreshToken(),
    token: getToken(),
    user: getUser()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  // user login
  changeUserInfo({ commit }, userInfo) {
    commit('SET_USER', userInfo)
  },

  logout({ commit }) {
    removeUser()
    removeToken()
    removeRefreshToken()
    resetRouter()
    commit('RESET_STATE')
  },

  // 用户信息
  async getUserInfo({ commit }) {
    const { data } = await getUserInfo()
    commit('SET_USER', data)
    setUser(data)
  },
  async refreshToken({ commit }) {
    const token = getRefreshToken()
    const data = await refreshToken(token)

    setToken(data.token)
    commit('SET_TOKEN', data.token)
    setRefreshToken(data.refreshToken)
    setExpiration('token', data.expire)
    setExpiration('refreshToken', data.refreshExpire)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
