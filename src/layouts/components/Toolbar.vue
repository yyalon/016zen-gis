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
    return {}
  },
  computed: {},
  mounted() {},
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
    reload() {
      history.go(0)
    },
    fullScreen() {
      window.$zMap.toggleFullscreen()
    },
  },
}
</script>

<template>
  <div class="toolbar">
    <div class="button home" @click="flyHome()">
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
    <div class="button zoom-out" @click="reload()">
      <el-icon>
        <svg-icon name="ep:refresh" />
      </el-icon>
    </div>
    <div class="button zoom-out" @click="fullScreen()">
      <el-icon>
        <svg-icon name="ep:full-screen" />
      </el-icon>
    </div>
    <div class="button-grounp">
      <template v-for="(button, index) in buttons" :key="index">
        <div
          v-if="button.subButtons && button.subButtons.length > 0"
          class="button"
          :class="button.visibility ? 'active' : ''"
          @click="button.showSubButtons = !button.showSubButtons"
        >
          <div class="button" style="margin: 0;" :class="button.visibility ? 'active' : ''">
            <el-icon>
              <svg-icon :name="button.icon" />
            </el-icon>
            <div class="name">
              {{ button.name }}
            </div>
          </div>
          <div v-if="button.showSubButtons" class="sub-buttons">
            <div v-for="(sb, sIndex) in button.subButtons" :key="sIndex" class="sub-button" :class="sb.active ? 'active' : ''">
              <div class="name" @click.stop="excuteCommand(sb.command, sb.value)">
                {{ sb.name }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="button" :class="button.visibility ? 'active' : ''" @click="excuteCommand(button.command, button.value)">
          <el-icon>
            <svg-icon :name="button.icon" />
          </el-icon>
          <div class="name">
            {{ button.name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  bottom: 88px;
  left: 521px;
  z-index: 1000;
  position: absolute;
  user-select: none;
  width: 156px;
  padding: 18px;

  .button-grounp {
    position: relative;
    margin-top: 2em;

    &::after {
      inset: 0;
      width: 2.2em;
      background-color: rgb(63 158 255 / 60%);
      border-radius: 8px;
      position: absolute;
      z-index: -1;
      content: " ";
    }

    .button {
      background: none;
    }
  }

  .button {
    position: relative;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    width: 36px;
    min-height: 36px;
    border-radius: 8px;
    color: white;
    background-color: rgb(63 158 255 / 60%);
    margin-bottom: 5px;
    transition: all 0.3s linear;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

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
      background-color: rgb(63 158 255 / 100%);
      color: white;
    }

    > .button {
      background-color: inherit;
      color: inherit;
    }

    .sub-buttons {
      display: flex;
      flex-direction: column;

      .sub-button {
        height: 36px;
        width: 36px;
        font-size: 16px;
        position: relative;

        &.active {
          .name {
            background-color: #fffb75;
          }
        }

        .name {
          left: 38px;
          position: absolute;
        }
      }
    }

    .name {
      font-size: 0.8em;
      position: absolute;
      left: 2.4em;
      top: 6px;
      height: 1.6em;
      transition: background-color 0.3s;
      text-shadow: 0 0 4px black;
      line-height: 1.6em;
      border-radius: 0.8em;
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
