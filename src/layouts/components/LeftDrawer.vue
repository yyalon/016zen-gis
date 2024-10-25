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
  <ZDrawer :drawer-visible="drawerVisible" direction="ltr" :width="499">
    <slot />
  </ZDrawer>
</template>

<style lang="scss">
.z-drawer {
  bottom: 0 !important;
  top: 94px !important;
  height: calc(100% - 94px) !important;
  background-color: #091b31 !important;
  overflow: visible;

  &::after {
    content: "";
    width: 1308px;
    height: 50px;
    position: absolute;
    bottom: 9px;
    background-size: 100% 100%;
    background-image: url("@/assets/images/header/footer.png");
    background-repeat: no-repeat;
  }

  &.ltr::after {
    right: -47px;
  }

  .el-drawer__body {
    padding: 0;
  }
}
</style>
