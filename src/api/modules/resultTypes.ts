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
  color: string // 颜色
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
    province: string // 省份
    target: number //  目标
    targetDifference: number // 优于目标
  }[]
}

/**
 * 驾驶舱-气象实况
 */
export interface Meteorology {
  stationName: string // 站点
  winDirection: string // 风速
  winSpeed: string // 风向
  RHU: string // 湿度
  dateTime: string // 监测时间
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
  header: string[] // 表头[9月，1-9月],1月份的话长度就是1
  data: {
    // 1-3类水质或者达标,数组第一个代表当月，第二个代表累计类似1-9月
    good: {
      currrentMon: number // 当前优良水质占比
      yoyRate: number // 优良水质同比
      currrentTnMon: number // 当前总氮达标占比
      yoyTnRate: number // 总氮达标同比
    }[]
    // 4类水质或者不达标,数组第一个代表当月，第二个代表累计类似1-9月
    poor: {
      currrentMon: number // 当前不达标水质占比
      yoyRate: number // 不达标水质同比
      currrentTnMon: number // 当前总氮不达标占比
      yoyTnRate: number // 总氮不达标同比
    }[]
  }
}

/**
 * 入海河流-水质达标率趋势分析
 */
export interface WaterQualityTrend {
  months: string[] // 月份
  waterQualityComplianceRates: number[] // 达标率
  waterQualityNonComplianceRates: number[] // 不达标率
  waterQualityYoYChanges: number[] // 达标率同比

  totalNitrogenComplianceRates: number[] // 总氮达标率
  totalNitrogenNonComplianceRates: number[] // 总氮不达标率
  totalNitrogenYoYChanges: number[] // 总氮达标率同比
}

/**
 * 入海河流-断面监测详情
 */
export interface WaterQualityDetail {
  province: string // 省份
  city: string // 城市
  selectCode: string // 断面code
  sectionName: string // 断面名称
  waterType: string // 水质类别
  waterTarget: string // 目标类别
  isCompliant: boolean // 是否达标
  waterChange: number // 变化差值
  lastMotnType: string // 上月水质类型
  lat: string // 维度
  color: string // 水质对应颜色
  targetColor: string // 目标水质颜色
}

/**
 * 入海排污口-入海排污口统计
 */
export interface OutfallOverallStats {
  name: string // 标题
  count: number // 排污口总数
  chartData: {
    industry: string[] // 行业
    industryCount: number[] // 行业数量
  }
}

/**
 * 入海排污口-收纳水体排污口类型分析
 */
export interface OutfallTypeStats {
  name: string // 标题
  count: number // 排污口总数
  chartData: {
    type: string[] // 排污口类型
    typeCount: number[] // 排污口数量
  }
}

/**
 * 入海排污口-收纳水体目标统计
 */
export interface OutfallGoalStats {
  name: string // 标题
  count: number // 排污口总数
  // 详细数据
  data: {
    waterQualityGoal: string // 目标水体类别
    count: number // 总数
    rate: number // 占比
    exceeCount: number // 超标数量
    exceeRate: number // 超标比例
  }[]
}

/**
 * 近岸海域-近岸海域水质达标考核（左上）
 */
export interface SeaWaterQualityCompliance {
  province: string
  seaWaterComplianceResult: {
    count: number
    currentSeasonComplianceRate: number
    lastYearDifference: number
    year2020ComplianceRate: number
    targetComplianceRate: number
    isCompliance: boolean
  }
}

/**
 * 近岸海域-水质现状分析（左下）
 */
export interface SeaWaterStats {
  season: string // 季节
  area: {
    currentSeasonClass1And2Rate: number // 本季节1-2类水质占比
    class1And2SeasonDifference: number // 1-2类水质环比
    currentYearClass1And2Rate: number // 年度累计1-2水质占比
    class1And2YearDifference: number // 年度1-2类水质环比
    currentSeasonAboveClass4Rate: number // 本季节4类水质占比
    aboveClass4SeasonDifference: number // 本季节4类水质环比
    currentYearAboveClass4Rate: number // 年度4类水质占比
    aboveClass4YearDifference: number // 年度4类水质环比
  }
  point: {
    currentSeasonClass1And2Rate: number // 本季节1-2类水质占比
    class1And2SeasonDifference: number // 1-2类水质环比
    currentYearClass1And2Rate: number // 年度累计1-2水质占比
    class1And2YearDifference: number // 年度1-2类水质环比
    currentSeasonAboveClass4Rate: number // 本季节4类水质占比
    aboveClass4SeasonDifference: number // 本季节4类水质环比
    currentYearAboveClass4Rate: number // 年度4类水质占比
    aboveClass4YearDifference: number // 年度4类水质环比
  }
}

/**
 * 近岸海域-近岸水域面积变化趋势(右上)
 */
export interface SeaWaterQualityTrend {
  seasons: string[] // 季节
  waterQualityComplianceRates: number[] // 达标率
  waterQualityQoqChanges: number[] // 环比
  waterQualityYoYChanges: number[] // 同比
}

/**
 * 近岸海域-富营养化（右下）
 */
export interface SeaWaterEutrophication {
  names: string[] // 富营养化级别
  data: number[] // 数量
  color: string[] // 颜色
}

export interface OperationResult<T> {
  code: string
  message: string
  data: T
}
