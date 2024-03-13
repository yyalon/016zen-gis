<script>
export default {
  props: {
    drawerVisible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <ZDrawer :drawer-visible="drawerVisible" direction="rtl" :width="375">
    <slot />
  </ZDrawer>
</template>

<style lang="scss">
.z-drawer {
  bottom: 0 !important;
  top: 100px !important;
  height: fit-content !important;

  .el-drawer__body {
    padding: 0;
  }
}
</style>
