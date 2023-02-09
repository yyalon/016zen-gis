const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  user: state => state.user.user,
  grids: state => state.sys.grids,
  perms: state => state.sys.menuPerms
}
export default getters
