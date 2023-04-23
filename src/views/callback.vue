<route lang="yaml">
name: callback
</route>

<script lang="ts" setup>
const router = useRouter()

onMounted(() => {
  router.push('/')
})
</script>

<template>
  <div />
</template>
