<script>
import ChartSeaWaterQualityProportion from '../chart/SeaWaterQualityProportion.vue'
import ChartSeaEutrophicationProportion from '../chart/SeaEutrophicationProportion.vue'
import ChartSeaWaterGoodQualitySeasonColumn from '../chart/SeaWaterGoodQualitySeasonColumn.vue'
import ChartSeaWaterGoodQualityProvinceColumn from '../chart/SeaWaterGoodQualityProvinceColumn.vue'
import ChartSeaWaterQualityStationProportionColumn from '../chart/SeaWaterQualityStationProportionColumn.vue'

export default {
  components: {
    ChartSeaWaterQualityProportion,
    ChartSeaEutrophicationProportion,
    ChartSeaWaterGoodQualitySeasonColumn,
    ChartSeaWaterGoodQualityProvinceColumn,
    ChartSeaWaterQualityStationProportionColumn,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    drawerData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['close'],
  data() {
    return { drawerVisible: false, loading: false }
  },
  watch: {
    async visible() {
      this.drawerVisible = this.visible
    },
  },
  async mounted() {},
  unmounted() {
    this.handleClose()
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <div v-loading="loading">
    <el-drawer
      v-model="drawerVisible"
      class="drawer-sea-water-charts-container"
      size="810px"
      :append-to-body="true"
      direction="rtl"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      :with-header="false"
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
        <br>
        <div class="drawer-body">
          <div class="chart-container">
            <ChartSeaWaterQualityProportion :chart-data="drawerData" />
          </div>
          <div class="chart-container">
            <ChartSeaEutrophicationProportion :chart-data="drawerData" />
          </div>
          <div class="chart-container">
            <ChartSeaWaterGoodQualityProvinceColumn :chart-data="drawerData" />
          </div>
          <div class="chart-container">
            <ChartSeaWaterGoodQualitySeasonColumn :chart-data="drawerData" />
          </div>
          <div class="chart-container">
            <ChartSeaWaterQualityStationProportionColumn :chart-data="drawerData" />
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss">
.drawer-sea-water-charts-container {
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.drawer-sea-water-charts-container {
  .el-drawer__body {
    padding: 0;
  }

  .el-icon {
    font-size: 24px;
  }

  .drawer-body {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    gap: 20px;

    .chart-container {
      height: 226px;
      width: 375px;
    }
  }
}
</style>
