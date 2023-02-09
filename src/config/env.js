// 开发模式
console.log(process.env.NODE_ENV)
export const isDev = process.env.NODE_ENV === 'development'

// Gis Path
export const adminHost = isDev
  ? `http://localhost:9000/zen-admin`
  : '/zen-admin'
