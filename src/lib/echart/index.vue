<script>
import tdTheme from './theme.json' // 引入默认主题

export default {
  name: 'Echart',
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    id: {
      type: String,
      default: `chart${+new Date()}`,
    },
    width: {
      type: String,
      default: '10px',
    },
    height: {
      type: String,
      default: '10px',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    options: {
      handler(options) {
        // 设置true清空echart缓存
        this.chart.setOption(options, true)
      },
      deep: true,
    },
  },
  mounted() {
    window.$echarts.registerTheme('tdTheme', tdTheme) // 覆盖默认主题
    this.initChart()
  },
  beforeUnmount() {
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 初始化echart
      this.chart = window.$echarts.init(this.$el, 'tdTheme')
      this.chart.setOption(this.options, true)
    },
  },
}
</script>

<template>
  <div :id="id" :class="className" style="height: 100%;width: 100%;" :style="{ height, width }" />
</template>
