<script>
export default {
  name: 'ZFrame',
  components: {},
  props: {
    title: {
      type: String,
      default: '',
    },
    width: {
      type: [Number, String],
      default: 375,
    },
    height: {
      type: [Number, String],
      default: 220,
    },
  },
  data() {
    return {
    }
  },
  computed: {},
  mounted() { },
  methods: {},
}
</script>

<template>
  <div class="z-frame"
    :style="{ width: typeof width === 'Number' ? `${width}px` : width, height: typeof height === 'Number' ? `${height}px` : height }">
    <div v-if="title" class="z-frame-title">
      {{ title }}
    </div>
    <div class="z-frame-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.z-frame {
  display: flex;
  flex-direction: column;
  background: #00000021;
  border-radius: 5px;

  .z-frame-title {
    user-select: none;
    width: 100%;
    height: 36px;
    font-family: SourceHanSansCN-Regular;
    color: rgb(255 255 255);
    font-weight: normal;
    font-style: normal;
    text-decoration: none;
    text-shadow: rgb(11 113 230 / 0%) 1px 1px 1px;
    font-size: 1em;
    text-indent: 0;
    letter-spacing: 0;
    text-align: left;
    white-space: pre-wrap;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 0 0 36px;
    display: flex;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
    background-image: url("@/assets/images/frame_title_bg.png");
    background-repeat: no-repeat;
    background-size: 370px 36px;
  }

  .z-frame-content {
    flex: 1;
  }
}
</style>
