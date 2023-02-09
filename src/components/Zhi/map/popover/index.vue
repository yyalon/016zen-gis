<template>
  <div ref="popover" class="popover-container">
    <component
      :is="componentPopoverContent"
      v-if="popoverData && popoverData.scope"
    />
  </div>
</template>
<script>
import Vue from 'vue'
const components = {}
export default {
  name: 'Popup',
  components,
  props: {
    popoverData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      componentName: '',
      position: null,
      componentPopoverContent: null
    }
  },
  computed: {},
  watch: {
    popoverData: {
      handler(n) {
        if (n && n.event && n.event.endPosition) {
          this.position = n.event.endPosition
          this.loadComponent()
          this.movePopup()
        }
      },
      deep: true
    }
  },
  beforeMount() {},
  mounted() {
    this.init()
  },
  beforeDestroy() {},
  methods: {
    loadComponent() {
      if (
        this.popoverData &&
        this.popoverData.scope &&
        this.popoverData.scope['popover-component']
      ) {
        const component = Vue.component(
          'com-popover',
          this.popoverData.scope['popover-component']
        )
        this.componentPopoverContent = component
      }
    },
    movePopup() {
      if (this.position) {
        this.positionPopover(this.position.clone())
      }
    },
    init() {
      this.loadComponent()
    },
    positionPopover(position) {
      const popover = this.$refs.popover
      const x = position.x + 200 + 10
      const y = position.y + 200 + 20
      popover.style.transform =
        'translate3d(' + parseInt(x) + 'px, ' + parseInt(y) + 'px, 0)'
    }
  }
}
</script>

<style lang="scss" scoped>
.popover-container {
  background: #292929;
  max-width: 200px;
  padding: 5px;
  position: absolute;
  line-height: 18px;
  border-radius: 5px;
  color: white;
  top: -200px;
  left: -200px;
  user-select: none;
}
</style>
