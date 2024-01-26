import api from '../index'

export default {
  // 获取河流断面
  getRiverSections: () => api.post('/app/data/river-section/list'),

  // 获取河流断面详细信息
  getRiverSectionInfo: (params: any) => api.get('/app/data/river-section/info', { params }),

  // 通过断面编码获取单个断面水质信息
  getWaterQualityBySectionCode: (data: any) => api.post('/app/data/river-water-quality-monthly/list', data),
  // 水质类别面积占比
  getRiverSectionAreaRatio: (data: any) => api.post('/app/data/river-section/areaRatio', data),

  // 水质总体达标情况
  getRiverSectionOverall: () => api.get('/app/data/river-section/overall'),

  // 入海河流断面总氮达标情况
  getRiverSectionTotalDan: () => api.get('/app/data/river-section/totalDan'),

  // 主要污染物浓度趋势图
  getPollutionConcentrationTrend: () => api.get('/app/data/river-section/concentrationTrend'),

  // 获取排污口列表
  getSewageOutfalls: () => api.post('/app/data/sewage-outfall/list'),

  // 获取海水水质监测站列表
  getSeaWaterStation: () => api.post('/app/data/sea-water-station/list'),

  // 获取根据点位编码获取海水水质
  getSeaWaterQuality: (data: any) => api.post('/app/data/sea-water-quality/list', data),

  // 获取排污口详细信息
  getSewageOutfallInfo: (params: any) => api.get('/app/data/sewage-outfall/info', { params }),

  // 获取地面气象站
  getMeteorologyStations: (params: any) => api.post('/app/data/meteorology-station/list'),

  // 获取重点水库测站列表
  getReservoirs: (params: any) => api.post('/app/data/reservoir/list'),

  // 获取重点河道测站列表
  getRiverChannels: (params: any) => api.post('/app/data/river-channel/list'),
}
