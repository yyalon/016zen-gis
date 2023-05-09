import api from '../geo'

export default {
  getGeoSerevrLayers: () => api.get('geoserver/rest/workspaces/sea/layers'),
}
