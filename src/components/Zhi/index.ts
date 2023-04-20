import { App } from 'vue'
import ZMap from './ZMap/index.vue'
const components: any = [ZMap]

export function setupZhi(app: App<Element>) {
  components.forEach((component: any) => {
    app.component(component.name, component)
  })

  const Plugins = require.context('./ZMap', true, /\.ts$/)
  Plugins.keys().forEach((key) => {
    app.use(Plugins(key).default)
  })
}
