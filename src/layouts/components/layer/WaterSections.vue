<script>
import dayjs from 'dayjs'
import RiverWater from './RiverWater.vue'
import eventBus from '@/utils/eventBus'
import apiData from '@/api/modules/data'
import gisData from '@/api/modules/gis'
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
      rivers: [],
      river: '全部',
      timeSlot: end,
      area: '东海区',
      waterQualityDimension: '水质',
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
    const res = await gisData.geGisConf()
    if (res && res.code === 1000) {
      this.timeSlot = res.data.filterDetaulTime
    }

    await this.sendRiverFilterParam()
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
        this.waterQualityDimension = '水质'

        this.sendWaterQualityDimension()
      }
    },
    async getData(params) {
      const rivers = await apiData.getRiverSections(params)
      if (rivers && rivers.code === 1000) {
        this.riverSections = rivers.data
      }

      this.rivers = [{ name: '全部' }]
      this.riverSections.forEach((riverSection) => {
        if (!this.rivers.find((o) => o.name === riverSection.name)) {
          this.rivers.push(riverSection)
        }
      })
    },
    async sendRiverFilterParam(isDimension) {
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

      const params = {
        area,
        city,
        province,
        time: dayjs(this.timeSlot).format('YYYY-MM-DD'),
      }
      if (!isDimension) {
        eventBus.emit('filterparam', params)
      }

      await this.getData({ ...params, waterQualityDimension: this.waterQualityDimension })
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

      this.sendRiverFilterParam()

      this.showAreaLayer()
    },
    showAreaLayer() {
      this.setLayerVisible(areaLayer, false)
      this.setLayerVisible(selectedAreaLayer, false)
      eventBus.emit('selectRiverByCode', {
        selectCode: null,
      })

      const label = this.area === '攻坚战' ? 'battle' : 'universe'
      let _layer = window.$zMap.getLayerById(`all_${label}`)

      if (!_layer) {
        _layer = new window.$ZMap.layer.GeoJsonLayer({
          id: `all_${label}`,
          zIndex: 2000,
          name: this.area,
          url: `/file/json/${label}.json`,
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

        this.setLayerVisible(_layer, true)
      }

      areaLayer = _layer
    },
    showAreasLayer(code) {
      this.setLayerVisible(selectedAreaLayer, false)
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
    },
    sendWaterQualityDimension() {
      eventBus.emit('waterQualityDimension', {
        waterQualityDimension: this.waterQualityDimension,
      })

      this.sendRiverFilterParam(true)
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
          @change="() => { sendRiverFilterParam(); }"
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
          @change="() => { sendRiverFilterParam(); }"
        />
      </div>
      <el-radio-group v-if="activeGraph !== 'outfall'" v-model="waterQualityDimension" is-button style="margin-top: 20px;" @change="() => { sendWaterQualityDimension(); }">
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
