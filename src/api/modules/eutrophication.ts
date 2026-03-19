import api from '../index'

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
  return api.post('/api/Eutrophication/upload', form)
}

export function getEutrophicationStatus(taskId: string): Promise<EutrophicationStatusResponse> {
  return api.get(`/api/Eutrophication/status/${taskId}`)
}

export function getEutrophicationResult(taskId: string): Promise<EutrophicationResultResponse> {
  return api.get(`/api/Eutrophication/result/${taskId}`)
}
