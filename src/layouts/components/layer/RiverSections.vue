<script>
import DrawerRiverSection from '../drawer/RiverSection.vue'
import PopupRiverSection from '../popup/RiverSection.vue'
import ZFrame from '../ZFrame.vue'
import LayerMajorPollutantsConcentrationsTrend from '../chart/LayerMajorPollutantsConcentrationsTrend.vue'
import eventBus from '@/utils/eventBus'
import apiData from '@/api/modules/data'
import areas from '@/utils/area.json'

let _layer = null

// at: '富春江'
// riverCenter: '太湖'
// riverLevel: '干流'
// type: null
// waterSystem: '浙闽片水系'
// waterType: '河流'
// watershed: '浙闽片河流'

const columns = [
  {
    key: 2,
    dataKey: 'name',
    prop: 'name',
    title: '断面名称',
    width: 80,
  },
  {
    key: 3,
    dataKey: 'code',
    prop: 'code',
    title: '断面编码',
    width: 120,
  },
  {
    key: 4,
    dataKey: 'atProvince',
    prop: 'atProvince',
    title: '所在省份',
    width: 120,
  },
  {
    key: 5,
    dataKey: 'atCity',
    prop: 'atCity',
    title: '所在地区',
    width: 120,
  },
  {
    key: 6,
    dataKey: 'at',
    prop: 'at',
    title: '所在水体',
    width: 120,
  },
  {
    key: 7,
    dataKey: 'watershed',
    prop: 'watershed',
    title: '所在流域',
    width: 120,
  },
  {
    key: 8,
    dataKey: 'waterType',
    prop: 'waterType',
    title: '水体类型',
    width: 120,
  },
  {
    key: 9,
    dataKey: 'type',
    prop: 'type',
    title: '断面属性',
    width: 160,
  },
]

export default {
  components: { DrawerRiverSection, ZFrame, LayerMajorPollutantsConcentrationsTrend },
  emits: ['filterparam'],
  data() {
    return {
      loadingRiverSections: false,
      areas: areas.filter((zone) => ['全部', '上海市', '浙江省', '江苏省'].includes(zone.label)),
      estuary: false,
      selectedArea: '',
      selectedAreaNode: null,
      riverSections: [],
      filteredRiverSections: [],
      drawerVisible: false,
      drawerData: {},
      watersheds: [],
      watershed: '',
      rivers: [],
      river: '',
      columns,
      showList: false,
      timeSlot: ref([new Date(), new Date()]),
      shortcuts: [
        {
          text: '本月',
          value: [new Date(), new Date()],
        },
        {
          text: '最近半年',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            return [start, end]
          },
        },
        {
          text: '最近一年',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 12)
            return [start, end]
          },
        },
      ],
      trendVisible: false,
    }
  },
  watch: {},
  async mounted() {
    eventBus.on('showtrend', () => {
      this.trendVisible = !this.trendVisible
    })

    await this.showLayer()
  },
  unmounted() {
    _layer.clear()
    window.$zMap.removeLayer(_layer)
    _layer = null
  },
  beforeUnmount() {
    eventBus.off('filterparam')
  },
  methods: {
    filterRiverSections(value) {
      this.loadingRiverSections = true
      this.filteredRiverSections = []

      this.riverSections.forEach((section) => {
        let _qualitied = true
        if (this.selectedArea && section.atProvince !== this.selectedArea && section.atCity !== this.selectedArea) {
          _qualitied = false
        }
        if (this.estuary && !section.type?.includes('入海口')) {
          _qualitied = false
        }
        if (this.river && section.name !== this.river) {
          _qualitied = false
        }
        if (_qualitied) {
          this.filteredRiverSections.push(section)
        }
      })
      this.refreshLayer()
      setTimeout(() => {
        this.loadingRiverSections = false
      }, 1000)
      this.sendRiverFilterParam()
    },
    refreshLayer() {
      _layer.clear()
      this.filteredRiverSections.forEach((riverSection) => {
        const graphic = new window.$ZMap.graphic.Marker({
          latlng: [riverSection.latitude, riverSection.longitude],
          style: {
            image: 'img/marker/river.png',
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
      })
      if (this.filteredRiverSections.length > 0) {
        window.$zMap.fitBounds(_layer.getBounds(), { padding: [80, 80], duration: 5 })
      }
    },
    selectWatersed() {
      _layer.clear()
      this.riverSections.forEach((riverSection) => {
        if (!this.watershed || riverSection.watershed === this.watershed) {
          const graphic = new window.$ZMap.graphic.Marker({
            latlng: [riverSection.latitude, riverSection.longitude],
            style: {
              image: 'img/marker/river.png',
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
    calcRivers(code) {
      this.rivers = []
      !code && this.rivers.push('全部')
      this.riverSections.forEach((riverSection) => {
        if (!this.rivers.includes(riverSection.name) && (!code || riverSection.code.startsWith(code))) {
          this.rivers.push(riverSection.name)
        }
      })
    },
    async getData() {
      const res = await apiData.getRiverSections()
      if (res && res.code === 1000) {
        this.riverSections = res.data
      }
      this.calcRivers()
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

      this.filterRiverSections()

      setTimeout(() => {
        _layer.show = true
        loading.close()
      }, 500)
    },
    selectedTimeSlot() {
      this.sendRiverFilterParam()
    },
    sendRiverFilterParam() {
      let city = ''
      let province = ''
      if (this.selectedAreaNode?.level === 1) {
        city = ''
        province = this.selectedArea
      } else if (this.selectedAreaNode?.level === 2) {
        city = this.selectedArea
        province = this.selectedAreaNode.parent.data.label
      }
      const river = this.river === '全部' ? '' : this.river
      eventBus.emit('filterparam', {
        dm_name: river,
        city,
        province,
        timeSlot: {
          start: this.timeSlot[0],
          startYear: this.timeSlot[0].getFullYear().toString(),
          startMon: (this.timeSlot[0].getMonth() + 1).toString().padStart(2, 0),
          end: this.timeSlot[1],
          endYear: this.timeSlot[1].getFullYear().toString(),
          endMon: (this.timeSlot[1].getMonth() + 1).toString().padStart(2, 0),
        },
      })
    },
    disabledDate(time) {
      return time.getTime() > Date.now()
    },

    handleAreasClick(node, curentNode) {
      this.selectedAreaNode = curentNode
      // console.log('handleAreasClick', node, curentNode)
      this.river = '全部'
      const code = node.code.replace(/0+$/, '')
      this.calcRivers(code)
    },
    closeLayerTrend() {
      this.trendVisible = false
    },
  },
}
</script>

<template>
  <div class="work-zone">
    <div class="filters">
      <el-tree-select
        v-model="selectedArea"
        :data="areas"
        :render-after-expand="false"
        node-key="label"
        check-strictly
        size="large"
        @node-click="handleAreasClick"
        @change="filterRiverSections"
      />

      <el-select v-model="river" filterable placeholder="请选择断面" size="large" @change="filterRiverSections">
        <el-option v-for="(item, index) in rivers" :key="index" :label="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="timeSlot"
        size="large"
        type="monthrange"
        range-separator="-"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        unlink-panels
        :shortcuts="shortcuts"
        :disabled-date="disabledDate"
        @change="selectedTimeSlot()"
      />
      <el-switch v-model="estuary" active-text="入海口" @change="filterRiverSections()" />
      <el-switch v-model="showList" active-text="显示列表" />
    </div>
    <div v-if="showList" class="river-section-list">
      <ZFrame width="100%" height="100%">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              v-loading="loadingRiverSections"
              row-key="id"
              :data="filteredRiverSections"
              :width="width"
              :height="height"
              :columns="columns"
              :cache="filteredRiverSections.length"
            />
          </template>
        </el-auto-resizer>
      </ZFrame>
    </div>
    <DrawerRiverSection :drawer-data="drawerData" :visible="drawerVisible" @close="drawerVisible = false" />
    <LayerMajorPollutantsConcentrationsTrend v-if="trendVisible" class="layer-trend" @close="closeLayerTrend" />
  </div>
</template>

<style>
.custom_tooltp {
  width: auto;
}
</style>

<style lang="scss" scoped>
:deep(.el-empty__image) {
  width: 100px;
}

:deep(.el-empty__description p) {
  color: white;
}

:deep(.el-loading-mask) {
  background-color: rgb(0 0 0 / 80%);
}

.el-switch {
  margin-right: 10px;
}

:deep(.el-switch__label) {
  color: white;
}

.el-date-picker {
  :deep .el-input__inner {
    background-color: transparent !important;
    border-color: #80ffff;
    box-shadow: 1px 1px 5px 1px rgb(128 255 255 / 80%) inset;
  }
}

.work-zone {
  display: flex;

  .filters {
    pointer-events: all;
  }

  .river-section-list {
    position: absolute;
    left: 150px;
    top: 165px;
    width: 1200px;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    pointer-events: all;
  }

  .layer-trend {
    position: absolute;
    // background: #d7f2f2;
    z-index: 10000;
    right: 100px;
    bottom: 0;
    width: 800px;
    height: 300px;
    pointer-events: all;
  }
}
</style>
