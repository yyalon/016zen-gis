<template>
  <div class="box2" :class="className">
    <div class="box-title">
      <i
        class="icon el-icon-s-data
"
      ></i>
      <slot name="title" />
    </div>
    <div class="box-content">
      <slot />
    </div>
    <div class="box-footer"></div>
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
.box2 {
  background-size: 100% auto;
  position: relative;
  margin: 10px;
  z-index: 10;
  &:before,
  &:after {
    position: absolute;
    width: 8px;
    height: 8px;
    content: '';
    top: 0;
  }
  &:before,
  .box-footer:before {
    left: 0;
  }
  &:after,
  .box-footer:after {
    right: 0;
  }
  .box-title {
    padding: 3px;
    font-size: 16px;
    color: #fff;
    line-height: 36px;
    border-bottom: 1px solid #b5b5b55c;
    .icon {
      margin: 0 5px;
      color: #9cd9fd;
    }
  }
  .box-content {
  }
  .box-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    &:before,
    &:after {
      position: absolute;
      width: 8px;
      height: 8px;
      content: '';
      bottom: 0;
    }
  }
}
</style>
