/**
 * 行政区域返回值
 */
export interface ProvinceCityTree {
  province: string // 省份名称
  citys: string[] // 城市列表
}

/**
   * 驾驶舱-入海河流,每个区域统计对象
   */
export interface OverallWaterQualityStats {
  time?: string // 时间
  sectionCount: number // 监测断面数量
  qualifyCount: number // 达标断面数量
  qualifyRate: number // 断面达标率
  triadCategoryCount: number // 三类以上数量
}

/**
 * 驾驶舱-大气实况
 */
export interface AirStation {
  stationName: string // 站点
  AQI: string // AQI
  quality: string // 空气质量等级
  primaryPollutant: string // 首要污染物
}

/**
 * 驾驶舱-近岸海域
 */
export interface SeaWaterOverallStats {
  currentMonthGoodAreaRatio: number // 水质优良比例
  goodAreaRatioDifference: number // 同比差值
  currentMonthTotal: number // 总数或者总面积
  // 各个省份数据
  provinceResults: {
    province: string// 省份
    target: number //  目标
    targetDifference: number // 优于目标
  }[]
}

/**
 * 驾驶舱-气象实况
 */
export interface Meteorology {
  stationName: string// 站点
  winDirection: string// 风速
  winSpeed: string// 风向
  RHU: string// 湿度
  dateTime: string// 监测时间
}

/**
 * 入海河流-河流水质达标考核
 */
export interface WaterQualityComplianceResult {
  complianceTargetRate: number // 达标率要求
  complianceRate: number // 现状
  worseComplianceTargetRate: number // 劣于目标
  yoyComplianceRate: number // 同比变化量，大于零绿色 小于零红色
  poorTargetRate: 0 // 劣V类率要求
  poorRate: number // 当前劣v类
  worsePoorTargetRate: number // 列于目标
  yoyPoorRate: number // 同比变化量，大于零绿色 小于零红色
}

/**
 * 入海河流-水质现状统计分析
 */
export interface WaterYoyProportion {
  header: string[]// 表头[9月，1-9月],1月份的话长度就是1
  data: {
    // 1-3类水质或者达标,数组第一个代表当月，第二个代表累计类似1-9月
    good: {
      currrentMon: number// 当前优良水质占比
      yoyRate: number// 优良水质同比
      currrentTnMon: number// 当前总氮达标占比
      yoyTnRate: number// 总氮达标同比
    }[]
    // 4类水质或者不达标,数组第一个代表当月，第二个代表累计类似1-9月
    poor: {
      currrentMon: number// 当前不达标水质占比
      yoyRate: number// 不达标水质同比
      currrentTnMon: number// 当前总氮不达标占比
      yoyTnRate: number// 总氮不达标同比
    }[]
  }
}
