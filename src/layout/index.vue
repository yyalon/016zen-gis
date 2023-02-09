<template>
  <div class="system-gis">
    <nav-bar />
    <div class="view-container">
      <router-view />
      <z-map :map-options="options" @map-loaded="mapLoaded" />
    </div>
  </div>
</template>

<script>
import NavBar from './components/navBar'

import config from '@/config/'
export default {
  name: 'LayoutG',
  components: { NavBar },
  data() {
    return {
      options: config.map3d
    }
  },
  computed: {},
  mounted() {},
  methods: {
    mapLoaded() {}
  }
}
</script>
<style lang="scss">
.distance-legend {
  right: 30px;
  z-index: 6000;
  .distance-legend-label {
    font-size: 16px;
    font-weight: normal;
  }
  .distance-legend-scale-bar {
    border-left: 2px solid #ffffff;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
  }
}
</style>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.system-gis {
  .view-container {
    position: relative;
    font-size: 12px;
    width: 100%;
    height: calc(100% - 55px);
    background-image: url('../assets/img/bg.png');
    background-size: 100% 100%;
    overflow: hidden;
  }
}
.side-info {
  position: fixed;
  top: 100px;
  width: 16%;
  height: calc(100% - 100px - 64px);
  z-index: 200;
  &.left {
    left: 0;
  }
  &.right {
    right: 0;
  }
}
.full-screen {
  position: fixed;
  right: 10px;
  top: 10px;
  font-size: 22px;
  cursor: pointer;
  z-index: 4000;
  color: #fefefe;
  transition: 0.5s;
  &:hover {
    color: #d0d0d0;
    font-size: 30px;
  }
}
</style>
