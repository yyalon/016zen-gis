import Map from './map/index'
import Drawer from './drawer/index'
import Color from './color/index'
import View from './view/index'
const components = [View, Map, Drawer, Color]

function plugin(Vue) {
  if (plugin.installed) {
    return
  }

  plugin.installed = true // install components
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default plugin
export { Map, Drawer, plugin as install }
