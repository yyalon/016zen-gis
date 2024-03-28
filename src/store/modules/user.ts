import useRouteStore from './route'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const routeStore = useRouteStore()

    const account = ref(localStorage.account ?? '')
    const token = ref(localStorage['zen-token'] ?? '')
    const tokenExpiration = ref(localStorage['token-expiration'] ?? '')
    const isLogin = computed(() => {
      let retn = false
      if (token.value) {
        if (new Date().getTime() < parseInt(tokenExpiration.value) * 1000) {
          retn = true
        }
      }
      return retn
    })

    // 登出
    async function setToken(tokenData: any) {
      token.value = tokenData.token
      tokenExpiration.value = tokenData.tokenExpiration
    }

    // 登出
    async function logout() {
      localStorage.removeItem('account')
      localStorage.removeItem('zen-token')
      localStorage.removeItem('zen-refresh-token')
      localStorage.removeItem('token-expiration')
      localStorage.removeItem('refresh-token-expiration')
      account.value = ''
      token.value = ''
      tokenExpiration.value = ''
      routeStore.removeRoutes()
    }

    return {
      account,
      token,
      isLogin,
      setToken,
      logout,
    }
  },
)

export default useUserStore
