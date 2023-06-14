import api from '../index'

export default {
  // 获取十三五河流断面
  get135RiverSections: () => api.post('/app/data/river-section-135/list'),

  // 获取十四五河流断面
  get145RiverSections: () => api.post('/app/data/river-section-145/list'),

  // 获取十三五河流断面详细信息
  get135RiverSectionInfo: (params: any) => api.get('/app/data/river-section-135/info', { params }),

  // 获取十四五河流断面详细信息
  get145RiverSectionInfo: (params: any) => api.get('/app/data/river-section-145/info', { params }),

  // 通过断面编码获取十三五单个断面水质信息
  get135WaterQualityBySectionCode: (params: any) => api.post('/app/data/river-water-quality-monthly/list', {}, { params }),

  // 通过断面名称获取十四五单个断面水质信息
  get145WaterQualityBySectionName: (data: any) => api.post('/app/data/river-water-quality/list', data),

  // 获取排污口列表
  getSewageOutfalls: () => api.post('/app/data/sewage-outfall/list'),

  // 获取排污口详细信息
  getSewageOutfallInfo: (params: any) => api.get('/app/data/sewage-outfall/info', { params }),
}
