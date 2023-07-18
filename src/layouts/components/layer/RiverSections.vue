<script>
import drawerRiverSection from '../drawer/RiverSection.vue'
import PopupRiverSection from '../popup/RiverSection.vue'
import apiData from '@/api/modules/data'
import areas from '@/utils/area.json'

const _layers = {}

const sectionTypes = [
  { value: 135, label: '"十三五"国家地表水环境质量监测断面' },
  { value: 145, label: '"十四五"全国重点流域断面' },
]

export default {
  components: { DrawerRiverSection: drawerRiverSection },
  data() {
    return {
      areas: areas.filter(zone => ['上海市', '浙江省', '江苏省'].includes(zone.label),
      ),
      selectedArea: '',
      sectionTypes,
      sectionType: 135,
      riverSections: { 135: [], 145: [] },
      drawerVisible: false,
      drawerData: {},
      watersheds: [],
      watershed: '',
    }
  },
  watch: {
    sectionType() {
      this.showLayer()
    },
  },
  async mounted() {
    await this.showLayer()
  },
  unmounted() {
    for (const key in _layers) {
      _layers[key].show = false
    }
  },
  methods: {
    selectWatersed() {
      if (_layers[this.sectionType]) {
        const layer = _layers[this.sectionType]
        layer.clear()
        this.riverSections[this.sectionType].forEach((riverSection) => {
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
              this.drawerData.sectionType = this.sectionType
              this.drawerVisible = true
            })

            graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
              e.target.setTooltipContent(window.$ZMap.loadComponentContent(e.target, PopupRiverSection, { popupData: e.target.attr }))
            })

            graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
              window.$ZMap.unloadComponentContent(e.target)
            })
            layer.addGraphic(graphic)
          }
        })
      }
    },
    calcWatersheds() {
      this.watersheds = []
      this.riverSections[this.sectionType].forEach((riverSection) => {
        if (!this.watersheds.includes(riverSection.watershed)) {
          this.watersheds.push(riverSection.watershed)
        }
      })
    },
    async getData() {
      if (this.sectionType === 135) {
        const { code, data } = await apiData.get135RiverSections()
        if (code === 1000) {
          this.riverSections[this.sectionType] = data
        }
      }
      else {
        const { code, data } = await apiData.get145RiverSections()
        if (code === 1000) {
          this.riverSections[this.sectionType] = data
        }
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
      for (const key in _layers) {
        _layers[key].show = false
      }
      if (_layers[this.sectionType]) {
        _layers[this.sectionType].show = true
        this.selectWatersed()
      }
      else {
        _layers[this.sectionType] = new window.$ZMap.layer.ClusterLayer({
          show: false,
          chunkedLoading: true, // 间隔添加数据，以便页面不冻结。
          showCoverageOnHover: false, // 是否显示聚合标记的边界。
          disableClusteringAtZoom: 18, // 此级别下不聚合
        })
        window.$zMap.addLayer(_layers[this.sectionType])

        await this.getData()

        for (let i = 0, len = this.riverSections[this.sectionType].length; i < len; i++) {
          const item = this.riverSections[this.sectionType][i]
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
              this.drawerData.sectionType = this.sectionType
              this.drawerVisible = true
            })

            graphic.on(window.$ZMap.EventType.tooltipopen, (e) => {
              e.target.setTooltipContent(window.$ZMap.loadComponentContent(e.target, PopupRiverSection, { popupData: e.target.attr }))
            })

            graphic.on(window.$ZMap.EventType.tooltipclose, (e) => {
              window.$ZMap.unloadComponentContent(e.target)
            })

            _layers[this.sectionType].addGraphic(graphic)
          }
        }
      }

      setTimeout(() => {
        _layers[this.sectionType].show = true
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
        <el-select v-model="sectionType" size="large">
          <el-option v-for="(item, index) in sectionTypes" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-tree-select v-model="selectedArea" :data="areas" :render-after-expand="false" node-key="label" check-strictly
          size="large" />
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
