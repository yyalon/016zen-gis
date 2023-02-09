import { getGrids } from '@/api/grid'

const state = {
  menuPerms: []
}

const mutations = {
  SET_GRIDS: (state, grids) => {
    state.grids = grids
  },
  SET_MENU_PERMS: (state, menus) => {
    state.menuPerms = menus
  }
}
const actions = {
  async getGrids({ commit, state }) {
    let grids = []
    if (state.grids && state.grids.length > 0) {
      grids = state.grids
    } else {
      try {
        const { data } = await getGrids()
        if (data.grids && data.grids.length > 0) {
          grids = data.grids
          commit('SET_GRIDS', data.grids)
        }
      } catch (err) {
        console.log(err)
      }
    }
    return new Promise(resolve => {
      resolve({ grids })
    })
  },
  async updateMenuPerms({ commit, state }) {
    const perms = []
    try {
      // const roleId = storeUser.state.user.roleId
      // const query = { roleId, permType: 5 }
      // await getRolePermissions(query).then(res => {
      //   const { code, data } = res
      //   if (code === 0 && data) {
      //     if (data.items) {
      //       perms = data.items
      //       commit('SET_MENU_PERMS', perms)
      //     } else {
      //       perms = []
      //     }
      //   }
      // })
    } catch (err) {
      console.log(err)
    }
    return new Promise(resolve => {
      resolve({ perms })
    })
  },
  async getMenuPerms({ commit, state }) {
    let perms = []
    try {
      if (state.menuPerms && state.menuPerms.length > 0) {
        perms = state.menuPerms
      } else {
        // const query = { roleId, permType: 5 }
        // await getRolePermissions(query).then(res => {
        //   console.warn('获取用户权限')
        //   const { code, data } = res
        //   if (code === 0 && data) {
        //     if (data.items) {
        //       perms = data.items
        //       commit('SET_MENU_PERMS', perms)
        //     } else {
        //       perms = []
        //     }
        //   }
        // })
      }
    } catch (err) {
      console.log(err)
    }
    return new Promise(resolve => {
      resolve({ perms })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
