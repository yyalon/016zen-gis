<script>
export default {
  props: {
    popupData: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div class="cell-abundance-popup">
    <h3>浮游植物细胞丰度</h3>
    <div class="info-item">
      <span class="label">站位：</span>
      <span class="value">{{ popupData.POINT_CODE }}</span>
    </div>
    <div class="info-item">
      <span class="label">经度：</span>
      <span class="value">{{ popupData.LON }}</span>
    </div>
    <div class="info-item">
      <span class="label">纬度：</span>
      <span class="value">{{ popupData.LAT }}</span>
    </div>
    <div class="info-item">
      <span class="label">年份：</span>
      <span class="value">{{ popupData.YEAR_NUMBER }}</span>
    </div>
    <div class="info-item">
      <span class="label">季节：</span>
      <span class="value">{{ popupData.SEASON }}</span>
    </div>
    <div class="info-item">
      <span class="label">丰度：</span>
      <span class="value">{{ popupData.FD }}</span>
    </div>
    <div class="info-item">
      <span class="label">分区：</span>
      <span class="value">{{ popupData.PARTITION || '-' }}</span>
    </div>
    <div class="info-item">
      <span class="label">区域：</span>
      <span class="value">{{ popupData.AREA || '-' }}</span>
    </div>
  </div>
</template>

<style scoped>
.cell-abundance-popup {
  padding: 10px;
  font-size: 12px;
  line-height: 1.5;
  background: rgb(255 255 255 / 90%);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  min-width: 200px;
}

h3 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.info-item {
  display: flex;
  margin-bottom: 5px;
}

.label {
  font-weight: bold;
  color: #666;
  margin-right: 5px;
  min-width: 40px;
}

.value {
  color: #333;
  flex: 1;
}
</style>
