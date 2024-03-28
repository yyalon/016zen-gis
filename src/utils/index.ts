import path from 'path-browserify'

export function toAdmin(currentPath: string) {
  window.location.href = `${import.meta.env.VITE_APP_ADMIN_URL}/#${currentPath || '/'}`
}

export function resolveRoutePath(basePath: string, routePath?: string) {
  return basePath ? path.resolve(basePath, routePath ?? '') : routePath ?? ''
}

export function romanToInt(s: string): number {
  const romanMap: { [key: string]: number } = {
    Ⅰ: 1,
    Ⅱ: 2,
    Ⅲ: 3,
    Ⅳ: 4,
    Ⅴ: 5,
  }

  return romanMap[s]
}
