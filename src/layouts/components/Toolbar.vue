<script>
export default {
  props: {
    buttons: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  emits: ['excuteCommand'],
  data() {
    return {
    }
  },
  computed: {},
  mounted() { },
  methods: {
    excuteCommand(command, value) {
      this.$emit('excuteCommand', { command, value })
    },
    zoomIn() {
      window.$zMap.zoomIn()
    },
    zoomOut() {
      window.$zMap.zoomOut()
    },
    flyHome() {
      window.$zMap.flyHome()
    },
  },
}
</script>

<template>
  <div class="toolbar">
    <div class="button home " @click="flyHome()">
      <el-icon>
        <svg-icon name="ep:home-filled" />
      </el-icon>
    </div>
    <div class="button zoom-in" @click="zoomIn()">
      <el-icon>
        <svg-icon name="ep:plus" />
      </el-icon>
    </div>
    <div class="button zoom-out" @click="zoomOut()">
      <el-icon>
        <svg-icon name="ep:minus" />
      </el-icon>
    </div>
    <div class="button-grounp">
      <div v-for="(button, index) in buttons" :key="index" class="button" :class="button.visibility ? 'active' : ''"
        @click="excuteCommand(button.command, button.value)">
        <el-icon>
          <svg-icon :name="button.icon" />
        </el-icon>
        <div class="name">
          {{ button.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  bottom: 26px;
  left: 20px;
  z-index: 1000;
  position: absolute;
  user-select: none;

  .button-grounp {
    position: relative;
    margin-top: 2em;

    &::after {
      inset: -1em 0;
      width: 2.2em;
      background-color: rgba(63, 158, 255, 0.6);
      border-radius: 1.1em;
      position: absolute;
      z-index: -1;
      content: "";
    }

    .button {
      background: none;
    }
  }

  .button {
    position: relative;
    font-size: 1.2em;
    line-height: 2em;
    text-align: center;
    width: 1.8em;
    height: 1.8em;
    border-radius: 50%;
    color: white;
    background-color: rgba(63, 158, 255, 0.6);
    margin-bottom: 5px;
    transition: all 0.3s linear;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
      background: #fffb75;
      color: #242424ba;
    }

    &:active {
      transform: translateY(4px);

      &::after {
        top: 2px;
      }
    }

    &:hover {
      background-color: rgba(63, 158, 255, 1);
      color: white;
    }

    .name {
      font-size: .8em;
      position: absolute;
      left: 2.4em;
      top: 6px;
      height: 1.6em;
      transition: background-color 0.3s;
      text-shadow: 0 0 4px black;
      line-height: 1.6em;
      border-radius: .8em;
      text-align: left;
      width: max-content;
      padding: 0 10px;
      color: white;

      &:hover {
        background-color: #3f9eff;
      }
    }

  }
}
</style>
