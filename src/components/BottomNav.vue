<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'

const route = useRoute()

const tabs = [
  { to: '/', label: 'Challenges', icon: 'target' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
] as const

const activeIndex = computed(() => tabs.findIndex((t) => t.to === route.path))

// Hairline divider, hidden when it touches the active tab's pill (which absorbs it).
function showDivider(i: number): boolean {
  return i > 0 && i !== activeIndex.value && i - 1 !== activeIndex.value
}
</script>

<template>
  <nav class="bottom-nav">
    <template v-for="(tab, i) in tabs" :key="tab.to">
      <span v-if="i > 0" class="divider" :class="{ visible: showDivider(i) }" aria-hidden="true" />
      <RouterLink :to="tab.to" class="tab" :class="{ active: i === activeIndex }">
        <AppIcon :name="tab.icon" :size="22" :sw="i === activeIndex ? 2.6 : 2.2" />
        <span class="label">{{ tab.label }}</span>
      </RouterLink>
    </template>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom));
  left: 12px;
  right: 12px;
  max-width: calc(32rem - 24px);
  margin: 0 auto;
  z-index: 30;
  display: flex;
  align-items: stretch;
  padding: 6px;
  border-radius: 26px;
  background: rgba(255, 253, 247, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(10, 31, 46, 0.08);
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 6px;
  border-radius: 20px;
  text-decoration: none;
  color: var(--ink-500);
  transition:
    background var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-out);
}

.tab.active {
  background: var(--blue-100);
  color: var(--blue-700);
}

.label {
  font-size: 10.5px;
  font-weight: var(--fw-extra);
}

.divider {
  width: 1px;
  align-self: center;
  height: 60%;
  background: transparent;
  flex-shrink: 0;
}

.divider.visible {
  background: var(--ink-200);
}
</style>
