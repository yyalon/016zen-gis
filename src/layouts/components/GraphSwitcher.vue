<script>
export default {
  name: 'GraphSwitcher',
  props: {
    activeGraph: {
      type: String,
      default: 'quality',
    },
  },
  emits: ['update:activeGraph'],
  data() {
    return {
      graphs: [
        { text: '驾驶舱', key: 'cockpit', src: '/breadcrumb/cockpit.png', active: '/breadcrumb/cockpit-active.png' },
        { text: '入海河流', key: 'river', src: '/breadcrumb/river.png', active: '/breadcrumb/river-active.png' },
        { text: '入海排污口', key: 'outfall', src: '/breadcrumb/outfall.png', active: '/breadcrumb/outfall-active.png' },
        { text: '近岸海域', key: 'ocean', src: '/breadcrumb/ocean.png', active: '/breadcrumb/ocean-active.png' },
        // { text: '气象信息', key: 'meteorology' },
        // { text: '遥感专题', key: 'satellite' }
      ],
    }
  },
  computed: {},
  mounted() { },
  methods: {
    handleClick(key) {
      if (key !== this.activeGraph) {
        this.$emit('update:activeGraph', key)
      }
    },
  },
}
</script>

<template>
  <div class="graph-switcher">
    <div class="graph-left">
      <div
        v-for="(item, index) in graphs.slice(0, graphs.length / 2)" :key="index" class="button" :class="item.key === activeGraph ? 'active' : ''"
        @click="handleClick(item.key)"
      >
        <img :src="item.key === activeGraph ? item.active : item.src">
      </div>
    </div>
    <slot />
    <div class="graph-right">
      <div
        v-for="(item, index) in graphs.slice(-(graphs.length / 2))" :key="index" class="button" :class="item.key === activeGraph ? 'active' : ''"
        @click="handleClick(item.key)"
      >
        <img :src="item.key === activeGraph ? item.active : item.src">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.graph-switcher {
  pointer-events: auto;
  user-select: none;
  width: 100%;
  display: flex;
  align-items: flex-start;

  .graph-left,
  .graph-right {
    display: flex;
    flex-grow: 1;
    position: relative;
    height: 100%;

    &::before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-image: url("@/assets/images/header/extend.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  .button {
    display: inline-block;
    min-width: 218px;
    height: 44px;
    line-height: 32px;
    cursor: pointer;
    padding: 10px 0 6px;
    position: relative;
    transition: 0.1s all ease-in-out;

    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: 100% 100%;
      background-image: url("@/assets/images/header/switch_button.png");
      background-repeat: no-repeat;
    }

    &.active::after {
      background-image: url("@/assets/images/header/switch_button_active.png");
    }

    &:hover {
      opacity: 0.9;
    }
  }

  .graph-left {
    justify-content: flex-end;
    padding-right: 84px;

    .button {
      padding-left: 106px;

      &:not(:last-child) {
        margin-right: -32px;
      }
    }
  }

  .graph-right {
    padding-left: 102px;

    &::before {
      transform: rotateY(180deg);
    }

    .button {
      padding-right: 90px;
      text-align: right;

      &:not(:last-child) {
        margin-left: -32px;
      }

      &::after {
        transform: rotateY(180deg);
      }
    }
  }
}
</style>
