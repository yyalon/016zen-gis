<script>
import RightDrawer from './RightDrawer.vue'
import ChartBarEutrophiaYears from './ChartBarEutrophiaYears.vue'
import ChartBarEutrophia from './ChartBarEutrophia.vue'
import ChartBar from './ChartBar.vue'

export default {
  components: { RightDrawer, ChartBarEutrophiaYears, ChartBarEutrophia, ChartBar },
}
</script>

<template>
  <RightDrawer>
    <ChartBarEutrophiaYears />
    <ChartBarEutrophia />
    <ChartBar />
  </RightDrawer>
</template>
