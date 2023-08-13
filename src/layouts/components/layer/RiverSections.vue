<script>
import DrawerRiverSection from '../drawer/RiverSection.vue'
import PopupRiverSection from '../popup/RiverSection.vue'
import apiData from '@/api/modules/data'
import areas from '@/utils/area.json'

let _layer = null

export default {
  components: { DrawerRiverSection },
  data() {
    return {
      areas: areas.filter(zone => ['上海市', '浙江省', '江苏省'].includes(zone.label),
      ),
      selectedArea: '',
      riverSections: [],
      drawerVisible: false,
      drawerData: {},
      watersheds: [],
      watershed: '',
    }
  },
  watch: {
  },
  async mounted() {
    await this.showLayer()
  },
  unmounted() {
    _layer.clear()
    window.$zMap.removeLayer(_layer)
    _layer = null
  },
  methods: {
    selectWatersed() {
      _layer.clear()
      this.riverSections.forEach((riverSection) => {
        if (!this.watershed || riverSection.watershed === this.watershed) {
          const graphic = new window.$ZMap.graphic.Marker({
            latlng: [riverSection.latitude, riverSection.longitude],
            style: {
              image: '/img/marker/river.png',
              horizontalOrigin: window.$ZMap.HorizontalOrigin.CENTER,
              verticalOrigin: window.$ZMap.VerticalOrigin.BOTTOM,
            },
            attr: riverSection,
          })

          graphic.bindTooltip(null, {
            className: 'custom_tooltp',
          })

          graphic.on(window.$ZMap.EventType.click, (e) => {
            this.drawerData = e.target.attr
            this.drawerVisible = true
          })

          graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
            e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupRiverSection, { popupData: e.target.attr }))
          })

          graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
            window.$Utitls.unloadComponentContent(e.target)
          })
          _layer.addGraphic(graphic)
        }
      })
    },
    calcWatersheds() {
      this.watersheds = []
      this.riverSections.forEach((riverSection) => {
        if (!this.watersheds.includes(riverSection.watershed)) {
          this.watersheds.push(riverSection.watershed)
        }
      })
    },
    async getData() {
      const { code, data } = await apiData.getRiverSections()
      if (code === 1000) {
        this.riverSections = data
      }
      this.calcWatersheds()
    },
    async showLayer() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载地图数据...',
        spinner: 'el-icon-loading',
        background: '#100d17e3',
      })
      _layer = new window.$ZMap.layer.ClusterLayer({
        show: false,
        chunkedLoading: true, // 间隔添加数据，以便页面不冻结。
        showCoverageOnHover: false, // 是否显示聚合标记的边界。
        disableClusteringAtZoom: 18, // 此级别下不聚合
      })
      window.$zMap.addLayer(_layer)

      await this.getData()

      for (let i = 0, len = this.riverSections.length; i < len; i++) {
        const item = this.riverSections[i]
        if (!this.watershed || item.watershed === this.watershed) {
          const graphic = new window.$ZMap.graphic.Marker({
            latlng: [item.latitude, item.longitude],
            style: {
              image: '/img/marker/river.png',
              horizontalOrigin: window.$ZMap.HorizontalOrigin.CENTER,
              verticalOrigin: window.$ZMap.VerticalOrigin.BOTTOM,
            },
            attr: item,
          })

          graphic.bindTooltip(null, {
            className: 'custom_tooltp',
          })

          graphic.on(window.$ZMap.EventType.click, (e) => {
            this.drawerData = e.target.attr
            this.drawerVisible = true
          })

          graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
            e.target.setTooltipContent(window.$Utitls.loadComponentContent(e.target, PopupRiverSection, { popupData: e.target.attr }))
          })

          graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
            window.$Utitls.unloadComponentContent(e.target)
          })

          _layer.addGraphic(graphic)
        }
      }

      setTimeout(() => {
        _layer.show = true
        loading.close()
      }, 500)
    },
  },
}
</script>

<template>
  <div class="river-sections">
    <el-form :inline="true">
      <el-form-item>
        <el-tree-select
          v-model="selectedArea" :data="areas" :render-after-expand="false" node-key="label" check-strictly
          size="large"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="watershed" placeholder="请选择流域" size="large" @change="selectWatersed()">
          <el-option v-for="(item, index) in watersheds" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>

    <DrawerRiverSection :drawer-data="drawerData" :visible="drawerVisible" @close="drawerVisible = false" />
  </div>
</template>

<style>
.custom_tooltp {
  width: auto;
}
</style>

<style lang="scss" scoped>
.river-sections {
  text-align: center;
  pointer-events: auto;
  position: fixed;
  margin: auto;
  top: 120px;
  left: 0;
  right: 0;

  .el-form--inline .el-form-item {
    margin-right: 10px;
  }
}
</style>
