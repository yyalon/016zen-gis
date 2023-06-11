import api from '../index'

export default {
  // 获取十三五河流断面
  get135RiverSections: () => api.post('/app/data/river-section-135/list'),

  // 获取十四五河流断面
  get145RiverSections: () => api.post('/app/data/river-section-145/list'),
}
