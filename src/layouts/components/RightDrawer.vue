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
  <ZDrawer :drawer-visible="drawerVisible" direction="rtl" :width="499">
    <slot />
  </ZDrawer>
</template>

<style lang="scss">
.z-drawer {
  &.rtl::after {
    left: -47px;
    transform: rotateY(180deg);
  }
}
</style>
