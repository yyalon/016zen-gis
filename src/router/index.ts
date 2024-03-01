import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useNProgress } from '@vueuse/integrations/useNProgress'
import '@/assets/styles/nprogress.scss'

// 路由相关数据
import { asyncRoutesByFilesystem, constantRoutes, constantRoutesByFilesystem } from './routes'
import pinia from '@/store'
import useSettingsStore from '@/store/modules/settings'
import useRouteStore from '@/store/modules/route'
import useUserStore from '@/store/modules/user'

const { isLoading } = useNProgress()

const router = createRouter({
  history: createWebHashHistory(),
  routes: useSettingsStore(pinia).settings.app.routeBaseOn === 'filesystem' ? constantRoutesByFilesystem : (constantRoutes as RouteRecordRaw[]),
})

router.beforeEach(async (to, from, next) => {
  const query: any = to.query
  console.log(1)
  console.log(query)
  if (query.t && query.rt && query.te && query.rte) {
    localStorage.setItem('zen-token', query.t)
    localStorage.setItem('zen-refresh-token', query.rt)
    localStorage.setItem('token-expiration', query.te)
    localStorage.setItem('refresh-token-expiration', query.rte)

    const userStore = useUserStore()
    userStore.setToken({
      token: query.t,
      tokenExpiration: query.te,
    })
    router.push({ query: {} })
  }
  const settingsStore = useSettingsStore()
  const routeStore = useRouteStore()
  settingsStore.settings.app.enableProgress && (isLoading.value = true)
  if (routeStore.isGenerate) {
    if (to.name === 'callback') {
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    await routeStore.generateRoutesAtFilesystem(asyncRoutesByFilesystem)

    // 注册并记录路由数据
    // 记录的数据会在登出时会使用到，不使用 router.removeRoute 是考虑配置的路由可能不一定有设置 name ，则通过调用 router.addRoute() 返回的回调进行删除
    const removeRoutes: Function[] = []
    routeStore.flatRoutes.forEach((route) => {
      if (!/^(https?:|mailto:|tel:)/.test(route.path)) {
        removeRoutes.push(router.addRoute(route as RouteRecordRaw))
      }
    })
    if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
      routeStore.flatSystemRoutes.forEach((route) => {
        removeRoutes.push(router.addRoute(route as RouteRecordRaw))
      })
    }
    routeStore.setCurrentRemoveRoutes(removeRoutes)
    // 动态路由生成并注册后，重新进入当前路由
    next({
      path: to.path,
      query: to.query,
      replace: true,
    })
  }
})

router.afterEach((to, from) => {
  const settingsStore = useSettingsStore()
  settingsStore.settings.app.enableProgress && (isLoading.value = false)
  //   const keepAliveStore = useKeepAliveStore()
  //   settingsStore.settings.app.enableProgress && (isLoading.value = false)
  //   // 设置页面 title
  //   if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
  //     settingsStore.setTitle(to.meta.breadcrumbNeste?.at(-1)?.title ?? to.meta.title)
  //   }
  //   else {
  //     settingsStore.setTitle(to.meta.title)
  //   }
  //   // 判断当前页面是否开启缓存，如果开启，则将当前页面的 name 信息存入 keep-alive 全局状态
  //   if (to.meta.cache) {
  //     const componentName = to.matched.at(-1)?.components?.default.name
  //     if (componentName) {
  //       keepAliveStore.add(componentName)
  //     }
  //     else {
  //       console.warn('该页面组件未设置组件名，会导致缓存失效，请检查')
  //     }
  //   }
  //   // 判断离开页面是否开启缓存，如果开启，则根据缓存规则判断是否需要清空 keep-alive 全局状态里离开页面的 name 信息
  //   if (from.meta.cache) {
  //     const componentName = from.matched.at(-1)?.components?.default.name
  //     if (componentName) {
  //       // 通过 meta.cache 判断针对哪些页面进行缓存
  //       switch (typeof from.meta.cache) {
  //         case 'string':
  //           if (from.meta.cache !== to.name) {
  //             keepAliveStore.remove(componentName)
  //           }
  //           break
  //         case 'object':
  //           if (!from.meta.cache.includes(to.name as string)) {
  //             keepAliveStore.remove(componentName)
  //           }
  //           break
  //       }
  //       // 如果进入的是 reload 页面，则也将离开页面的缓存清空
  //       if (to.name === 'reload') {
  //         keepAliveStore.remove(componentName)
  //       }
  //     }
  //   }
  //   document.documentElement.scrollTop = 0
})

export default router
