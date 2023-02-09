import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken,
  toAdmin,
  setToken,
  setRefreshToken,
  setExpiration
} from '@/utils/auth' 
import getPageTitle from '@/utils/get-page-title'
import store from '@/store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  const { t, rt, te, rte } = to.query
  if (t && rt && te && rte) {
    setToken(t)
    setRefreshToken(rt)
    setExpiration('token', te)
    setExpiration('refreshToken', rte)
    router.push({ query: {} })
  }
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (!store.state.user.user) {
      await store.dispatch('user/getUserInfo')
    }
    next()
    NProgress.done()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      next()
      toAdmin('/login')
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
