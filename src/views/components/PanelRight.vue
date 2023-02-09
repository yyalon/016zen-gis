<template>
  <div>
    <z-drawer :width="width" direction="rtl" :drawer-visible="visible">
      <div slot="content">
        <slot name="content" />
      </div>
    </z-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Box from '@/layout/components/box'

export default {
  name: 'PanelRight',
  components: { Box },
  props: {
    width: {
      type: Number,
      default: 270
    }
  },
  data() {
    return { visible: true }
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.z-drawer {
  top: 55px;
  height: calc(100% - 80px);
  margin-left: 10px;
  ::v-deep .el-drawer {
    background-color: unset;
  }
  ::v-deep header {
    color: white;
    display: none;
  }
  ::v-deep .el-drawer__body {
    height: 100%;
    background-image: linear-gradient(90deg, #001a3e00 1%, #001a3e 80%);
  }
}
.top {
  height: 24px;
  background: linear-gradient(90deg, #00609c 0%, #001f44 95%);
  .left {
    width: 50px;
    height: 100%;
    background: url('../../assets/img/top_left.png') no-repeat;
    background-size: 100%;
    border-top-left-radius: 2px;
  }
  .actions {
    position: absolute;
    right: 5px;
    top: 4px;
    height: 20px;
    .action {
      width: 20px;
      cursor: pointer;
      &.hide-panel {
        background: url('../../assets/img/left_hide.png') no-repeat;
        background-size: cover;
      }
    }
  }
}
::v-deep .even-row-style {
  color: white;
  background-color: #003461 !important;
}
::v-deep .odd-row-style {
  color: white;
  background-color: #001a3e !important;
}
::v-deep .actions {
  display: flex;
  .item {
    width: 20px;
    height: 20px;
    .iconfont {
      width: 20px;
      height: 20px;
    }
  }
}
::v-deep .el-table td {
  padding: 0;
  border-bottom: none;
  font-size: 12px;
}
::v-deep .el-table .cell {
  cursor: pointer;
  padding: 5px;
  line-height: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
::v-deep .el-table--border::after,
::v-deep .el-table--group::after,
::v-deep .el-table::before {
  background-color: unset;
}
::v-deep .panel-content {
  display: flex;
  overflow-y: auto;
  height: calc(100% - 24px);
  .left {
    width: 40px;
    border-right: 2px solid #00a5fb;
  }
  .list {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.task-tools {
  position: absolute;
  bottom: 2px;
}

.docker {
  position: fixed;
  top: 65px;
  left: -4px;
  z-index: 5000;
  background: #001a3e;
  border: 2px solid #00a5fb;
  border-radius: 5px;
  .item {
    width: 55px;
    height: 55px;
    &:hover {
      background: #06a5fd45;
    }
    .item-icon {
      cursor: pointer;
      height: 55px;
      width: 55px;
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 75%;
      &.show-panel {
        background-image: url('../../assets/img/right_hide.png');
      }
    }
  }
}
</style>
