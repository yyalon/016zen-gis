<script>
export default {
  name: 'GraphSwitcher',
  props: {
    activeGraph: {
      type: String,
      default: 'quality',
    },
  },
  data() {
    return {
      graphs: [
        { text: '入海河流', key: 'river' },
        { text: '入海排污口', key: 'outfall' },
        { text: '海洋环境质量', key: 'quality' },
        { text: '海洋生态状况', key: 'biology' },
        { text: '气象信息', key: 'meteorology' },
        // { text: '遥感专题', key: 'satellite' }
      ],
    }
  },
  computed: {},
  mounted() { },
  methods: {
    handleClick(key) {
      // if (key !== this.activeGraph) {
      //   this.$emit('update:activeGraph', key)
      // }
    },
  },
}
</script>

<template>
  <div class="graph-switcher">
    <div
      v-for="(item, index) in graphs" :key="index" class="button" :class="item.key === activeGraph ? 'active' : ''"
      @click="handleClick(item.key)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.graph-switcher {
  z-index: 1100;
  position: fixed;
  bottom: 30px;
  margin: 0 auto;
  left: 0;
  right: 0;
  user-select: none;
  display: table;
  justify-content: space-between;
  padding-right: 9px;

  .button {
    display: inline-block;
    width: 175px;
    height: 60px;
    line-height: 65px;
    font-size: 16px;
    color: white;
    background-size: 100% 100%;
    margin-right: 9px;
    cursor: pointer;
    text-align: center;
    padding-left: 42px;
    position: relative;
    transition: 0.1s all ease-in-out;
    background-image: url("@/assets/images/switch_button.png");
    background-repeat: no-repeat;

    &.active {
      transform: translateY(2px);
      color: rgb(255 253 79);
      background-image: url("@/assets/images/switch_button_active.png");
    }

    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      background-size: contain;
      background-size: 100% 100%;
    }

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
