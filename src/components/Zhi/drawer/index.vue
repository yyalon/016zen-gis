<template>
  <el-drawer
    class="z-drawer"
    size="100%"
    :title="title"
    :modal="false"
    :direction="direction"
    :show-close="false"
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :style="{ width: width + 'px', left: direction === 'rtl' ? 'unset' : '' }"
  >
    <slot name="content" />
  </el-drawer>
</template>
<script>
export default {
  name: 'ZDrawer',
  components: {},
  props: {
    direction: {
      type: String,
      default: 'rtl'
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 500
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    drawerVisible: {
      type: Boolean,
      default: true
    }
  }
}
</script>
