import type { App } from 'vue'
import ZMap from './ZMap/index.vue'

const components: any = [ZMap]

export function setupZhi(app: App<Element>) {
  const files: any = import.meta.glob('./*/*.ts', { eager: true })
  Object.keys(files).forEach((fileName) => {
    app.use(files[fileName].default)
  })
  components.forEach((component: any) => {
    app.component(component.name, component)
  })
}
