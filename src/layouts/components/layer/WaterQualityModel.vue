<script>
import L from 'leaflet'

// 批量导入图片资源
// eager: true 表示立即加载模块
// import: 'default' 表示直接获取默认导出的资源URL
const imagesGlob = import.meta.glob('../../../assets/images/waterQualityModel/*.png', { eager: true, import: 'default' })
// 获取排序后的图片路径列表，确保按顺序播放 (0000 -> 0470)
const imagePaths = Object.keys(imagesGlob).sort()
const imageUrls = imagePaths.map(path => imagesGlob[path])

let _layer = null
let _intervalId = null
let _currentIndex = 0

export default {
  name: 'WaterQualityModel',
  data() {
    return {}
  },
  async mounted() {
    await this.showLayer()
  },
  unmounted() {
    this.stopAnimation()
    if (_layer) {
      if (window.$zMap && window.$zMap.hasLayer(_layer)) {
        window.$zMap.removeLayer(_layer)
      }
      _layer = null
    }
  },
  methods: {
    async showLayer() {
      if (imageUrls.length === 0) {
        console.warn('No water quality model images found.')
        return
      }

      // 坐标范围: SW (23.77..., 117.67...), NE (34.29..., 124.57...)
      // Leaflet 使用 [Lat, Lon] 格式
      const bounds = [
        [23.77111053466797, 117.67220306396484],
        [34.29508972167969, 124.57479858398438],
      ]

      if (!_layer) {
        // 创建图片叠加层
        _layer = L.imageOverlay(imageUrls[_currentIndex], bounds, {
          opacity: 0.8,
          interactive: false, // 不阻挡鼠标事件
        })
        window.$zMap.addLayer(_layer)
      }

      this.startAnimation()
    },

    startAnimation() {
      if (!_intervalId) {
        // 每秒切换一张图片
        _intervalId = setInterval(() => {
          _currentIndex = (_currentIndex + 1) % imageUrls.length
          if (_layer) {
            _layer.setUrl(imageUrls[_currentIndex])
          }
        }, 160)
      }
    },

    stopAnimation() {
      if (_intervalId) {
        clearInterval(_intervalId)
        _intervalId = null
      }
    },
  },
}
</script>

<template>
  <div />
</template>
