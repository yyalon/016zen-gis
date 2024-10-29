/**
 * 大多数接口通用查询类
 */
export interface GeneralQuery {
  area?: string// 区域 攻坚战或者 东海区
  time?: string// 时间，默认当前时间
  province?: string// 身份
  city?: string// 城市
}

/**
   * 行政区域查询对象
   */
export interface RegionQuery {
  area: string // 攻坚战 或者 东海区
}
