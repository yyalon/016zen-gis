<script>
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { pollEutrophicationTask } from '@/utils/eutrophicationFlow'

export default {
  props: {
    buttons: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  emits: ['excuteCommand'],
  data() {
    return {
      eutrophicationBusy: false,
    }
  },
  computed: {
    eutrophicationUploadAction() {
      if (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true') {
        return '/proxy/api/Eutrophication/upload'
      }
      const base = String(import.meta.env.VITE_APP_API_BASEURL || '').replace(/\/$/, '')
      return `${base}/api/Eutrophication/upload`
    },
    eutrophicationUploadHeaders() {
      const store = useUserStore()
      return {
        Token: store.token,
        Authorization: store.token,
      }
    },
  },
  mounted() {},
  methods: {
    stopToolbarEvent() {},
    excuteCommand(command, value) {
      this.$emit('excuteCommand', { command, value })
    },
    zoomIn() {
      window.$zMap.zoomIn()
    },
    zoomOut() {
      window.$zMap.zoomOut()
    },
    flyHome() {
      window.$zMap.flyHome()
    },
    reload() {
      history.go(0)
    },
    fullScreen() {
      window.$zMap.toggleFullscreen()
    },
    parseEutrophicationUploadResponse(raw) {
      if (raw == null) {
        return null
      }
      if (typeof raw === 'string') {
        try {
          return JSON.parse(raw)
        }
        catch {
          return null
        }
      }
      return raw
    },
    async onEutrophicationUploadSuccess(response) {
      const res = this.parseEutrophicationUploadResponse(response)
      try {
        if (!res?.success) {
          ElMessage.error(res?.message || '上传失败')
          return
        }
        ElMessage.success(res.result?.message || res.message || '上传成功')
        const taskId = res.result?.taskId
        if (!taskId) {
          ElMessage.error('未返回任务 ID')
          return
        }
        await pollEutrophicationTask(taskId)
      }
      finally {
        this.eutrophicationBusy = false
        this.$refs.eutrophicationUploadRef?.clearFiles?.()
      }
    },
    onEutrophicationUploadError(error) {
      const msg = error?.message || String(error) || '上传失败'
      ElMessage.error(msg)
      this.eutrophicationBusy = false
      this.$refs.eutrophicationUploadRef?.clearFiles?.()
    },
    beforeEutrophicationUpload(file) {
      const okExt = ['xlsx', 'xls', 'csv', 'zip']
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext && !okExt.includes(ext)) {
        ElMessage.error(`请上传 ${okExt.join(' / ')} 格式文件`)
        return false
      }
      this.eutrophicationBusy = true
      return true
    },
  },
}
</script>

<template>
  <div class="toolbar">
    <div class="button home" @click="flyHome()">
      <el-icon>
        <svg-icon name="ep:home-filled" />
      </el-icon>
    </div>
    <div class="button zoom-in" @click="zoomIn()">
      <el-icon>
        <svg-icon name="ep:plus" />
      </el-icon>
    </div>
    <div class="button zoom-out" @click="zoomOut()">
      <el-icon>
        <svg-icon name="ep:minus" />
      </el-icon>
    </div>
    <div class="button zoom-out" @click="reload()">
      <el-icon>
        <svg-icon name="ep:refresh" />
      </el-icon>
    </div>
    <div class="button zoom-out" @click="fullScreen()">
      <el-icon>
        <svg-icon name="ep:full-screen" />
      </el-icon>
    </div>
    <div class="button-grounp">
      <template v-for="(button, index) in buttons" :key="index">
        <div
          v-if="button.subButtons && button.subButtons.length > 0 && button.value === 'threeLevelAreas'"
          class="button"
          :class="button.visibility ? 'active' : ''"
          @click="excuteCommand('toggleThreeLevelAreasToolbar')"
        >
          <div class="button" style="margin: 0;" :class="button.visibility ? 'active' : ''">
            <el-icon>
              <svg-icon :name="button.icon" />
            </el-icon>
            <div class="name">
              {{ button.name }}
            </div>
          </div>
          <div
            v-if="button.showSubButtons && button.visibility"
            class="sub-buttons"
            @click.stop="stopToolbarEvent"
          >
            <div
              v-for="(sb, sIndex) in button.subButtons"
              :key="sIndex"
              class="sub-button"
            >
              <el-upload
                v-if="sb.command === 'eutrophicationUpload'"
                ref="eutrophicationUploadRef"
                class="eutrophication-toolbar-upload eutrophication-sub-upload"
                :action="eutrophicationUploadAction"
                :headers="eutrophicationUploadHeaders"
                :show-file-list="false"
                :limit="1"
                name="file"
                accept=".xlsx,.xls,.csv,.zip"
                :disabled="eutrophicationBusy || !button.visibility"
                :before-upload="beforeEutrophicationUpload"
                @success="onEutrophicationUploadSuccess"
                @error="onEutrophicationUploadError"
              >
                <!-- 勿在触发器上使用 @click.stop，否则会阻断 el-upload 内部打开文件对话框 -->
                <div class="name eutrophication-upload-trigger">
                  {{ sb.name }}
                </div>
              </el-upload>
            </div>
          </div>
        </div>
        <div
          v-else-if="button.subButtons && button.subButtons.length > 0"
          class="button"
          :class="button.visibility ? 'active' : ''"
          @click="button.showSubButtons = !button.showSubButtons"
        >
          <div class="button" style="margin: 0;" :class="button.visibility ? 'active' : ''">
            <el-icon>
              <svg-icon :name="button.icon" />
            </el-icon>
            <div class="name">
              {{ button.name }}
            </div>
          </div>
          <div v-if="button.showSubButtons" class="sub-buttons">
            <div v-for="(sb, sIndex) in button.subButtons" :key="sIndex" class="sub-button" :class="sb.active ? 'active' : ''">
              <div class="name" @click.stop="excuteCommand(sb.command, sb.value)">
                {{ sb.name }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="button" :class="button.visibility ? 'active' : ''" @click="excuteCommand(button.command, button.value)">
          <el-icon>
            <svg-icon :name="button.icon" />
          </el-icon>
          <div class="name">
            {{ button.name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  bottom: 88px;
  left: 521px;
  z-index: 1000;
  position: absolute;
  user-select: none;
  width: 156px;
  padding: 18px;

  :deep(.eutrophication-toolbar-upload) {
    display: block;

    .el-upload {
      display: block;
      border: none;
      background: transparent;
      justify-content: flex-start;
    }

    .el-upload:focus {
      outline: none;
    }

    .eutrophication-upload-trigger {
      cursor: pointer;
    }
  }

  .button.disabled {
    opacity: 0.55;
    pointer-events: none;
    cursor: not-allowed;
  }

  .button-grounp {
    position: relative;
    margin-top: 2em;

    &::after {
      inset: 0;
      width: 2.2em;
      background-color: rgb(63 158 255 / 60%);
      border-radius: 8px;
      position: absolute;
      z-index: -1;
      content: " ";
    }

    .button {
      background: none;
    }
  }

  .button {
    position: relative;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    width: 36px;
    min-height: 36px;
    border-radius: 8px;
    color: white;
    background-color: rgb(63 158 255 / 60%);
    margin-bottom: 5px;
    transition: all 0.3s linear;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &.active {
      background: #fffb75;
      color: #242424ba;
    }

    &:active {
      transform: translateY(4px);

      &::after {
        top: 2px;
      }
    }

    &:hover {
      background-color: rgb(63 158 255 / 100%);
      color: white;
    }

    > .button {
      background-color: inherit;
      color: inherit;
    }

    .sub-buttons {
      display: flex;
      flex-direction: column;
      z-index: 1001;

      .sub-button {
        height: 36px;
        width: 36px;
        font-size: 16px;
        position: relative;

        &.active {
          .name {
            background-color: #fffb75;
          }
        }

        .name {
          left: 38px;
          position: absolute;
        }
      }
    }

    .name {
      font-size: 0.8em;
      position: absolute;
      left: 2.4em;
      top: 6px;
      height: 1.6em;
      transition: background-color 0.3s;
      text-shadow: 0 0 4px black;
      line-height: 1.6em;
      border-radius: 0.8em;
      text-align: left;
      width: max-content;
      padding: 0 10px;
      color: white;

      &:hover {
        background-color: #3f9eff;
      }
    }
  }
}
</style>
