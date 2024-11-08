import './utils/system.copyright'
import ElementPlus from 'element-plus'
import * as echarts from 'echarts'
import App from './App.vue'
import pinia from './store'
import router from './router'
import useSettingsStore from './store/modules/settings'
import autoScroll from './directives/autoScroll'
import autoScrollGeneral from './directives/autoScrollGeneral'
import { setupZhi } from '@/lib/Zhi'

// 加载 svg 图标
import 'virtual:svg-icons-register'

// 全局样式
import '@/assets/styles/globals.scss'

// 加载 iconify 图标（element plus）
import { downloadAndInstall } from '@/iconify-ep'

declare global {
  interface Window {
    $echarts: any
  }
}

window.$echarts = echarts

const app = createApp(App)

setupZhi(app)
app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.directive('auto-scroll', autoScroll)
app.directive('auto-scroll-general', autoScrollGeneral)
if (useSettingsStore().settings.app.iconifyOfflineUse) {
  downloadAndInstall()
}

app.mount('#app')
