<script>
import dayjs from 'dayjs'
import DrawerRiverSection from '../drawer/RiverSection.vue'
import PopupRiverSection from '../popup/RiverSection.vue'
import ZFrame from '../ZFrame.vue'
import LayerMajorPollutantsConcentrationsTrend from '../chart/LayerMajorPollutantsConcentrationsTrend.vue'
import eventBus from '@/utils/eventBus'
import apiData from '@/api/modules/data'
import areas from '@/utils/area.json'
import { romanToInt } from '@/utils'

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
    const end = new Date()
    end.setDate(1)
    end.setMonth(end.getMonth() - 1)

    return {
      loadingRiverSections: false,
      areas: areas.filter((zone) => ['全部', '上海市', '浙江省', '江苏省'].includes(zone.label)),
      estuary: false,
      selectedArea: '全部',
      selectedAreaNode: null,
      riverSections: [],
      filteredRiverSections: [],
      drawerVisible: false,
      drawerData: {},
      watersheds: [],
      watershed: '',
      rivers: [],
      river: '全部',
      columns,
      showList: false,
      timeSlot: end,
      trendVisible: false,
      area: '东海区',
      radio1: '水质',
    }
  },
  watch: {},
  async mounted() {
    eventBus.on('showtrend', () => {
      this.trendVisible = !this.trendVisible
    })
    // await this.getWaterQuality()
    await this.showLayer()
  },
  unmounted() {
    _layer?.clear()
    window.$zMap.removeLayer(_layer)
    _layer = null
  },
  beforeUnmount() {
    eventBus.off('filterparam')
  },
  methods: {
    async filterRiverSections(value) {
      this.loadingRiverSections = true
      this.filteredRiverSections = []
      await this.getData()
      this.riverSections.forEach((section) => {
        const _qualitied = true
        if (this.selectedArea && section.atProvince !== this.selectedArea && section.atCity !== this.selectedArea) {
          // _qualitied = false
        }
        if (this.estuary && !section.type?.includes('入海口')) {
          // _qualitied = false
        }
        if (this.river && section.name !== this.river) {
          // _qualitied = false
        }
        if (_qualitied) {
          this.filteredRiverSections.push(section)
        }
        // this.filteredRiverSections.push(section)
      })
      setTimeout(() => {
        this.loadingRiverSections = false
      }, 1000)
      this.sendRiverFilterParam()
    },
    estuaryChange() {
      _layer?.remove()
      this.showLayer()
    },
    refreshLayer() {
      _layer.clear()
      this.filteredRiverSections.forEach((riverSection) => {
        const arr = ['Ⅰ', 'Ⅱ', 'Ⅲ']
        // const compliant = arr.includes(riverSection?.level2018)
        let noDabiao = false
        if (parseFloat(riverSection.N2023) > parseFloat(riverSection.N2025) || romanToInt(riverSection.W2023) > romanToInt(riverSection.W2025)) {
          // 不达标
          noDabiao = true
        }
        // const compliant = this.dictWaterQuality[riverSection.code]?.compliant
        const graphic = new window.$ZMap.graphic.Marker({
          latlng: [riverSection.latitude, riverSection.longitude],
          style: {
            image: !noDabiao ? 'img/marker/river.png' : 'img/marker/river_red.png',
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
          const arr = ['Ⅰ', 'Ⅱ', 'Ⅲ']
          const compliant = arr.includes(riverSection?.level2018)

          const graphic = new window.$ZMap.graphic.Marker({
            latlng: [riverSection.latitude, riverSection.longitude],
            style: {
              image: compliant ? 'img/marker/river.png' : 'img/marker/river_red.png',
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
      const res = await apiData.getWaterQuality()
      if (res && res.code === 1000) {
        this.riverSections = res.data
      }

      if (!this.estuary) {
        const allRivers = await apiData.getRiverSections()
        if (res && res.code === 1000) {
          this.riverSections = this.riverSections.concat(allRivers.data)
        }
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
        disableClusteringAtZoom: !this.estuary ? 18 : 1, // 此级别下不聚合
      })
      window.$zMap.addLayer(_layer)
      await this.filterRiverSections()
      this.refreshLayer()
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
      }
      else if (this.selectedAreaNode?.level === 2) {
        city = this.selectedArea
        province = this.selectedAreaNode.parent.data.label
      }
      const area = this.area === '东海区' ? '' : this.area
      const river = this.river === '全部' ? '' : this.river
      eventBus.emit('filterparam', {
        area,
        dm_name: river,
        city,
        province,
        time: dayjs(this.timeSlot).format('YYYY-MM-DD'),
      })
    },
    disabledDate(time) {
      const end = new Date()
      end.setDate(1)
      end.setMonth(end.getMonth() - 1)
      return time.getTime() > end.getTime()
    },

    handleAreasClick(node, curentNode) {
      this.selectedAreaNode = curentNode
      // console.log('handleAreasClick', node, curentNode)
      this.river = '全部'
      const code = node.code.replace(/0+$/, '')
      this.calcRivers(code)
    },
    toggleView() {
      this.trendVisible = !this.trendVisible
    },
    closeLayerTrend() {
      this.trendVisible = false
    },
    async getWaterQuality() {
      // const res = await apiData.getWaterQuality()
      // if (res && res.code === 1000) {
      //   // console.log('getWaterQuality', res.data)
      //   const dictWaterQuality = {}
      //   const arr = ['I', 'Ⅱ', 'Ⅲ']
      //   res.data.forEach((e) => {
      //     let noDabiao = false
      //     //   {
      //     //     "PROVINCE_NAME": "浙江省",
      //     //     "AREA_NAME": "绍兴市",
      //     //     "WQ_INF_YEAR": "2023",
      //     //     "WQ_INF_MONTH": "07",
      //     //     "WQ_PI_CODE": "330600_0001",
      //     //     "WQ_PI_NAME": "曹娥江大闸闸前",
      //     //     "W2023": "Ⅲ",
      //     //     "N2023": 1.99,
      //     //     "W2025": "Ⅲ",
      //     //     "N2025": "2.14"
      //     // }
      //     e.N2025 = parseFloat(e.N2025)
      //     if (e.N2023 >= e.N2025 || !arr.includes(e.W2023)) {
      //       // 不达标
      //       noDabiao = true
      //     }
      //     e.compliant = !noDabiao
      //     return dictWaterQuality[e.WQ_PI_CODE] = e
      //   })
      //   this.dictWaterQuality = dictWaterQuality
      // }
    },
  },
}
</script>

<template>
  <div class="work-zone">
    <div class="filters">
      <div>
        <el-select v-model="area" @change="selectedTimeSlot()">
          <el-option label="东海区" value="东海区" />
          <el-option label="攻坚战区域" value="攻坚战" />
        </el-select>

        <el-tree-select
          v-model="selectedArea"
          :data="areas"
          :render-after-expand="false"
          node-key="label"
          check-strictly
          @node-click="handleAreasClick"
          @change="filterRiverSections"
        />

        <el-select v-model="river" filterable placeholder="请选择断面" @change="filterRiverSections">
          <el-option v-for="(item, index) in rivers" :key="index" :label="item" :value="item" />
        </el-select>
        <el-date-picker
          v-model="timeSlot"
          style="background-color: rgb(0 117 255 / 80%); border: 1px solid rgb(0 117 255 / 80%); color: #fff; box-shadow: none;"
          type="month"
          :disabled-date="disabledDate"
          @change="selectedTimeSlot()"
        />
      </div>
      <el-radio-group v-model="radio1" is-button style="margin-top: 20px;">
        <el-radio-button label="水质类别" value="水质" />
        <el-radio-button label="总氮" value="总氮" />
      </el-radio-group>
      <!-- <el-switch v-model="estuary" style="margin-left: 10px;" active-text="入海口" @change="estuaryChange" />
      <el-switch v-model="showList" active-text="显示列表" />
      <el-button type="primary" @click="toggleView">
        浓度趋势图
      </el-button> -->
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
  position: absolute;
  top: 0;
  left: 512px;
  width: calc(100% - 1024px);
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
    overflow: hidden auto;
    pointer-events: all;
  }

  .layer-trend {
    position: absolute;
    // background: #d7f2f2;
    z-index: 10000;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    min-width: 700px;
    min-height: 300px;
    width: 60vw;
    height: 45vh;
    pointer-events: all;
  }
}
</style>
