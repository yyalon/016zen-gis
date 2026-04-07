<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// @ts-expect-error 缺失声明文件，先忽略 TS 检查
import L from 'leaflet'

/**
 * @description 组件属性定义
 */
const props = defineProps<{
  /**
   * 图片所在的目录路径或名称（例如 'pollutionSource'）
   * 会在 src/assets/images/ 下进行匹配
   */
  imagePath: string
  /**
   * 图片叠加层在地图上的经纬度范围
   */
  bounds: number[]
}>()

// 批量导入图片资源，匹配 assets/images 下所有层级的 png 文件
const allImagesGlob = import.meta.glob('../../../assets/images/**/*.png', { eager: true, import: 'default' })

const imageUrls = ref<string[]>([])
let _layer: L.ImageOverlay | null = null
let _intervalId: ReturnType<typeof setInterval> | null = null
let _currentIndex = 0

/**
 * @description 根据传入的目录路径筛选图片并按名称排序
 */
function loadImages() {
  const paths = Object.keys(allImagesGlob).filter(path => path.includes(props.imagePath))
  console.log('test456', paths)
  imageUrls.value = paths.sort().map(path => allImagesGlob[path] as string)
}

/**
 * @description 在地图上展示图片叠加层并开始动画
 */
function showLayer() {
  if (imageUrls.value.length === 0) {
    console.warn(`未找到路径包含 "${props.imagePath}" 的图片资源`)
    return
  }

  if (!_layer) {
    let finalBounds: L.LatLngBoundsExpression
    // 如果传入的是 [xmin, ymin, xmax, ymax] 格式的 EPSG:3857 投影坐标
    if (props.bounds.length === 4 && typeof props.bounds[0] === 'number') {
      const [xmin, ymin, xmax, ymax] = props.bounds
      const sw = L.CRS.EPSG3857.unproject(L.point(xmin, ymin))
      const ne = L.CRS.EPSG3857.unproject(L.point(xmax, ymax))
      finalBounds = L.latLngBounds(sw, ne)
    }
    else {
      // 否则假定传入的已经是经纬度数组
      finalBounds = props.bounds as any
    }

    // 创建图片叠加层
    _layer = L.imageOverlay(imageUrls.value[_currentIndex], finalBounds, {
      opacity: 0.8,
      interactive: false, // 不阻挡鼠标事件
    })

    const map = (window as any).$zMap
    if (map) {
      map.addLayer(_layer)
    }
  }

  startAnimation()
}

/**
 * @description 开始轮播动画
 */
function startAnimation() {
  if (!_intervalId) {
    // 切换频率与原 WaterQualityModel 保持一致 (160ms)
    _intervalId = setInterval(() => {
      _currentIndex = (_currentIndex + 1) % imageUrls.value.length
      if (_layer) {
        _layer.setUrl(imageUrls.value[_currentIndex])
      }
    }, 500)
  }
}

/**
 * @description 停止轮播动画
 */
function stopAnimation() {
  if (_intervalId) {
    clearInterval(_intervalId)
    _intervalId = null
  }
}

onMounted(() => {
  loadImages()
  showLayer()
})

onUnmounted(() => {
  stopAnimation()
  if (_layer) {
    const map = (window as any).$zMap
    if (map && map.hasLayer(_layer)) {
      map.removeLayer(_layer)
    }
    _layer = null
  }
})
</script>

<template>
  <div class="pollution-source-inventory" />
</template>
