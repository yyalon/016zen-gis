/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import { useUserStore } from '@/store/modules/user'
import { useRoutesStore } from '@/store/modules/routes'
import { useSettingsStore } from '@/store/modules/settings'
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import { toAdmin } from '@/utils/routes'
import {
  authentication,
  loginInterception,
  // routesWhiteList,
  // supportVisit,
} from '@/config'
import { Router } from 'vue-router'
import { setToken, setRefreshToken, setExpiration } from '@/utils/token'

export function setupPermissions(router: Router) {
  VabProgress.configure({
    easing: 'ease',
    speed: 500,
    trickleSpeed: 200,
    showSpinner: false,
  })
  router.beforeEach(
    async (to: { path: string; query: object }, from: any, next: any) => {
      const query: any = to.query
      if (query.t && query.rt && query.te && query.rte) {
        setToken(query.t)
        setRefreshToken(query.rt)
        setExpiration('token-expiration', query.te)
        setExpiration('refresh-token-expiration', query.rte)
        router.push({ query: {} })
      }
      const {
        getTheme: { showProgressBar },
      } = useSettingsStore()
      const { setRoutes } = useRoutesStore()
      const { token, getUserInfo, setVirtualRoles, resetAll } = useUserStore()

      if (showProgressBar) VabProgress.start()

      let hasToken = token

      if (!loginInterception) hasToken = true

      if (hasToken) {
        try {
          if (loginInterception) {
            await getUserInfo()
          } else {
            await setVirtualRoles()
          }
          // 根据路由模式获取路由并根据权限过滤
          await setRoutes(authentication)
          next()
        } catch (err) {
          console.error('错误拦截:', err)
          await resetAll()
          next(toAdmin('/logout'))
        }
      } else {
        next(toAdmin('/logout'))
      }
    }
  )
  router.afterEach((to: any) => {
    document.title = getPageTitle(to.meta.title)
    if (VabProgress.status) VabProgress.done()
  })
}
