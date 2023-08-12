import { createApp, h } from 'vue'
import type { App } from 'vue'

import 'leaflet/dist/leaflet.css'
import 'leaflet'
import 'mars2d/dist/mars2d.css'
import * as mars2d from 'mars2d'

declare global {
  interface Window {
    $ZMap: any
    $zMap: any
    $Utitls: any
  }
}

function loadComponentContent(target: any, myComponent: any, props: any) {
  props = { ...props, ...{ ref: 'myComponentRef' } }
  const app = createApp({
    render() {
      return h(myComponent, props)
    },
  })

  const div = document.createElement('div')
  const mount = app.mount(div)
  target.myComponentRef = mount.$refs.myComponentRef
  target.app = app
  return mount.$el
}

function unloadComponentContent(target: any) {
  target.app?.unmount(target.myComponentRef)
  delete target.app
  delete target.myComponentRef
}

export default {
  install(app: App<Element>) {
    window.$ZMap = mars2d
    window.$Utitls = {
      loadComponentContent,
      unloadComponentContent,
    }
  },
}
