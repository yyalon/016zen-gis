<script>
export default {
  name: 'ZDrawer',
  props: {
    direction: {
      type: String,
      default: 'rtl',
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 500,
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
    drawerVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: true,
      mydirection: 'ltr',
    }
  },
  watch: {
    drawerVisible() {
      this.visible = this.drawerVisible
    },
  },
  mounted() {
    this.visible = this.drawerVisible
  },
}
</script>

<template>
  <el-drawer
    v-model="visible" class="z-drawer" :with-header="false" :size="width" :title="title" :modal="false"
    :append-to-body="false" :direction="direction" :show-close="false" :wrapper-closable="false"
  >
    <slot />
  </el-drawer>
</template>

<style>
div:has(> .z-drawer) {
  pointer-events: none;
}

.z-drawer {
  pointer-events: all;
  background-color: unset !important;
  box-shadow: unset !important;

  .el-drawer__body {
    padding: 0 12px 40px !important;
  }
}
</style>
