<template>
  <el-popover
    v-model="visible"
    placement="bottom"
    title="选择颜色"
    trigger="manual"
  >
    <sketch-picker v-model="color" />
    <div class="buttons">
      <el-button
        size="mini"
        type="danger"
        @click="cancel"
      >取消</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="confirm"
      >确定</el-button>
    </div>
    <template slot="reference">
      <slot name="reference" />
    </template>
  </el-popover>
</template>
<script>
import { Sketch } from 'vue-color'
export default {
  name: 'ZColor',
  components: { 'sketch-picker': Sketch },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popoverVisible: false,
      color: ''
    }
  },
  watch: {},
  methods: {
    cancel() {
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$emit('ok', { ...this.color })
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.vc-sketch {
  padding: 0;
  box-shadow: none;
}
.buttons {
  text-align: right;
}
</style>
