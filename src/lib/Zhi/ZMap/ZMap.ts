import type { App } from 'vue'
import * as mars3d from 'mars3d'

declare global {
  interface Window {
    $ZMap: any
    $zMap: any
    $Cesium: any
  }
}

export default {
  install(app: App<Element>) {
    window.$ZMap = mars3d
    window.$Cesium = mars3d.Cesium
  },
}
