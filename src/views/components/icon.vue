<template>
  <div
    class="icon"
    :class="active ? 'active' : ''"
    @click="handleClickIcon(iconData.key)"
  >
    <el-tooltip
      class="item"
      effect="dark"
      :content="iconData.name"
      placement="right"
    >
      <svg-icon class="iconfont" :icon-class="iconData.icon" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'Icon',
  components: {},
  props: {
    iconData: {
      type: Object,
      default: () => {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {
    handleClickIcon(key) {
      this.$emit('click-icon', key)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 38px;
  height: 38px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: radial-gradient(circle at center, #001d42, #005f9c);
  }
  .iconfont {
    width: 40px;
    height: 40px;
    color: white;
    outline: none;
  }
  &.active {
    background: radial-gradient(circle at center, #7bd1fd, #0dadff);
    .iconfont {
      color: #246491;
    }
  }
}
</style>
