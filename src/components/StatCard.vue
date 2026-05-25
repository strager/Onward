<script setup lang="ts">
import { computed } from 'vue'
import { getEvents } from '@/store'
import { allTimeTotals, distinctActiveDays, successRateWindow } from '@/stats'
import type { Challenge } from '@/types'

const props = defineProps<{ challenge: Challenge }>()

const events = computed(() => getEvents(props.challenge.id))

const daysActive = computed(() => distinctActiveDays(events.value))

const rate30 = computed(() => {
  const { rate } = successRateWindow(events.value, 30)
  return rate === null ? '—' : `${Math.round(rate * 100)}%`
})

const totals = computed(() => allTimeTotals(events.value))
</script>

<template>
  <article class="card stat-card">
    <h2 class="name">{{ challenge.name }}</h2>
    <dl class="stats">
      <div class="stat">
        <dt class="label">Days active</dt>
        <dd class="value numeric">{{ daysActive }}</dd>
      </div>
      <div class="stat">
        <dt class="label">30-day rate</dt>
        <dd class="value numeric">{{ rate30 }}</dd>
      </div>
      <div class="stat">
        <dt class="label">Total</dt>
        <dd class="value numeric">{{ totals.success }}/{{ totals.total }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.stat-card {
  padding: 16px;
}

.name {
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: var(--fw-extra);
  color: var(--ink-900);
  overflow-wrap: anywhere;
}

.stats {
  display: flex;
  margin: 0;
  gap: 12px;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semi);
  color: var(--fg-muted);
}

.value {
  margin: 0;
  font-size: var(--fs-lg);
  font-weight: var(--fw-extra);
  color: var(--ink-900);
}
</style>
