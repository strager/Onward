<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
</script>

<template>
  <div class="app">
    <RouterView />
    <BottomNav />
  </div>
</template>

<style scoped>
.app {
  /* Leave room for the fixed bottom nav (plus any iOS safe-area inset). */
  padding-bottom: calc(4.5rem + env(safe-area-inset-bottom));
}
</style>
