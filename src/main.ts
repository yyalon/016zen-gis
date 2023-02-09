import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import '@/assets/styles/common.scss'
import '@/assets/styles/chart.scss'
import '@/assets/styles/app.scss'
import '@/assets/iconfont/iconfont.css'

import 'mars3d/dist/mars3d.css'

import App from './App.vue'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import _ from 'lodash'

Vue.prototype._ = _

import 'animate.css'

const moment = require('moment')
require('moment/locale/zh-cn')

Vue.use(require('vue-moment'), {
  moment
})

import ZhiUI from '@/components/Zhi/index.js'
Vue.use(ZhiUI)

Vue.use(ElementUI)

import * as echarts from 'echarts'
import 'default-passive-events'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
