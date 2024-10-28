import api from '../index'
import type { GeneralQuery, RegionQuery } from './queryTypes'
import type {
  AirStation,
  Meteorology,
  OutfallGoalStats,
  OutfallOverallStats,
  OutfallTypeStats,
  OverallWaterQualityStats,
  ProvinceCityTree,
  SeaWaterEutrophication,
  SeaWaterOverallStats,
  SeaWaterQualityCompliance,
  SeaWaterQualityTrend,
  SeaWaterStats,
  WaterQualityComplianceResult,
  WaterQualityDetail,
  WaterQualityTrend,
  WaterYoyProportion,
} from './resultTypes'

export default {
  /**
   * 获取并计算生成海水水质等级面积数据
   * @param query
   * @returns
   */
  getRegion: (query: RegionQuery): Promise<ProvinceCityTree[]> => api.post('/app/data/gis-data/region', query),

  /**
   * 驾驶舱-入海河流(左上)
   * @param query
   * @returns
   */
  getRiverOverall: (
    query: GeneralQuery,
  ): Promise<{
    sea: OverallWaterQualityStats // 东海区
    battle: OverallWaterQualityStats // 攻坚战
  }> => api.post('/app/data/gis-data/river-overall', query),

  /**
   * 驾驶舱-大气实况(左下)
   * @param query
   * @returns
   */
  getAirStation: (query: GeneralQuery): Promise<AirStation[]> => api.post('/app/data/gis-data/air-station', query),

  /**
   * 驾驶舱-近岸海域(右上)
   * @param query
   * @returns
   */
  getSeaWaterOverall: (query: GeneralQuery): Promise<SeaWaterOverallStats[]> => api.post('/app/data/gis-data/sea-water-overall', query),

  /**
   * 驾驶舱-气象实况(右下)
   * @param query
   * @returns
   */
  getMeteorology: (query: GeneralQuery): Promise<Meteorology[]> => api.post('/app/data/gis-data/meteorology', query),

  /**
   * 入海河流-河流水质达标考核
   * @param query
   * @returns
   */
  getWaterQualityComplianceResult: (query: GeneralQuery): Promise<WaterQualityComplianceResult> => api.post('/app/data/gis-data/water-compliance', query),

  /**
   * 入海河流-水质现状统计分析
   * @param query
   * @returns
   */
  getWaterYoyProportion: (query: GeneralQuery): Promise<WaterYoyProportion> => api.post('/app/data/gis-data/water-yoy', query),

  /**
   * 入海河流-水质达标率趋势分析
   * @param query
   * @returns
   */
  getWaterQualityTrend: (query: GeneralQuery): Promise<WaterQualityTrend> => api.post('/app/data/gis-data/water-trend', query),

  /**
   * 入海河流-断面监测详情
   * @param query
   * @returns
   */
  getWaterQualityDetail: (query: GeneralQuery): Promise<WaterQualityDetail> => api.post('/app/data/gis-data/water-wq-detal', query),

  /**
   * 入海排污口-入海排污口统计
   * @param query
   * @returns
   */
  getOutfallOverallStats: (query: GeneralQuery): Promise<OutfallOverallStats> => api.post('/app/data/gis-data/outfall-stat', query),

  /**
   * 入海排污口-收纳水体排污口类型分析
   * @param query
   * @returns
   */
  getOutfallTypeStats: (query: GeneralQuery): Promise<OutfallTypeStats> => api.post('/app/data/gis-data/outfall-type-stat', query),

  /**
   * 入海排污口-收纳水体目标统计
   * @param query
   * @returns
   */
  getOutfallGoalStats: (query: GeneralQuery): Promise<OutfallGoalStats> => api.post('/app/data/gis-data/outfall-goal-stat', query),

  /**
   * 近岸海域-近岸海域水质达标考核（左上）
   * @param query
   * @returns
   */
  getSeaWaterQualityCompliance: (query: GeneralQuery): Promise<SeaWaterQualityCompliance[]> => api.post('/app/data/gis-data/sea-compliance', query),

  /**
   * 近岸海域-水质现状分析（左下）
   * @param query
   * @returns
   */
  getSeaWaterStats: (query: GeneralQuery): Promise<SeaWaterStats> => api.post('/app/data/gis-data/sea-stats', query),

  /**
   * 近岸海域-近岸水域面积变化趋势(右上)
   * @param query
   * @returns
   */
  getSeaWaterQualityTrend: (query: GeneralQuery): Promise<SeaWaterQualityTrend> => api.post('/app/data/gis-data/sea-water-trend', query),

  /**
   * 近岸海域-富营养化（右下）
   * @param query
   * @returns
   */
  getSeaWaterEutrophication: (query: GeneralQuery): Promise<SeaWaterEutrophication> => api.post('/app/data/gis-data/sea-water-e', query),
}
