import api from '../index'
import type { GeneralQuery, RegionQuery } from './queryTypes'
import type { AirStation, Meteorology, OverallWaterQualityStats, ProvinceCityTree, SeaWaterOverallStats, WaterQualityComplianceResult, WaterYoyProportion } from './resultTypes'

export default {
  // 获取并计算生成海水水质等级面积数据
  getRegion: (query: RegionQuery): Promise<ProvinceCityTree[]> => api.post('/app/data/gis-data/region', query),

  // 驾驶舱-入海河流(左上)
  getRiverOverall: (query: GeneralQuery): Promise<{
    sea: OverallWaterQualityStats// 东海区
    battle: OverallWaterQualityStats// 攻坚战
  }> => api.post('/app/data/gis-data/river-overall', query),

  // 驾驶舱-大气实况(左下)
  getAirStation: (query: GeneralQuery): Promise<AirStation[]> => api.post('/app/data/gis-data/air-station', query),

  // 驾驶舱-近岸海域(右上)
  getSeaWaterOverall: (query: GeneralQuery): Promise<SeaWaterOverallStats[]> => api.post('/app/data/gis-data/sea-water-overall', query),

  // 驾驶舱-气象实况(右下)
  getMeteorology: (query: GeneralQuery): Promise<Meteorology[]> => api.post('/app/data/gis-data/meteorology', query),

  // 入海河流-河流水质达标考核
  getWaterQualityComplianceResult: (query: GeneralQuery): Promise<WaterQualityComplianceResult> => api.post('/app/data/gis-data/water-compliance', query),

  // 入海河流-水质现状统计分析
  getWaterYoyProportion: (query: GeneralQuery): Promise<WaterYoyProportion> => api.post('/app/data/gis-data/water-yoy', query),

}
