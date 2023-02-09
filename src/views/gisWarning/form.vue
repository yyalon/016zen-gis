<template>
  <div class="task-deduce">
    <left-panel :show-hide="true">
      <el-form
        slot="content"
        class="deduce-form-wrapper panel-content"
        size="small"
      >
        <el-form
          ref="warningForm"
          :model="warningForm"
          label-width="60px"
          size="small"
        >
          <el-form-item label="降雨量">
            <el-input v-model="warningForm.rain" placeholder="请输入降雨量" />
          </el-form-item>
          <el-form-item label="降雨残留">
            <el-input v-model="warningForm.rain" placeholder="请输入降雨残留" />
          </el-form-item>
          <el-form-item label="可燃物">
            <el-input v-model="warningForm.rain" placeholder="请输入可燃物" />
          </el-form-item>
          <el-form-item label="温度">
            <el-input v-model="warningForm.rain" placeholder="请输入温度" />
          </el-form-item>
          <el-form-item label="持续风力">
            <el-input v-model="warningForm.rain" placeholder="请输入持续风力" />
          </el-form-item>
          <el-form-item label="空气湿度">
            <el-input v-model="warningForm.rain" placeholder="请输入空气湿度" />
          </el-form-item>
          <el-form-item label="青草覆盖">
            <el-input v-model="warningForm.rain" placeholder="请输入青草覆盖" />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="warningForm.terrainChecked" class="terrain">
              本地区 防火 结束
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleReport()">上报</el-button>
            <el-button type="warning" @click="handlePreview()">预览</el-button>
          </el-form-item>
        </el-form>
      </el-form>
    </left-panel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LeftPanel from '../components/leftPanel'

export default {
  name: 'TaskDeducing',
  components: { LeftPanel },
  data() {
    return {
      fireArea: {},
      interpolatedPoints: [],
      warningForm: {
        rain: '',
        terrainChecked: true
      },
      events: [],
      deducing: false,
      counter: 1,
      si: null
    }
  },
  computed: {
    ...mapGetters(['currentTask', 'user'])
  },
  mounted() {},
  methods: {
    handleReport() {},
    handlePreview() {},

    moveCamera(item) {
      this.currentItem = item
      
      this.$ZMap.Event.$emit('map', {
        action: 'SET_CAMERA_POSITION',
        data: { ...item }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .z-drawer {
  height: 500px;
}
.panel-content {
  padding: 20px;
  ::v-deep .el-form-item__label {
    color: white;
    font-weight: normal;
    font-size: 12px;
  }
  ::v-deep .el-input--small {
    background: none;
  }
  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__content {
    color: #6bcafb;
  }
  ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #6bcafb;
  }
}
</style>
