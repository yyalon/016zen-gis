<script>
/**
 * 浮游植物细胞丰度图层组件
 * 功能：
 * 1. 加载并显示浮游植物细胞丰度数据
 * 2. 响应WaterSections组件的日期选择，自动筛选对应年份的数据
 * 3. 如果选择的年份没有数据，自动使用最新年份的数据
 * 4. 使用聚合图层和分块加载优化性能
 * 5. 鼠标悬停显示详细信息
 */
import dayjs from 'dayjs'
import PopupCellAbundance from '../popup/CellAbundance.vue'
import apiData from '@/api/modules/data'
import eventBus from '@/utils/eventBus'

// 全局图层实例
let _layer = null

export default {
  components: { PopupCellAbundance },
  props: {
    // 控制图层显示/隐藏的参数
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cellAbundances: [],
      years: [], // 存储可用的丰度年份列表
      currentYear: null, // 当前选中的年份
      drawerVisible: false,
      drawerData: {},
    }
  },
  watch: {
    // 监听visible参数变化，控制图层显示/隐藏
    visible(val) {
      if (_layer) {
        _layer.show = val
      }
      // 当visible变为true时，加载数据
      if (val) {
        this.showLayer()
      }
    },
  },
  async mounted() {
    await this.getYears()
    // 只有在visible为true时才加载数据
    if (this.visible) {
      await this.showLayer()
    }

    // 监听WaterSections组件的筛选参数变化
    eventBus.on('filterparam', this.handleFilterParamChange)
  },
  beforeUnmount() {
    if (_layer) {
      _layer.show = false
    }
    // 移除eventBus监听
    eventBus.off('filterparam', this.handleFilterParamChange)
  },
  methods: {
    async getYears() {
      const { code, data } = await apiData.getCellAbundanceYears()
      if (code === 1000) {
        // 确保年份是数字类型
        this.years = data.map(year => parseInt(year))
        if (this.years.length > 0) {
          this.currentYear = this.years[0]
        }
      }
    },
    async getData() {
      const { code, data } = await apiData.getCellAbundances({ year: this.currentYear })
      if (code === 1000) {
        this.cellAbundances = data
      }
    },
    async showLayer() {
      const loading = this.isVisible
        ? this.$loading({
          lock: true,
          text: '正在加载地图数据...',
          spinner: 'el-icon-loading',
          background: '#100d17e3',
        })
        : null
      if (_layer) {
        // 清除图层中的所有图形
        _layer?.clear()
      }
      else {
        _layer = new window.$ZMap.layer.ClusterLayer({
          show: false,
          chunkedLoading: true,
          chunkInterval: 200,
          showCoverageOnHover: false,
          disableClusteringAtZoom: 7,
          maxClusterRadius: 50,
        })
        window.$zMap.addLayer(_layer)
      }

      await this.getData()

      for (let i = 0, len = this.cellAbundances.length; i < len; i++) {
        const item = this.cellAbundances[i]
        if (item.LAT && item.LON) {
          const graphic = new window.$ZMap.graphic.Point({
            latlng: [item.LAT, item.LON],
            style: {
              pixelSize: 4,
              color: '#00ff00',
              opacity: 0.8,
              outline: true,
              outlineWidth: 1,
              outlineColor: '#00ff00',
              outlineOpacity: 1.0,
            },
            attr: item,
          })
          graphic.bindTooltip(null, {
            className: 'custom_tooltip',
          })

          graphic.on(window.$ZMap.EventType.tooltipopen, async (e) => {
            e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupCellAbundance, { popupData: e.target.attr }))
          })

          graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
            window.$Utitls.unloadComponentContent(e.target)
          })

          _layer.addGraphic(graphic)
        }
      }

      setTimeout(() => {
        // 根据visible参数设置图层显示状态
        _layer.show = this.visible
        loading?.close()
      }, 500)
    },

    async handleFilterParamChange(params) {
      if (params && params.time) {
        // 从时间参数中提取年份
        const selectedYear = dayjs(params.time).year()
        // 检查该年份是否有丰度数据
        if (this.years.includes(selectedYear)) {
          // 如果有，使用该年份
          if (this.currentYear !== selectedYear) {
            this.currentYear = selectedYear
            await this.showLayer()
          }
        }
        else if (this.years.length > 0) {
          // 如果没有，使用最新年份
          const latestYear = this.years[0]
          if (this.currentYear !== latestYear) {
            this.currentYear = latestYear
            await this.showLayer()
          }
        }
      }
    },
  },
}
</script>

<style>
.custom_tooltip {
  width: auto;
}

.cell-abundance-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
