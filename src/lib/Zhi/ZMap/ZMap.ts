import type { App } from 'vue'

import 'leaflet/dist/leaflet.css'
import 'leaflet'
import 'mars2d/dist/mars2d.css'
import * as mars2d from 'mars2d'

declare global {
  interface Window {
    $ZMap: any
    $zMap: any
  }
}

export default {
  install(app: App<Element>) {
    window.$ZMap = mars2d
  },
}
