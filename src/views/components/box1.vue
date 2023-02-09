<template>
  <div class="box1" :class="className">
    <div class="box-title"><slot name="title" /></div>
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
.box1 {
  border: 1px solid #37bbff30;
  background: rgba(255, 255, 255, 0.04) url(../../assets/img/line.png);
  background-size: auto;
  position: relative;
  margin: 10px;
  z-index: 10;
  &:before,
  &:after {
    position: absolute;
    width: 8px;
    height: 8px;
    content: '';
    border-top: 2px solid #9cd9fd;
    top: 0;
  }
  &:before,
  .box-footer:before {
    border-left: 2px solid #9cd9fd;
    left: 0;
  }
  &:after,
  .box-footer:after {
    border-right: 2px solid #9cd9fd;
    right: 0;
  }
  .box-title {
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 36px;
  }
  .box-content {
    padding: 10px 5px;
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
      border-bottom: 2px solid #9cd9fd;
      bottom: 0;
    }
  }
}
</style>
