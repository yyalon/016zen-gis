<template>
  <ZDrawer :drawer-visible="true" direction="rtl" :width="400">
    <slot />
  </ZDrawer>
</template>

<style lang='scss'>
.z-drawer {
  bottom: 0 !important;
  top: unset !important;
  height: calc(100% - 129px) !important;
}
</style>
