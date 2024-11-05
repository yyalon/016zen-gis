<script>
import dayjs from 'dayjs'
import RiverWater from './RiverWater.vue'
import eventBus from '@/utils/eventBus'
import apiData from '@/api/modules/data'
import areas from '@/utils/area.json'

let areaLayer = null
let selectedAreaLayer = null

export default {
  components: { RiverWater },
  props: {
    activeGraph: {
      type: String,
      default: 'cockpit',
    },
  },
  emits: ['filterparam', 'selectRiverByCode'],
  data() {
    const end = new Date()
    end.setDate(1)
    end.setMonth(end.getMonth() - 1)

    return {
      areas: areas.filter((zone) => ['全部', '上海市', '浙江省', '江苏省', '福建省'].includes(zone.label)),
      selectedArea: '全部',
      selectedAreaNode: null,
      riverSections: [],
      filteredRiverSections: [],
      rivers: [],
      river: '全部',
      timeSlot: end,
      area: '东海区',
      radio1: '水质',
    }
  },
  watch: {
    activeGraph: {
      immediate: true,
      handler(n) {
        this.initSelect(n)
      },
    },
  },
  async created() {
    await this.getData()
  },
  beforeUnmount() {
    this.setLayerVisible(areaLayer, false)
    this.setLayerVisible(selectedAreaLayer, false)
    eventBus.emit('selectRiverByCode', {
      selectCode: null,
    })

    eventBus.off('filterparam')
    eventBus.off('selectRiverByCode')
  },
  methods: {
    initSelect(activeGraph) {
      if (activeGraph === 'river' && this.area !== '攻坚战') {
        this.area = '攻坚战'
        this.handleAreaClick()
      }

      if (activeGraph === 'outfall') {
        this.radio1 = '水质'

        this.sendWaterQualityDimension()
      }
    },
    async filterRiverSections() {
      this.filteredRiverSections = []

      let city = ''
      let province = ''
      if (this.selectedAreaNode?.level === 1) {
        city = ''
        province = this.selectedArea === '全部' ? '' : this.selectedArea
      }
      else if (this.selectedAreaNode?.level === 2) {
        city = this.selectedArea
        province = this.selectedAreaNode.data.label
      }
      this.riverSections.forEach((section) => {
        let _qualitied = true
        if ((province && province !== section.atProvince)
          || (city && city !== section.atCity)
        ) {
          _qualitied = false
        }
        if (_qualitied) {
          this.filteredRiverSections.push(section)
        }
      })

      this.rivers = [{ name: '全部' }]
      this.filteredRiverSections.forEach((riverSection) => {
        if (!this.rivers.find((o) => o.name === riverSection.name)) {
          this.rivers.push(riverSection)
        }
      })
      this.sendRiverFilterParam()
    },
    async getData() {
      const res = await apiData.getRiverSections()
      if (res && res.code === 1000) {
        this.riverSections = res.data
      }

      this.filterRiverSections()
    },
    sendRiverFilterParam() {
      let city = ''
      let province = ''
      if (this.selectedAreaNode?.level === 1) {
        city = ''
        province = this.selectedArea === '全部' ? '' : this.selectedArea
      }
      else if (this.selectedAreaNode?.level === 2) {
        city = this.selectedArea
        province = this.selectedAreaNode.data.label
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
    setLayerVisible(layer, visible) {
      if (layer) {
        layer.show = visible
      }
    },
    handleAreasClick(node, curentNode) {
      this.selectedAreaNode = curentNode
      this.river = '全部'

      const code = node.code.replace(/^0+$/, '')
      if (code) {
        this.showAreasLayer(code)
      }
      else {
        this.showAreaLayer()
      }
    },
    handleAreaClick() {
      this.selectedArea = '全部'
      this.selectedAreaNode = null
      this.river = '全部'

      if (this.area === '攻坚战') {
        this.areas = areas.filter((zone) => ['全部', '上海市', '浙江省', '江苏省'].includes(zone.label))
      }
      else {
        this.areas = areas.filter((zone) => ['全部', '上海市', '浙江省', '江苏省', '福建省'].includes(zone.label))
      }

      this.filterRiverSections()

      this.showAreaLayer()
    },
    showAreaLayer() {
      this.setLayerVisible(selectedAreaLayer, false)
      eventBus.emit('selectRiverByCode', {
        selectCode: null,
      })

      if (this.area === '攻坚战') {
        let _layer = window.$zMap.getLayerById('all_battle')
        if (!areaLayer) {
          _layer = new window.$ZMap.layer.GeoJsonLayer({
            id: 'all_battle',
            zIndex: 2000,
            name: '攻坚战',
            url: '/file/json/universe.json',
            symbol: {
              styleOptions: {
                fillColor: '#3388ff',
                fillOpacity: 0.2,
                outline: true,
                outlineColor: '#3388ff',
                outlineOpacity: 0.5,
                outlineWidth: 2,
              },
            },
          })

          window.$zMap.addLayer(_layer)

          _layer.on(window.$ZMap.EventType.load, () => {
            const bounds = _layer.getBounds()
            if (bounds) {
              window.$zMap.fitBounds(bounds, { padding: [40, 40], duration: 5 })
            }
          })
        }
        else {
          window.$zMap.fitBounds(areaLayer.getBounds(), { padding: [40, 40], duration: 5 })

          this.setLayerVisible(areaLayer, true)
        }

        areaLayer = _layer
      }
      else {
        window.$zMap.flyHome()

        if (areaLayer) {
          this.setLayerVisible(areaLayer, false)
        }
      }
    },
    showAreasLayer(code) {
      if (selectedAreaLayer) {
        this.setLayerVisible(selectedAreaLayer, false)
      }
      this.setLayerVisible(areaLayer, false)
      eventBus.emit('selectRiverByCode', {
        selectCode: null,
      })

      let _layer = window.$zMap.getLayerById(code)
      if (!_layer) {
        _layer = new window.$ZMap.layer.GeoJsonLayer({
          id: code,
          zIndex: 2000,
          name: code,
          url: `/geojson/${code}.geojson`,
          symbol: {
            styleOptions: {
              fillColor: '#3388ff',
              fillOpacity: 0.2,
              outline: true,
              outlineColor: '#3388ff',
              outlineOpacity: 0.5,
              outlineWidth: 2,
            },
          },
        })

        window.$zMap.addLayer(_layer)

        _layer.on(window.$ZMap.EventType.load, () => {
          const bounds = _layer.getBounds()
          if (bounds) {
            window.$zMap.fitBounds(bounds, { padding: [40, 40], duration: 5 })
          }
        })
      }
      else {
        window.$zMap.fitBounds(_layer.getBounds(), { padding: [40, 40], duration: 5 })

        this.setLayerVisible(_layer, true)
      }

      selectedAreaLayer = _layer
    },
    showRiverLayer() {
      if (this.river === '全部') {
        if (selectedAreaLayer) {
          this.setLayerVisible(selectedAreaLayer, true)
        }
        else {
          this.showAreaLayer()
        }
      }
      else {
        this.setLayerVisible(selectedAreaLayer, false)
        this.setLayerVisible(areaLayer, false)
      }
      eventBus.emit('selectRiverByCode', {
        selectCode: this.river === '全部' ? null : this.rivers.find((o) => o.name === this.river)?.code,
      })
      this.sendRiverFilterParam()
    },
    sendWaterQualityDimension() {
      eventBus.emit('waterQualityDimension', {
        waterQualityDimension: this.radio1,
      })
    },
  },
}
</script>

<template>
  <div class="work-zone">
    <div class="filters">
      <div>
        <el-select v-model="area" @change="handleAreaClick">
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

        <el-select v-model="river" placeholder="请选择断面" @change="showRiverLayer">
          <el-option v-for="(item, index) in rivers" :key="index" :label="item.name" :value="item.name" />
        </el-select>
        <el-date-picker
          v-model="timeSlot"
          style="background-color: rgb(0 117 255 / 80%); border: 1px solid rgb(0 117 255 / 80%); color: #fff; box-shadow: none;"
          type="month"
          :clearable="false"
          :disabled-date="disabledDate"
          @change="sendRiverFilterParam"
        />
      </div>
      <el-radio-group v-if="activeGraph !== 'outfall'" v-model="radio1" is-button style="margin-top: 20px;" @change="() => { sendWaterQualityDimension(); }">
        <el-radio-button label="水质类别" value="水质" />
        <el-radio-button label="总氮" value="总氮" />
      </el-radio-group>
    </div>
    <RiverWater v-if="activeGraph !== 'outfall'" />
  </div>
</template>

<style lang="scss" scoped>
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
}
</style>
