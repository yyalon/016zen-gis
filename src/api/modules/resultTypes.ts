/**
 * 行政区域返回值
 */
export interface ProvinceCityTree {
  province: string
  citys: {
    name: string
    riverSections: RiverSectionItem
  }[]
}

export interface RiverSectionItem {
  name: string
  code: string
}

/**
 * 驾驶舱-入海河流,每个区域统计对象
 */
export interface OverallWaterQualityStats {
  time?: string // 时间
  sectionCount: number // 监测断面数量
  qualifyCount: number // 达标断面数量
  qualifyRate: number // 断面达标率
  noRequireCount: number // 未作要求数量
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
  river: string
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
  ntolor: string
  ntTargetColor: string
  ntIsCompliant?: boolean
  totalNitrogen: string
  nTarget: string
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

/**
 * 主要污染企业
 */
export interface MainPollutingEnterprises {
  id: number // 主键ID
  AREANAME: string // 地区名称
  ATTENTIONDEGREECODE: string // 关注程度
  BANKACCOUNT: string // 银行帐号
  BUILDSTATUS: string // BUILDSTATUS
  CHECKSTATUS: string // CHECKSTATUS
  COMMENT: string // 备注
  COMMUNICATEADDR: string // 通讯地址
  CORPORATIONCODE: string // 法人代码
  CORPORATIONNAME: string // 法定代表人
  DELETEFLAG: string // 删除标记
  DISPOSETYPECODE: string // 处理厂类型编码
  DISPOSETYPENAME: string // 处理厂类型
  EMAIL: string // 电子邮箱
  ENTERCODE: string // ENTERCODE
  ENVIRONMENTMANS: string // 专职环保人员数
  ENVIRONMENTPRINCIPAL: string // 环保负责人
  EXCHANGEDATE: string // EXCHANGEDATE
  FAX: string // 传真
  IFALREADYONLINE: string // 是否已联网
  IFTHIRTYTENTHOUSANDKILOWAT: string // 是否30万千瓦电力企业
  INDUSTRYTYPECODE: string // 行业类别编码
  INDUSTRYTYPENAME: string // 行业类别
  ISMONITOR: string // ISMONITOR
  LICENSENUM: string // 许可证编号
  LINKMAN: string // 联系人
  LATITUDE: number // 纬度
  LONGITUDE: number // 经度
  MOBILEPHONE: string // 移动电话
  OFFICEPHONE: string // 办公电话
  ONLINESTATUS: string // 在线状态
  OPENACOCUNTBANK: string // 开户银行
  PHOTO: string // PHOTO
  POSTALCODE: string // 邮政编码
  PROVINCECODE: string // 省份编码
  PROVINCENAME: string // 省份
  PSADDRESS: string // 污染源地址
  PSALIAS: string // PSALIAS
  PSCLASSCODE: string // 污染源类别编码
  PSCLASSNAME: string // 污染源类别
  PSCODE: string // 污染源编码
  PSENVIRONMENTDEPT: string // 污染源环保部门
  PSMONITORCATEGORYTYPECODE: string // PSMONITORCATEGORYTYPECODE
  PSNAME: string // 污染源名称
  PSNUMBER: string // PSNUMBER
  PSSCALECODE: string // 污染源规模编码
  PSSCALENAME: string // 污染源规模
  PSWEBSITE: string // 污染源网址
  REGIONCODE: string // 行政区划编码
  REGIONNAME: string // 行政区划名称
  REGISTTYPECODE: string // 注册类型编码
  REGISTTYPENAME: string // 注册类型
  RUNDATE: string // 投产日期
  SPELL: string // SPELL
  STATECONTROLLEDTYPECODE: string // STATECONTROLLEDTYPECODE
  STATUS: string // 状态
  STOPWASTESTATUS: string // 停废业状态
  SUBJECTIONRELATIONCODE: string // 隶属关系编码
  SUBJECTIONRELATIONNAME: string // 隶属关系
  TOTALAREA: string // 总占地面积
  TYSHXYDM: string // TYSHXYDM
  UNITTYPECODE: string // 单位类别编码
  UNITTYPENAME: string // 单位类别
  UPDATEDATE: string // 更新日期
  VALLEYCODE: string // 流域编码
  VALLEYNAME: string // 流域
}

/**
 * 大气站
 */
export interface AirConcentration {
  id: number // 主键ID
  NEWCODE?: string // 唯一代码
  STATIONCODE?: string // 站点代码
  POSITIONNAME?: string // 点位名称
  AREA?: string // 城市名称
  CITYCODE?: string // 城市代码
  TIMEPOINT?: string // 监测时间
  AQI?: number // AQI
  PRIMARYPOLLUTANT?: string // 首要污染物
  QUALITY?: string // 环境质量等级
  LON: number // 经度
  LAT: number // 纬度
  SO2?: number // 二氧化硫
  SO2_24H?: number // 二氧化硫24小时均值
  SO2_IAQI?: number // 二氧化硫AQI
  NO2?: number // 二氧化氮
  NO2_24H?: number // 二氧化氮24小时均值
  NO2_IAQI?: number // 二氧化氮AQI
  O3_1H_24H?: number // 臭氧
  O3_1H_IAQI?: number // 臭氧AQI
  O3_8H_24H?: number // 臭氧八小时滑动均值
  O3_8H_IAQI?: number // 臭氧八小时滑动均值AQI
  CO?: number // 一氧化碳
  CO_24H?: number // 一氧化碳24小时均值
  CO_IAQI?: number // 一氧化碳AQI
  PM10?: number // PM10
  PM10_24H?: number // PM10 24小时均值
  PM10_IAQI?: number // PM10 AQI
  PM2_5?: number // PM2.5
  PM2_5_24H?: number // PM2.5 24小时均值
  PM2_5_IAQI?: number // PM2.5 AQI
}

export interface GisConf {
  filterDetaulTime: string // 默认数据查询时间
}

