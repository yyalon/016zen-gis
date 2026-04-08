import api from '../index'

function eutrophicationRequestBaseURL(): string {
  if (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true') {
    return '/zen-root/'
  }
  const base = String(import.meta.env.VITE_APP_API_BASEURL || '')
  if (/^https?:\/\//i.test(base)) {
    return new URL(base).origin
  }
  return typeof window !== 'undefined' ? window.location.origin : ''
}

/** el-upload :action 与 axios 富营养化接口共用同一套 base（避免 /zapi 前缀） */
export function getEutrophicationUploadUrl(): string {
  const b = eutrophicationRequestBaseURL().replace(/\/$/, '')
  return `${b}/zennet/api/Eutrophication/upload`
}

export interface EutrophicationUploadResult {
  taskId: string
  message?: string
}

export interface EutrophicationUploadResponse {
  message: string
  success: boolean
  result?: EutrophicationUploadResult
}

export interface EutrophicationStatusResult {
  taskId: string
  status: 'Pending' | 'Completed' | 'Failed' | string
  errorMessage?: string | null
  creationTime?: string
  startTime?: string
  completionTime?: string
}

export interface EutrophicationStatusResponse {
  message: string
  success: boolean
  result?: EutrophicationStatusResult
}

export interface EutrophicationRegionResultItem {
  region: string
  comprehensiveIndex?: number
  level: number
  status?: string
  scores?: Record<string, number>
}

export interface EutrophicationEvalResult {
  taskId?: string
  status?: string
  /** 分区域评价结果：陆域 / 近岸 / 离岸 */
  results?: EutrophicationRegionResultItem[]
}

export interface EutrophicationResultResponse {
  message: string
  success: boolean
  result?: EutrophicationEvalResult
}

export function uploadEutrophicationFile(file: File): Promise<EutrophicationUploadResponse> {
  const form = new FormData()
  form.append('file', file)
  return api.post('/zennet/api/Eutrophication/upload', form, { baseURL: eutrophicationRequestBaseURL() })
}

export function getEutrophicationStatus(taskId: string): Promise<EutrophicationStatusResponse> {
  return api.get(`/zennet/api/Eutrophication/status/${taskId}`, { baseURL: eutrophicationRequestBaseURL() })
}

export function getEutrophicationResult(taskId: string): Promise<EutrophicationResultResponse> {
  return api.get(`/zennet/api/Eutrophication/result/${taskId}`, { baseURL: eutrophicationRequestBaseURL() })
}
