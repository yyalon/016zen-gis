import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    name: 'GisIndex',
    redirect: '/gis/dashboard',
    meta: { gis: true },
    children: [
      {
        path: '/gis/dashboard',
        name: 'GisDashboard',
        component: () => import('@/views/gisDashboard/index'),
        meta: { type: 'gis', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Layout
  },
  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.beforeEach((to, from, next) => {
  if (
    store.state.user.user &&
    store.state.user.user.userName !== 'admin' &&
    to.meta.configable
  ) {
    store.dispatch('zen/getMenuPerms').then(data => {
      const perms = data.perms
      if (to.meta && to.meta.key) {
        if (perms.findIndex(perm => perm.permId === to.meta.key) === -1) {
          next('/401')
        } else {
          next()
        }
      } else {
        next()
      }
    })
  } else {
    next()
  }
  next()
})

export default router
