<template>
  <div v-draggabilly="{ containment: true }" class="z-view">
    <slot />
  </div>
</template>

<script>
import Draggabilly from 'draggabilly'
export default {
  name: 'ZView',
  components: {},
  directives: {
    draggabilly: {
      bind(elem, binding, vnode, oldVnode) {
        var options = binding.value || {}
        var draggie = new Draggabilly(elem, options)
        var directives = vnode.data.directives
        for (var i in directives) {
          var dir = directives[i]
          if (dir.name === 'draggabilly-on') {
            draggie.on(dir.arg, dir.value)
          } else if (dir.name === 'draggabilly-once') {
            draggie.on(dir.arg, dir.value)
          }
        }
      },
      unbind(elem, binding, vnode, oldVnode) {
        // TODO
      }
    },
    'draggabilly-on': {
      bind(elem, binding, vnode, oldVnode) {
        return // No need to do anything
      }
    },
    'draggabilly-once': {
      bind(elem, binding, vnode, oldVnode) {
        return // No need to do anything
      }
    }
  },
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
    return {}
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.z-view {
  position: absolute !important;
  z-index: 8000;
  right: 100px;
}
</style>
