<script>
import RightDrawer from './RightDrawer.vue'

export default {
  components: {
    RightDrawer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <RightDrawer :drawer-visible="visible" />
</template>
