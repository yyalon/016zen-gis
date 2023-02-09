<template>
  <!-- <z-view :class-name="className" :x="x" :y="y">
    <slot />
  </z-view> -->
  <div class="z-box" :class="className">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Box',
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initX: 0,
      initY: 0
    }
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.z-box {
  background: #001a3e;
  border: 2px solid #00a5fb;
  border-radius: 5px;
  box-shadow: 1px 1px 1px #333131 inset;
  box-shadow: -2px 2px 3px #0223526b;
}
</style>
