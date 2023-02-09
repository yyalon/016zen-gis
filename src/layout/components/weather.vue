<template>
  <div v-if="weatherReport && weatherReport.text" class="weather-report">
    <span v-if="parseInt(weatherReport.code) < 9" class="item text"
      ><img :src="`/zen/data/weather/${weatherReport.code}.png`" alt=""
    /></span>

    <span v-else class="item text"
      ><img :src="`/data/weather/06.png`" alt=""
    /></span>

    <span class="item temprature">{{ weatherReport.temp }}°C</span>
    <span class="item wind-class"
      >{{ weatherReport.wind_dir }} <br />
      {{ weatherReport.wind_class }}</span
    >
  </div>
</template>

<script>
import { getReverseGeoCode, getWeatherReport } from '@/api/gis.js'
import { mapGetters } from 'vuex'
export default {
  props: {},
  data() {
    return { weatherReport: {} }
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    currentTask: {
      handler(n) {
        if (n && n.timelineId) {
          this.getWeatherReport()
        }
      },
      deep: true
    }
  },
  methods: {
    getWeatherReport() {
      if (
        this.currentTask &&
        this.currentTask.longitude &&
        this.currentTask.latitude
      ) {
        getReverseGeoCode({
          location: {
            longitude: this.currentTask.longitude,
            latitude: this.currentTask.latitude
          }
        }).then(res => {
          if (
            res &&
            res.code === 0 &&
            res.data.address_component &&
            res.data.address_component.adcode
          ) {
            const geoCode = res.data.address_component.adcode
            // getWeatherReport({
            //   id: `${geoCode}`
            // }).then(res => {
            //   if (res && res.code === 0 && res.data && res.data.report) {
            //     this.weatherReport = res.data.report
            //   }
            // })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.weather-report {
  display: flex;
  align-items: center;
  .item {
    margin: 0 4px;
    &.text {
      display: flex;
      margin: 0;
      img {
        width: 20px;
      }
    }
  }

  .temprature {
    font-size: 20px;
  }
  .wind-direction,
  .wind-class {
    font-size: 14px;
    line-height: 18px;
    text-align: center;
  }
}
</style>
