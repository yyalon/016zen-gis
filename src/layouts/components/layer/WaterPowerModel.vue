<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

// @ts-expect-error 缺失声明文件，先忽略 TS 检查
import L from 'leaflet'

const emit = defineEmits(['close'])

const selectedDate = ref(dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
const dialogVisible = ref(true)
const datePickerRef = ref()

let _activeLayer: L.ImageOverlay | null = null
let _inactiveLayer: L.ImageOverlay | null = null
let _currentIndex = 0
let _imageUrls: string[] = []
let _isPlaying = false
let _animationTimer: ReturnType<typeof setTimeout> | null = null
let _isConfirmed = false

const bounds = [
  13390601.266231373,
  3299078.8484887187,
  13811268.20489727,
  3822414.0372982295,
]

onMounted(() => {
  // 延迟展开日期选择器，保证组件渲染完成
  nextTick(() => {
    if (datePickerRef.value) {
      datePickerRef.value.focus()
    }
  })
})

onUnmounted(() => {
  stopAnimation()
  const map = (window as any).$zMap
  if (map) {
    if (_activeLayer && map.hasLayer(_activeLayer)) {
      map.removeLayer(_activeLayer)
    }
    if (_inactiveLayer && map.hasLayer(_inactiveLayer)) {
      map.removeLayer(_inactiveLayer)
    }
  }
  _activeLayer = null
  _inactiveLayer = null
})

function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

async function handleConfirm() {
  if (!selectedDate.value) {
    ElMessage.warning('请先选择日期')
    return
  }

  const success = await handleDateChange(selectedDate.value)
  if (success) {
    _isConfirmed = true
    dialogVisible.value = false
  }
}

function handleCancel() {
  dialogVisible.value = false
}

function handleClose() {
  if (!_isConfirmed) {
    emit('close')
  }
}

async function handleDateChange(val: string): Promise<boolean> {
  stopAnimation()

  if (!val) {
    return false
  }

  const dateStr = val
  const baseUrl = `http://10.245.183.33/model_image/sdlmx/${dateStr}/flow_depth_t{index}_l0.png`

  // 检查第一张图是否存在
  const firstImageUrl = baseUrl.replace('{index}', '1')
  const exists = await checkImageExists(firstImageUrl)

  if (!exists) {
    ElMessage.warning('当前日期下没有水动力模型')
    return false
  }

  // 构建图片路径列表
  _imageUrls = []
  for (let i = 1; i <= 144; i++) {
    _imageUrls.push(baseUrl.replace('{index}', i.toString()))
  }

  _currentIndex = 0
  showLayer()
  return true
}

function showLayer() {
  if (_imageUrls.length === 0) {
    console.warn('No water power model images found.')
    return
  }

  const [xmin, ymin, xmax, ymax] = bounds
  const sw = L.CRS.EPSG3857.unproject(L.point(xmin, ymin))
  const ne = L.CRS.EPSG3857.unproject(L.point(xmax, ymax))
  const finalBounds: L.LatLngBoundsExpression = L.latLngBounds(sw, ne)

  const map = (window as any).$zMap
  if (!map) {
    return
  }

  // 清理旧图层
  if (_activeLayer && map.hasLayer(_activeLayer)) {
    map.removeLayer(_activeLayer)
  }
  if (_inactiveLayer && map.hasLayer(_inactiveLayer)) {
    map.removeLayer(_inactiveLayer)
  }

  // 创建两个图片叠加层用于双缓冲
  _activeLayer = L.imageOverlay(_imageUrls[_currentIndex], finalBounds, {
    opacity: 0.8,
    interactive: false, // 不阻挡鼠标事件
  })

  _inactiveLayer = L.imageOverlay(_imageUrls[_currentIndex], finalBounds, {
    opacity: 0,
    interactive: false,
  })

  map.addLayer(_activeLayer)
  map.addLayer(_inactiveLayer)

  startAnimation()
}

function startAnimation() {
  if (!_isPlaying) {
    _isPlaying = true
    _animationTimer = setTimeout(loadAndShowNext, 500)
  }
}

function stopAnimation() {
  _isPlaying = false
  if (_animationTimer) {
    clearTimeout(_animationTimer)
    _animationTimer = null
  }
  if (_inactiveLayer) {
    _inactiveLayer.off('load')
    _inactiveLayer.off('error')
  }
}

function loadAndShowNext() {
  if (!_isPlaying) {
    return
  }

  const nextIndex = (_currentIndex + 1) % _imageUrls.length
  const nextUrl = _imageUrls[nextIndex]

  if (_inactiveLayer) {
    // 移除旧事件
    _inactiveLayer.off('load')
    _inactiveLayer.off('error')

    _inactiveLayer.once('load', () => {
      if (!_isPlaying) {
        return
      }

      if (_activeLayer && _inactiveLayer) {
        // 切换透明度实现平滑过渡
        _inactiveLayer.setOpacity(0.8)
        _activeLayer.setOpacity(0)

        // 交换引用
        const temp = _activeLayer
        _activeLayer = _inactiveLayer
        _inactiveLayer = temp
      }

      _currentIndex = nextIndex
      // 成功加载并显示后，等待500ms加载下一张
      _animationTimer = setTimeout(loadAndShowNext, 500)
    })

    _inactiveLayer.once('error', () => {
      if (!_isPlaying) {
        return
      }

      // 加载失败，跳过该图，立刻尝试下一张
      _currentIndex = nextIndex
      loadAndShowNext()
    })

    // 触发图片加载
    _inactiveLayer.setUrl(nextUrl)
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="水动力模型日期选择"
    width="400px"
    :close-on-click-modal="false"
    :show-close="false"
    align-center
    custom-class="water-power-model-dialog"
    @close="handleClose"
  >
    <div class="date-picker-wrapper">
      <el-date-picker
        ref="datePickerRef"
        v-model="selectedDate"
        type="date"
        placeholder="选择对应日期"
        value-format="YYYY-MM-DD"
        :clearable="false"
      />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.water-power-model-dialog) {
  background-color: #fff;
  border: 1px solid #0075ff;

  .el-dialog__title {
    color: #333;
  }

  .el-dialog__body {
    padding: 20px;
  }
}

.date-picker-wrapper {
  display: flex;
  align-items: center;

  .label {
    color: #333;
    margin-right: 10px;
    font-size: 14px;
  }

  :deep(.el-input__wrapper) {
    background-color: transparent !important;
    box-shadow: none !important;
    border: 1px solid rgb(0 117 255 / 80%);

    .el-input__inner {
      color: #333; /* 修复字体颜色为黑色以正常显示回显内容 */
    }
  }
}
</style>
