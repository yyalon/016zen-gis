<script>
import dayjs from 'dayjs'
import RiverWater from './RiverWater.vue'
import eventBus from '@/utils/eventBus'
import apiData from '@/api/modules/data'
import areas from '@/utils/area.json'

const _layer = null

export default {
  components: { RiverWater },
  props: {
    activeGraph: {
      type: String,
      default: 'cockpit',
    },
  },
  emits: ['filterparam', 'riverSections'],
  data() {
    const end = new Date()
    end.setDate(1)
    end.setMonth(end.getMonth() - 1)

    return {
      areas: areas.filter((zone) => ['全部', '上海市', '浙江省', '江苏省'].includes(zone.label)),
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
        if (n === 'outfall') {
          this.radio1 = '水质'
        }
      },
    },
  },
  async created() {
    await this.getData()
  },
  beforeUnmount() {
    eventBus.off('filterparam')
    eventBus.off('riverSections')
  },
  methods: {
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
        province = this.selectedAreaNode.parent.data.label
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

      this.rivers = ['全部']
      this.filteredRiverSections.forEach((riverSection) => {
        if (!this.rivers.includes(riverSection.name)) {
          this.rivers.push(riverSection.name)
        }
      })
      this.sendRiverFilterParam()
    },
    async getData() {
      const res = await apiData.getRiverSections()
      if (res && res.code === 1000) {
        this.riverSections = res.data
      }

      eventBus.emit('riverSections', {
        riverSections: res.data,
      })

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
      this.river = '全部'

      const code = node.code.replace(/^0+$/, '')
      if (code) {
        this.showLayer(code)
      }
      else {
        window.$zMap.flyHome()
      }
    },
    selectRiver() {
      const river = this.river === '全部' ? '' : this.river
      const bounds = L.latLngBounds(this.filteredRiverSections.filter((section) => !river || river === section.name).map((section) => ([section.latitude, section.longitude])))
      window.$zMap.flyToBounds(bounds, {
        padding: [80, 80],
        duration: 5,
      })
      this.sendRiverFilterParam()
    },
    showLayer(code) {
      const _layer = window.$zMap.getLayerById(code)
      if (!_layer) {
        const _layer = new window.$ZMap.layer.GeoJsonLayer({
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
        _layer.on(window.$ZMap.EventType.load, (e) => {
          e.graphics.forEach((graphic) => {
            if (graphic.center && graphic.attr && graphic.attr.name) {
              const label = new window.$ZMap.graphic.Label({
                latlng: graphic.center,
                style: {
                  text: graphic.attr.name,
                  color: '#ffffff',
                  font_size: 12,
                  font_family: '楷体',
                  border: true,
                  border_width: 1,
                  border_style: '',
                  border_color: '#000000',
                  className: 'label-name',
                },
              })
              _layer.addGraphic(label)
            }
          })
          setTimeout(() => {
            _layer.show = true

            window.$zMap.fitBounds(_layer.getBounds(), { padding: [40, 40], duration: 5 })
          }, 500)
        })
      }
      else {
        window.$zMap.fitBounds(_layer.getBounds(), { padding: [40, 40], duration: 5 })
      }
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
        <el-select v-model="area" @change="filterRiverSections">
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

        <el-select v-model="river" placeholder="请选择断面" @change="selectRiver">
          <el-option v-for="(item, index) in rivers" :key="index" :label="item" :value="item" />
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
