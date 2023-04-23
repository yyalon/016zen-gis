import path from 'path-browserify'

export function toAdmin(currentPath: string) {
  window.location.href = `${import.meta.env.VITE_APP_ADMIN_URL}/#${currentPath || '/'}`
}

export function resolveRoutePath(basePath: string, routePath?: string) {
  return basePath ? path.resolve(basePath, routePath ?? '') : routePath ?? ''
}
