<script>
  import { abbreviation, titleEn } from '@/config'
  require('dayjs/locale/zh-cn')
  import dayjs from 'dayjs'
  import { toAdmin } from '@/utils/routes'
  import { mapOptions } from '@/config'
  export default defineComponent({
    props: {},
    setup() {
      const width = 1920
      const height = 1080
      const state = reactive({
        transform: `scale(1,1) translate(-50%, -50%)`,
        abbreviation,
        titleEn,
        mapOptions,
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
    methods: {
      toLogin() {
        toAdmin('/logout')
      },
      toAdminIndex() {
        toAdmin()
      },
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
    <div class="title" @click="toAdminIndex()">{{ abbreviation }}</div>
    <div class="title-en">{{ titleEn }}</div>
    <div class="time" @click="toLogin()">{{ moment(null, 'HH:mm') }}</div>
    <div class="date">{{ moment(null, 'YYYY-MM-DD') }}</div>
    <div class="weekday">{{ moment(null, 'dddd') }}</div>
    <div class="layout-mask"></div>
    <ZMap :map-options="mapOptions" />
  </div>
</template>

<style lang="scss" scoped>
  .vab-layout-gis {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    color: white;
    background-color: black;
    background-image: url(~@/assets/layout_images/bg.png);
    transform-origin: 0px 0px;
    .layout-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background-image: url(~@/assets/layout_images/mask.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .title {
      position: absolute;
      top: 27px;
      left: 749px;
      z-index: 2000;
      width: 424px;
      height: 32px;
      font-family: SourceHanSansCN-Regular;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      text-shadow: rgb(11 113 230 / 0%) 1px 1px 1px;
      user-select: none;
    }
    .title-en {
      position: absolute;
      top: 65px;
      left: 797px;
      z-index: 2000;
      width: 327px;
      height: 14px;
      clip-path: inset(1px 0);
      font-family: SourceHanSansCN-Regular;
      font-size: 13px;
      color: transparent;
      text-align: center;
      user-select: none;
      background: linear-gradient(
        360deg,
        rgb(155, 155, 155) 0%,
        rgb(255, 255, 255) 100%
      );
      background-clip: text !important;
    }
    .time {
      position: absolute;
      top: 14px;
      left: 100px;
      z-index: 2000;
      width: 64px;
      height: 22px;
      font-family: DINPro-Regular;
      font-size: 26px;
      line-height: 26px;
      user-select: none;
    }
    .date {
      position: absolute;
      top: 12px;
      left: 10px;
      z-index: 2000;
      width: 90px;
      height: 11px;
      font-family: DINPro-Regular;
      font-size: 14px;
      line-height: 14px;
      user-select: none;
    }
    .weekday {
      position: absolute;
      top: 27px;
      left: 50px;
      z-index: 2000;
      width: 42px;
      height: 12px;
      font-family: DINPro-Regular;
      font-size: 14px;
      line-height: 14px;
      user-select: none;
    }
  }
</style>
