import { ElLoading, ElMessage } from 'element-plus'
import {
  getEutrophicationResult,
  getEutrophicationStatus,
  uploadEutrophicationFile,
} from '@/api/modules/eutrophication'
import type { EutrophicationEvalResult, EutrophicationUploadResponse } from '@/api/modules/eutrophication'
import eventBus from '@/utils/eventBus'

/** 与 Toolbar / ThreeLevelAreas 共用事件名 */
export const EUTROPHICATION_THREE_LEVEL_STYLE_EVENT = 'eutrophication-three-level-style'

/** 关闭三级分区时恢复 GeoJSON 图层默认黄系描边/填充 */
export const THREE_LEVEL_AREAS_RESET_DEFAULT_STYLE_EVENT = 'three-level-areas-reset-default-style'

/** 分区着色：region（接口返回值，如 陆域/近岸/离岸） -> 颜色 */
export const latestThreeLevelEutrophicationResults = { results: null as unknown | null }

const LEVEL_COLORS: Record<number, string> = {
  1: '#FFFFFF',
  2: '#03FF00',
  3: '#FFFF00',
  4: '#FFBF00',
  5: '#FF0000',
}

/** 无法匹配分区或接口未返回该区域时，使用 level 1 配色 */
export const EUTROPHICATION_LEVEL1_COLOR = LEVEL_COLORS[1]

const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 180

let evaluationGeneration = 0

/** 递增代数，终止进行中的富营养化状态轮询 */
export function cancelEutrophicationPolling(): void {
  evaluationGeneration++
}

function notifyThreeLevelEutrophicationResults(results?: unknown) {
  latestThreeLevelEutrophicationResults.results = results || null
  eventBus.emit(EUTROPHICATION_THREE_LEVEL_STYLE_EVENT, { results })
}

/** 陆域/近岸/离岸在结果里缺省时，用调色板第一档补全，避免图层仍用上一轮的色 */

/**
 * 从接口 result.results 构建 区域 -> 颜色（区域名与接口 region 字段一致）
 */

function applyEutrophicationApiResult(result: EutrophicationEvalResult | undefined): boolean {
  if (!result || typeof result !== 'object' || !result.results) {
    ElMessage.warning('评价结果为空或缺少结果数据')
    return false
  }

  notifyThreeLevelEutrophicationResults(result.results)
  ElMessage.success('富营养化评价完成')
  return true
}

/**
 * 上传已成功并取得 taskId 后：轮询评价任务状态 → 取结果 → 按分区 level 着色
 */
export async function pollEutrophicationTask(taskId: string): Promise<void> {
  const myGen = ++evaluationGeneration

  const loading = ElLoading.service({
    lock: true,
    text: '正在查询评价任务状态…',
    background: 'rgba(7, 14, 20, 0.85)',
  })

  try {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      if (myGen !== evaluationGeneration) {
        return
      }

      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS))
      }

      if (myGen !== evaluationGeneration) {
        return
      }

      let statusRes
      try {
        statusRes = await getEutrophicationStatus(taskId)
      }
      catch {
        return
      }

      if (myGen !== evaluationGeneration) {
        return
      }

      if (!statusRes?.success) {
        ElMessage.error(statusRes?.message || '查询任务状态失败')
        return
      }

      const status = statusRes.result?.status

      if (status === 'Pending') {
        continue
      }

      if (status === 'Failed') {
        const err = statusRes.result?.errorMessage || statusRes.message || '评价任务失败'
        ElMessage.error(err)
        return
      }

      if (status === 'Completed') {
        let resultRes
        try {
          resultRes = await getEutrophicationResult(taskId)
        }
        catch {
          return
        }

        if (myGen !== evaluationGeneration) {
          return
        }

        if (!resultRes?.success) {
          ElMessage.error(resultRes?.message || '获取评价结果失败')
          return
        }

        applyEutrophicationApiResult(resultRes.result)
        return
      }

      ElMessage.warning(`未知任务状态: ${String(status)}`)
      return
    }

    ElMessage.warning('评价任务等待超时，请稍后重试')
  }
  finally {
    loading.close()
  }
}

/** 非 el-upload 场景：axios 上传 + 轮询 */
export async function runEutrophicationEvaluation(file: File): Promise<void> {
  const myGen = ++evaluationGeneration

  let uploadRes: EutrophicationUploadResponse | undefined
  try {
    uploadRes = await uploadEutrophicationFile(file)
  }
  catch {
    return
  }

  if (myGen !== evaluationGeneration) {
    return
  }

  if (!uploadRes?.success) {
    ElMessage.error(uploadRes?.message || '上传失败')
    return
  }

  const taskId = uploadRes.result?.taskId
  const okMsg = uploadRes.result?.message || uploadRes.message || '上传成功'
  ElMessage.success(okMsg)

  if (!taskId) {
    ElMessage.error('未返回任务 ID')
    return
  }

  await pollEutrophicationTask(taskId)
}
