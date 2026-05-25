<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink to="/" class="tab">
      <span class="icon" aria-hidden="true">📋</span>
      <span class="label">Challenges</span>
    </RouterLink>
    <RouterLink to="/settings" class="tab">
      <span class="icon" aria-hidden="true">⚙️</span>
      <span class="label">Settings</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  border-top: 1px solid #e3e3e3;
  background: #fff;
  font-family: system-ui, sans-serif;
  /* Keep clear of the iOS home indicator. */
  padding-bottom: env(safe-area-inset-bottom);
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.55rem 0;
  text-decoration: none;
  color: #888;
  font-size: 0.8rem;
}

.icon {
  font-size: 1.3rem;
  line-height: 1;
}

.tab.router-link-exact-active {
  color: #2f6fed;
}
</style>
