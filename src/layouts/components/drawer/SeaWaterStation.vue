<script>
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
    return { drawerVisible: false, seaWaterStationInfo: [], seaWaterQuality: {}, loading: false }
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
      console.log(this.drawerData)
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <div v-loading="loading">
    <el-drawer v-model="drawerVisible" class="drawer-container" :append-to-body="true" direction="btt"
      :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" :with-header="false"
      @close="handleClose()">
      <template #default>
        <div>
          <el-button v-loading="loading" class="close-button" type="primary" circle size="large" @click="handleClose">
            <el-icon>
              <svg-icon name="ep:close" />
            </el-icon>
          </el-button>
        </div>
        <div class="drawer-body">
          <div class="sea-water-station-info">
            <el-descriptions title="点位信息" :column="1" size="small">
              <el-descriptions-item label="点位编码">
                {{ drawerData.site }}
              </el-descriptions-item>
              <el-descriptions-item label="所属海域">
                <el-tag size="large">
                  {{ drawerData.sea }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="所属省份">
                {{ drawerData.province }}
              </el-descriptions-item>
              <el-descriptions-item label="所属市区">
                {{ drawerData.city }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
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

  .drawer-body {
    width: 100%;
    height: 100%;
    display: flex;

    .sea-water-station-info {
      padding: 20px 20px 20px 50px;
      background: #f9f9f9;

      :deep .el-descriptions__body {
        background-color: #f9f9f9;
      }
    }
  }
}
</style>
