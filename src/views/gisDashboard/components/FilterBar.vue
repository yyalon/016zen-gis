<template>
  <div class="filter-bar">
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-select placeholder="省份" v-model="province">
          <el-option
            :label="province.value"
            :value="province.value"
            v-for="(province, index) in provinces"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="海域" v-model="region">
          <el-option
            :label="region.value"
            :value="region.value"
            v-for="(region, index) in regions"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="switch">
          <div
            class="item"
            v-for="(type, index) in mapTypes"
            :key="index"
            :class="type.value === selectedMapType ? 'selected' : ''"
            @click="selectMapType(type.value)"
          >
            {{ type.text }}
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const mapTypes = [
  { text: '富营养化', value: 'eutrophication' },
  { text: '水质', value: 'waterQuality' }
]
const provinces = [
  { text: '上海', value: '上海' },
  { text: '浙江', value: '浙江' },
  { text: '江苏', value: '江苏' }
]
const regions = [
  { text: '东海', value: '东海' },
  { text: '南海', value: '南海' }
]
export default {
  name: 'FilterBar',
  props: {
    hideRegions: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mapTypes,
      regions,
      selectedMapType: mapTypes[1].value,
      provinces,
      province: '浙江',
      region: ''
    }
  },
  computed: {},
  mounted() {},
  methods: {
    selectMapType(type) {
      if (type !== this.selectedMapType) {
        this.selectedMapType = type
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-bar {
  width: 600px;
  top: 13px;
  left: 5px;
  position: absolute;
  user-select: none;
  .switch {
    margin-top: 4px;
    display: flex;
    align-items: stretch;
    color: #fff3e1;
    background-color: rgba(68, 65, 65, 0.84);
    line-height: initial;
    letter-spacing: 0.05em;
    border-radius: 1em;
    .item {
      cursor: pointer;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      padding: 2px 10px;
      text-align: center;
      transition: 0.3s all ease-in-out;
      &.selected {
        border-radius: 1em;
        color: white;
        background-color: #0faafb;
        box-shadow: 0 0 4px 0 black;
      }
    }
  }
  .button-grounp {
    position: relative;
    width: 25px;
    background-color: #001a3e;
    margin-top: 14px;
    &::before {
      left: 0;
      width: 25px;
      background-color: #001a3e;
      border-radius: 14px;
      position: absolute;
      top: -10px;
      bottom: -10px;
      right: 0;
      content: '';
    }
  }
  .button {
    position: relative;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    color: white;
    background-color: #001a3e;
    margin-bottom: 3px;
    cursor: pointer;
    &:active {
      transform: translateY(2px);
      &::after {
        top: 2px;
      }
    }
    &:hover {
      background-color: #22a9f199;
    }
    .name {
      font-size: 12px;
      position: absolute;
      left: 25px;
      top: 0;
      height: 25px;
      transition: background-color 0.3s;
      text-shadow: 0px 0px 4px black;
      line-height: 25px;
      border-radius: 1.2em;
      text-align: left;
      padding-left: 5px;
      width: max-content;
      padding: 0 10px;
      &:hover {
        background-color: #22a9f199;
      }
    }
    &.all {
      &.active {
        background-color: #0faafb;
        .name {
          &:hover {
            background-color: #0faafb;
          }
        }
      }
    }
    &.outfall-area,
    &.water-quality-station,
    &.fishing-water-quality-station,
    &.waste-monitoring-station,
    &.water-quality-monitoring-section {
      &.active {
        background-color: #e6dfdf;
        .icon {
          color: #979797;
        }
        .name {
          &:hover {
            background-color: #e6dfdf;
          }
        }
      }
    }
    &.red-tide-center {
      &.active {
        background-color: #d3160a;
        .name {
          &:hover {
            background-color: #d3160a;
          }
        }
      }
    }
  }
}
</style>
