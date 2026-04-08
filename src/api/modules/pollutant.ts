import api from '../index'

function pollutRequestBaseURL(): string {
  if (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true') {
    return '/zen-root/'
  }
  const base = String(import.meta.env.VITE_APP_API_BASEURL || '')
  if (/^https?:\/\//i.test(base)) {
    return new URL(base).origin
  }
  return typeof window !== 'undefined' ? window.location.origin : ''
}

export type PollutType = 'tn' | 'tp'

export interface Chart1CityItem {
  city: string
  s1: number
  s2: number
  s3: number
  s4: number
}

export interface Chart3TypeItem {
  type: string
  year: number
  total: number
}

export interface Chart3SubtypeItem {
  subtype: string
  total: number
}

export interface Chart3CityItem {
  city: string
  total: number
}

export interface Chart4BayItem {
  bay: string
  total: number
}

export default {
  chart1Cities: (params: { type?: PollutType }) =>
    api.get('/zennet/api/pollut/chart1/cities', {
      baseURL: pollutRequestBaseURL(),
      params,
    }),

  chart1Districts: (city: string, params: { type?: PollutType }) =>
    api.get(`/zennet/api/pollut/chart1/districts/${encodeURIComponent(city)}`, {
      baseURL: pollutRequestBaseURL(),
      params,
    }),

  chart3Types: (params: { type?: PollutType; year?: number }) =>
    api.get('/zennet/api/pollut/chart3/types', {
      baseURL: pollutRequestBaseURL(),
      params,
    }),

  chart3Subtypes: (fluxType: string, params: { type?: PollutType; year?: number }) =>
    api.get(`/zennet/api/pollut/chart3/subtypes/${encodeURIComponent(fluxType)}`, {
      baseURL: pollutRequestBaseURL(),
      params,
    }),

  chart3Cities: (fluxType: string, subtype: string, params: { type?: PollutType; year?: number }) =>
    api.get(`/zennet/api/pollut/chart3/cities/${encodeURIComponent(fluxType)}/${encodeURIComponent(subtype)}`, {
      baseURL: pollutRequestBaseURL(),
      params,
    }),

  chart3Years: () =>
    api.get('/zennet/api/pollut/chart3/years', {
      baseURL: pollutRequestBaseURL(),
    }),

  chart4Bays: (params: { type?: PollutType; pollutantType?: string }) =>
    api.get('/zennet/api/pollut/chart4/bays', {
      baseURL: pollutRequestBaseURL(),
      params,
    }),

  chart4Secondary: (bay: string, params: { type?: PollutType; pollutantType?: string }) =>
    api.get(`/zennet/api/pollut/chart4/secondary/${encodeURIComponent(bay)}`, {
      baseURL: pollutRequestBaseURL(),
      params,
    }),

  chart4PollutantTypes: () =>
    api.get('/zennet/api/pollut/chart4/pollutant_types', {
      baseURL: pollutRequestBaseURL(),
    }),
}
