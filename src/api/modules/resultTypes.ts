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
export interface MeteorologyStats {
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

/**
 * 气象站
 */
export interface Meteorology {
  id: number // 主键ID
  DATEVAL_S: string // 时间
  STATION_NAME: string // 站名
  COUNTRY: string // 国家
  PROVINCE: string // 省份
  CITY: string // 地市
  CNTY: string // 区县
  DATEVAL: string // 监测时间
  TOWN: string // 乡镇
  STATION_ID_C: string // 区站号(字符)
  STATION_ID_D: string // 区站号(数字)
  STATION_TYPE: string // 测站类型
  STATION_LEVL: string // 测站级别
  ADMIN_CODE_CHN: string // 行政区代码
  YEAR: string // 年(年)
  MON: string // 月(月)
  DAY: string // 日(日)
  HOUR: string // 时(时)
  PRS_MAX_OTIME: string // 最高气压出现时间
  PRS_MIN_OTIME: string // 最低气压出现时间
  TEM_MAX_OTIME: string // 最高气温出现时间
  TEM_MIN_OTIME: string // 最低气温出现时间
  RHU_MIN_OTIME: string // 最小相对湿度出现时间
  PRE_ARTI_ENC_CYC: string // 人工加密观测降水量描述周期(小时)
  WIN_S_MAX_OTIME: string // 最大风速出现时间
  WIN_S_INST_MAX_OTIME: string // 极大风速出现时间
  GST_MAX_OTIME: string // 最高地面温度出现时间(格式：HHMM)
  GST_MIN_OTIME: string // 最低地面温度出现时间
  LGST_MAX_OTIME: string // 草面(雪面)最高温度出现时间
  LGST_MIN_OTIME: string // 草面(雪面)最低温度出现时间
  WEP_NOW: string // 现在天气
  UPDATETIME_O: string // 原始的更新时间
  LAT: number // 纬度(度)
  LON: number // 经度(度)
  ALTI: number // 测站高度(米)
  PRS_SENSOR_ALTI: number // 气压传感器海拔高度(米)
  WIN_S_SENSOR_HEIGH: number // 风速传感器距地面高度(米)
  PRS: number // 气压(百帕)
  PRS_SEA: number // 海平面气压(百帕)
  PRS_CHANGE_3H: number // 3小时变压(百帕)
  PRS_CHANGE_24H: number // 24小时变压(百帕)
  PRS_MAX: number // 最高气压(百帕)
  PRS_MIN: number // 最低气压(百帕)
  TEM: number // 温度 / 气温(摄氏度(℃))
  TEM_MAX: number // 最高气温(摄氏度(℃))
  TEM_MIN: number // 最低气温(摄氏度(℃))
  TEM_CHANGE_24H: number // 过去24小时变温(摄氏度(℃))
  TEM_MAX_24H: number // 过去24小时最高气温(摄氏度(℃))
  TEM_MIN_24H: number // 过去24小时最低气温(摄氏度(℃))
  DPT: number // 露点温度(摄氏度(℃))
  RHU: number // 相对湿度(百分率)
  RHU_MIN: number // 最小相对湿度(百分率)
  VAP: number // 水汽压(百帕)
  PRE_1H: number // 过去1小时降水量(毫米)
  PRE_3H: number // 过去3小时降水量(毫米)
  PRE_6H: number // 过去6小时降水量(毫米)
  PRE_12H: number // 过去12小时降水量(毫米)
  PRE_24H: number // 过去24小时降水量(毫米)
  PRE: number // 人工加密观测降水量(毫米)
  EVP_BIG: number // 蒸发(大型)(毫米)
  WIN_D_AVG_2MI: number // 2分钟平均风向(度)
  WIN_S_AVG_2MI: number // 2分钟平均风速(米 / 秒)
  WIN_D_AVG_10MI: number // 10分钟平均风向(度)
  WIN_S_AVG_10MI: number // 10分钟平均风速(米 / 秒)
  WIN_D_S_MAX: number // 最大风速的风向(度)
  WIN_S_MAX: number // 最大风速(米 / 秒)
  WIN_D_INST: number // 瞬时风向(度)
  WIN_S_INST: number // 瞬时风速(米 / 秒)
  WIN_D_INST_MAX: number // 极大风速的风向(度)
  WIN_S_INST_MAX: number // 极大风速(米 / 秒)
  WIN_D_INST_MAX_6H: number // 过去6小时极大瞬时风向(度)
  WIN_S_INST_MAX_6H: number // 过去6小时极大瞬时风速(米 / 秒)
  WIN_D_INST_MAX_12H: number // 过去12小时极大瞬时风向(度)
  WIN_S_INST_MAX_12H: number // 过去12小时极大瞬时风速(米 / 秒)
  GST: number // 地面温度(摄氏度(℃))
  GST_MAX: number // 最高地面温度(摄氏度(℃))
  GST_MIN: number // 最低地面温度(摄氏度(℃))
  GST_MIN_12H: number // 过去12小时地面最低温度(摄氏度(℃))
  GST_5CM: number // 5cm地温(摄氏度(℃))
  GST_10CM: number // 10cm地温(摄氏度(℃))
  GST_15CM: number // 15cm地温(摄氏度(℃))
  GST_20CM: number // 20cm地温(摄氏度(℃))
  GST_40CM: number // 40cm地温(摄氏度(℃))
  GST_80CM: number // 80cm地温(摄氏度(℃))
  GST_160CM: number // 160cm地温(摄氏度(℃))
  GST_320CM: number // 320cm地温(摄氏度(℃))
  LGST: number // 草面(雪面)温度(摄氏度(℃))
  LGST_MAX: number // 草面(雪面)最高温度(摄氏度(℃))
  LGST_MIN: number // 草面(雪面)最低温度(摄氏度(℃))
  VIS: number // 水平能见度(人工)(米)
  CLO_COV: number // 总云量(百分率)
  CLO_COV_LOW: number // 低云量(百分率)
  CLO_COV_LM: number // 云量(低云或中云)(百分率)
  CLO_HEIGHT_LOM: number // 低云或中云的云高(百分率)
}

export interface GisConf {
  filterDetaulTime: string // 默认数据查询时间
}
