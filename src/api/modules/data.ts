import api from '../index'

export default {
  // 获取河流断面
  getRiverSections: () => api.post('/app/data/river-section/list'),

  // 获取河流断面详细信息
  getRiverSectionInfo: (params: any) => api.get('/app/data/river-section/info', { params }),

  // 通过断面编码获取单个断面水质信息
  getWaterQualityBySectionCode: (data: any) => api.post('/app/data/river-water-quality-monthly/list', data),

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

  // 获取重点水道测站列表
  getRiverChannels: (params: any) => api.post('/app/data/river-channel/list'),
}
