<template>
  <div ref="popup" class="map-popup" :class="isFullscreen ? 'fullscreen' : ''">
    <component
      :is="componentPopupContent"
      v-if="popupData && popupData.scope"
      :popup-data="popupData.scope.popupData"
      @loaded="handleLoaded"
      @fullscreen="handleFullscreen"
      @exitFullscreen="handleExitFullscreen"
      @closePopup="handleClosePopup"
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
    popupData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isFullscreen: false,
      componentName: '',
      position: null,
      componentPopupContent: null,
      lastX: 0,
      lastY: 0
    }
  },
  computed: {},
  watch: {
    'popupData.position': {
      handler(n) {
        if (n) {
          this.position = n
          this.movePopup()
        }
      },
      deep: true
    },
    'popupData.scope': {
      handler(n) {
        this.loadComponent()
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
    handleLoaded() {
      this.movePopup()
    },
    loadComponent() {
      if (
        this.popupData &&
        this.popupData.scope &&
        this.popupData.scope['popup-component']
      ) {
        const component = Vue.component(
          'com-popup',
          this.popupData.scope['popup-component']
        )
        this.componentPopupContent = component
      }
    },
    movePopup() {
      if (this.position) {
        this.positionPopUp(this.position.clone())
      } else {
        if (this.popupData && this.popupData.position) {
          this.position = this.popupData.position
          this.positionPopUp(this.position.clone())
        }
      }
    },
    init() {
      this.loadComponent()
    },
    positionPopUp(c) {
      const popup = this.$refs.popup
      if (popup.offsetWidth > 0 && popup.offsetWidth > 0) {
        let x = c.x - popup.offsetWidth / 2 - 30
        let y = c.y - popup.offsetHeight - 20

        x = x > 0 ? x : 0
        y = y > 0 ? y : 28

        this.lastX = x
        this.lastY = y
        popup.style.transform =
          'translate3d(' + parseInt(x) + 'px, ' + parseInt(y) + 'px, 0)'
      }
    },
    handleExitFullscreen() {
      const popup = this.$refs.popup
      popup.style.transform =
        'translate3d(' + this.lastX + 'px, ' + this.lastY + 'px, 0)'
    },
    handleFullscreen() {
      const popup = this.$refs.popup
      popup.style.transform = 'none'
    },
    handleClosePopup() {
      this.$emit('closePopup')
    }
  }
}
</script>

<style lang="scss" scoped>
.map-popup {
  position: absolute;
  top: -30px;
  left: 40px;
}
.map-popup-close-button {
  cursor: pointer;
  border: 1px solid #cccccc;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  cursor: pointer;
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  background: #ffffff;
  border-radius: 15px;
  z-index: 1000;
  text-align: center;
  padding: 8px 8px 9px 9px;
  .iconfont {
    width: 12px;
    height: 12px;
  }
}
</style>
