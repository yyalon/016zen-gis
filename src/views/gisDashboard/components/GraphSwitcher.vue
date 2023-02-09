<template>
  <div class="graph-switcher">
    <div
      class="button"
      :class="item.key === activeGraph ? 'active' : ''"
      v-for="(item, index) in graphs"
      :key="index"
      @click="handleClick(item.key)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GraphSwitcher',
  props: {
    activeGraph: {
      type: String,
      default: 'quality'
    }
  },
  data() {
    return {
      graphs: [
        { text: '入海河流', key: 'river' },
        { text: '入海排污口', key: 'outfall' },
        { text: '海洋环境质量', key: 'quality' },
        { text: '海洋生态状况', key: 'biology' },
        { text: '气象信息', key: 'meteorology' }
        // { text: '遥感专题', key: 'satellite' }
      ]
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handleClick(key) {
      if (key !== this.activeGraph) {
        this.$emit('update:activeGraph', key)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.graph-switcher {
  position: fixed;
  bottom: 30px;
  margin-left: -277px;
  left: calc(50% - 200px);
  user-select: none;
  color: #a4d5ff;
  display: flex;
  justify-content: space-between;
  padding-right: 9px;
  .button {
    width: 125px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    transition: 0.3s all ease-in-out;
    background-size: 100% 100%;
    margin-right: 9px;
    cursor: pointer;
    text-align: center;
    position: relative;
    filter: grayscale(0%) brightness(120%);
    &.active {
      filter: hue-rotate(136deg) saturate(116%);
    }
    &::after {
      background: url(data:image/png;base64,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)
        no-repeat;
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      transition: 0.1s all ease-in-out;
      background-size: contain;
      background-size: 100% 100%;
    }
    &:hover {
      &::after {
        opacity: 0.8;
      }
    }

    &:active {
      transform: translateY(2px);
      &::after {
        top: 2px;
      }
    }
  }
}
</style>
