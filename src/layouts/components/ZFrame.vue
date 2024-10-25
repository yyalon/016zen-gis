<script>
import titleImg from '@/assets/images/titleImg.png'

export default {
  name: 'ZFrame',
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: [Number, String],
      default: 475,
    },
    height: {
      type: [Number, String],
      default: 465,
    },
  },
  data() {
    return {
      titleImg,
    }
  },
  computed: {},
  mounted() {},
  methods: {},
}
</script>

<template>
  <div class="z-frame" :style="{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }">
    <div v-if="title" class="z-frame-title">
      <img :src="titleImg">{{ title }}
    </div>
    <div v-loading="loading" class="z-frame-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.z-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(10 204 204 / 60%);
  padding-left: 11px;

  & + .z-frame {
    margin-top: 16px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 41px;
    height: 2px;
    border-top: 2px solid #0ff;
  }

  .z-frame-title {
    position: relative;
    user-select: none;
    width: 100%;
    font-family: "Microsoft YaHei";
    color: rgb(255 255 255);
    font-weight: 700;
    font-size: 22px;
    text-shadow: 0 0 6px #00e2ff;
    padding: 23px 0 10px 1px;
    display: flex;
    align-items: center;
    background: linear-gradient(0deg, rgb(10 104 204 / 43.2%) 0%, rgb(10 136 204 / 0%) 100%);

    &::after {
      content: "";
      position: absolute;
      bottom: 3px;
      left: 46px;
      right: 5px;
      height: 2px;
      background: url("@/assets/images/titleLine.png") no-repeat;
      background-size: 100% 100%;
    }

    & > img {
      width: 31px;
      margin-right: 16px;
    }
  }

  .z-frame-content {
    flex: 1;
    padding: 28px 10px 0;
    font-size: 14px;
    line-height: 1;
  }

  ::v-deep .el-loading-mask {
    background-color: #1d1d1df7 !important;
  }
}
</style>
