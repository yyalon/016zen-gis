<script>
  import { abbreviation, titleEn } from '@/config'
  require('dayjs/locale/zh-cn')
  import dayjs from 'dayjs'
  export default defineComponent({
    props: {
      collapse: {
        type: Boolean,
        default() {
          return false
        },
      },
      fixedHeader: {
        type: Boolean,
        default() {
          return true
        },
      },
      showTabs: {
        type: Boolean,
        default() {
          return true
        },
      },
      device: {
        type: String,
        default() {
          return 'desktop'
        },
      },
    },
    setup() {
      const width = 1920
      const height = 1080
      const state = reactive({
        transform: `scale(1,1) translate(-50%, -50%)`,
        abbreviation,
        titleEn,
      })
      onMounted(() => {})

      const moment = (date, format) => {
        return date
          ? dayjs(date).locale('zh-cn').format(format)
          : dayjs().locale('zh-cn').format(format)
      }

      const getScale = () => {
        const w = window.innerWidth / width
        const h = window.innerHeight / height
        return { x: w, y: h }
      }
      const setScale = () => {
        const scale = getScale()
        state.transform = `scale(${scale.x},${scale.y}) translate(-50%, -50%)`
      }

      setScale()
      window.addEventListener('resize', () => {
        setScale()
      })
      return {
        ...toRefs(state),
        moment,
      }
    },
  })
</script>

<template>
  <div
    class="vab-layout-gis"
    :style="{
      transform: transform,
    }"
  >
    <div class="title">{{ abbreviation }}</div>
    <div class="title-en">{{ titleEn }}</div>
    <div class="time">{{ moment(null, 'HH:mm') }}</div>
    <div class="date">{{ moment(null, 'YYYY-MM-DD') }}</div>
    <div class="weekday">{{ moment(null, 'dddd') }}</div>
    <div class="layout-mask"></div>
    <ZMap />
  </div>
</template>

<style lang="scss" scoped>
  .vab-layout-gis {
    color: white;
    background-color: black;
    left: 50%;
    top: 50%;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    position: fixed;
    background-image: url(~@/assets/layout_images/bg.png);
    transform-origin: 0px 0px;
    .layout-mask {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-image: url(~@/assets/layout_images/mask.png);
      background-size: 100% 100%;
    }
    .title {
      position: absolute;
      top: 27px;
      left: 749px;
      width: 424px;
      height: 32px;
      user-select: none;
      font-family: SourceHanSansCN-Regular;
      font-weight: bold;
      text-shadow: rgb(11 113 230 / 0%) 1px 1px 1px;
      font-size: 32px;
      text-align: center;
    }
    .title-en {
      position: absolute;
      top: 65px;
      left: 797px;
      width: 327px;
      height: 14px;
      user-select: none;
      font-family: SourceHanSansCN-Regular;
      color: transparent;
      font-size: 13px;
      text-align: center;
      background: linear-gradient(
        360deg,
        rgb(155, 155, 155) 0%,
        rgb(255, 255, 255) 100%
      );
      background-clip: text !important;
      clip-path: inset(1px 0);
    }
    .time {
      position: absolute;
      top: 14px;
      left: 1754px;
      width: 64px;
      height: 22px;
      user-select: none;
      font-size: 26px;
      line-height: 26px;
      font-family: DINPro-Regular;
    }
    .date {
      position: absolute;
      top: 12px;
      left: 1828px;
      width: 80px;
      height: 11px;
      user-select: none;
      font-size: 14px;
      line-height: 14px;
      font-family: DINPro-Regular;
    }
    .weekday {
      position: absolute;
      top: 27px;
      left: 1828px;
      width: 42px;
      height: 12px;
      user-select: none;
      font-size: 14px;
      line-height: 14px;
      font-family: DINPro-Regular;
    }
  }
</style>
