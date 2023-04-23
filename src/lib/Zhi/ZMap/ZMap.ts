import type { App } from 'vue'
import * as mars3d from 'mars3d'

export default {
  install(app: App<Element>) {
    app.config.globalProperties.$ZMap = mars3d
    app.config.globalProperties.Cesium = mars3d.Cesium
  },
}
