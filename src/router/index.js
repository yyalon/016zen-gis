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
        meta: { title: '海域生态环境画像', type: 'gis', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/task/trace',
    component: Layout,
    meta: { gis: true },
    children: [
      {
        path: '/task/trace/',
        name: 'TaskTrace',
        component: () => import('@/views/route'),
        meta: { title: '攻坚战任务指挥调度' },
        children: [
          {
            path: '/gis/task/plan',
            name: '实施方案',
            component: () => import('@/views/gisTask/plan'),
            meta: { title: '实施方案' }
          },
          {
            path: '/gis/task/standing-book',
            name: '重点任务台账',
            component: () => import('@/views/gisTask/standingBook'),
            meta: { title: '重点任务台账' }
          },
          {
            path: '/gis/task/assist',
            name: '驻点帮扶工作',
            component: () => import('@/views/gisTask/assist'),
            meta: { title: '驻点帮扶工作' }
          },
          {
            path: '/gis/task/release',
            name: '任务下达',
            component: () => import('@/views/gisTask/release'),
            meta: { title: '任务下达' }
          },
          {
            path: '/gis/task/plan',
            name: '形势分析会商',
            component: () => import('@/views/gisTask/index'),
            meta: { title: '形势分析会商' }
          }
        ]
      }
    ]
  },
  {
    path: '/policy/trace',
    component: Layout,
    meta: { gis: true },
    children: [
      {
        path: '/policy/trace/',
        name: 'PolicySupport',
        component: () => import('@/views/gisTask/index'),
        meta: { title: '海洋生态保护决策支撑' }
      }
    ]
  },

  {
    path: '/station',
    component: Layout,
    meta: { gis: true },
    children: [
      {
        path: '/station/index',
        hidden: true,
        name: 'Station',
        component: () => import('@/views/gisStation/index'),
        meta: { title: '站点管理' }
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
