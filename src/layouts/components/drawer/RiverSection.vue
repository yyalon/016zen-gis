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
    return { drawerVisible: false, riverSectionInfo: [], waterQuality: {} }
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
      await this.getRiverSectionInfo()
      await this.getWaterQuality()
    },
    async getRiverSectionInfo() {
      if (this.drawerData.sectionType === 135) {
        const { code, data } = await apiData.get135RiverSectionInfo({ id: this.drawerData.id })
        if (code === 1000) {
          this.riverSectionInfo = data
        }
      }
      else {
        const { code, data } = await apiData.get145RiverSectionInfo({ id: this.drawerData.id })
        if (code === 1000) {
          this.riverSectionInfo = data
        }
      }
    },
    async getWaterQuality() {
      if (this.drawerData.sectionType === 135) {
        const { code, data } = await apiData.get135WaterQualityBySectionCode({ code: this.drawerData.code })
        if (code === 1000) {
          this.waterQuality = data
        }
      }
      else {
        const { code, data } = await apiData.get145WaterQualityBySectionName({ name: this.drawerData.name })
        if (code === 1000) {
          this.waterQuality = data
        }
      }
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <div clase="drawer-river-section">
    <el-drawer
      v-model="drawerVisible" class="drawer-river-section" :append-to-body="true" direction="btt"
      :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" @close="handleClose()"
    >
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
.drawer-river-section {
  overflow: visible;

  .close-button {
    position: absolute;
    top: -20px;
  }

  .el-icon {
    font-size: 24px;
  }
}
</style>
