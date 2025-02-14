<template>
  <header class="page-header">
    <h1>{{ title }}</h1>
    <p>Planetary System: {{ systemInfo }}</p>
    <p>Number of Planets: {{ numberOfPlanets }}</p>
    <p>Star Mass: {{ starMass }}</p>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  systemInfo: string;
  numberOfPlanets: number;
  starMass: number;
}>();
</script>

<style scoped>
.page-header {
  background-color: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin: 5px 0;
  font-size: 16px;
}
</style>
