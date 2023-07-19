<script>
import apiData from '@/api/modules/data'

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    drawerData: {
      type: Object,
      default() { return {} },
    },
  },
  emits: ['close'],
  data() {
    return { drawerVisible: false, sewageOutfallDetails: [] }
  },
  watch: {
    async visible() {
      this.drawerVisible = this.visible
      if (this.drawerVisible) {
        await this.getData()
      }
    },
  },
  async mounted() {
  },
  unmounted() {
    this.handleClose()
  },
  methods: {
    async getData() {
      const { code, data } = await apiData.getSewageOutfallInfo({ id: this.drawerData.id })
      if (code === 1000) {
        this.sewageOutfallDetails = data
      }
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <div>
    <el-drawer v-model="drawerVisible" class="drawer-container" :append-to-body="true" direction="btt"
      :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" :with-header="false"
      @close="handleClose()">
      <template #default>
        <div>
          <el-button class="close-button" type="primary" circle size="large" @click="handleClose">
            <el-icon>
              <svg-icon name="ep:close" />
            </el-icon>
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss">
.drawer-container {
  overflow: visible;

  .el-drawer__body {
    padding: 0;
  }

  .close-button {
    position: absolute;
    top: -20px;
    left: 20px;
  }

  .el-icon {
    font-size: 24px;
  }
}
</style>
