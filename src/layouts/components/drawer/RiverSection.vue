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
    return { drawerVisible: false, riverSectionInfo: [], waterQuality: {}, loading: false }
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
      if (this.drawerData.sectionType === 135) {
        await this.get135Data()
      }
      else {
        await this.get145Data()
      }
      // await this.getRiverSectionInfo()
      // await this.getWaterQuality()
    },
    async get135Data() {
      this.loading = true
      const [result1, result2] = await Promise.all([apiData.get135WaterQualityBySectionCode({ code: this.drawerData.code }), apiData.get135RiverSectionInfo({ id: this.drawerData.id })])
      this.loading = false
    },
    async get145Data() {
      this.loading = true
      const [result1, result2] = await Promise.all([apiData.get145WaterQualityBySectionName({ name: this.drawerData.name, province: this.drawerData.atProvince }), apiData.get145RiverSectionInfo({ id: this.drawerData.id })])
      this.loading = false
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
        const { code, data } = await apiData.get145WaterQualityBySectionName({ name: this.drawerData.name, province: this.drawerData.atProvince })
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
  <div v-loading="loading">
    <el-drawer
      v-model="drawerVisible" class="drawer-container" :append-to-body="true" direction="btt"
      :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" :with-header="false"
      @close="handleClose()"
    >
      <template #default>
        <div>
          <el-button v-loading="loading" class="close-button" type="primary" circle size="large" @click="handleClose">
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
