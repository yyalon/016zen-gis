<script>
// import LandPollutant from '../layer/LandPollutant.vue'
// import AirPollutant from '../layer/AirPollutant.vue'
import LeftDrawer from '../LeftDrawer.vue'
import RightDrawer from '../RightDrawer.vue'
import ChartPollutantCityQuarterly from '../chart/PollutantCityQuarterly.vue'
import ChartPollutantCityPie from '../chart/PollutantCityPie.vue'
import ChartPollutantSeaFlux from '../chart/PollutantSeaFlux.vue'
import ChartPollutantEstuaryBay from '../chart/PollutantEstuaryBay.vue'

export default {
  components: { LeftDrawer, RightDrawer, ChartPollutantCityQuarterly, ChartPollutantCityPie, ChartPollutantSeaFlux, ChartPollutantEstuaryBay },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'land',
    },
  },
}
</script>

<template>
  <div>
    <!-- <LandPollutant v-if="visible && type === 'land'" />
    <AirPollutant v-if="visible && type !== 'land'" /> -->
    <LeftDrawer :drawer-visible="visible">
      <ChartPollutantCityQuarterly />
      <ChartPollutantCityPie />
    </LeftDrawer>
    <RightDrawer :drawer-visible="visible">
      <ChartPollutantSeaFlux />
      <ChartPollutantEstuaryBay />
    </RightDrawer>
  </div>
</template>
