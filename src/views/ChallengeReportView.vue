<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import StackedBarChart from '@/components/StackedBarChart.vue'
import MovingAverageChart from '@/components/MovingAverageChart.vue'
import { getChallenge, getEvents } from '@/store'
import { buildBuckets, movingAverage, type Granularity } from '@/stats'

const route = useRoute()
const id = computed(() => route.params.id as string)
const challenge = computed(() => getChallenge(id.value))

const granularity = ref<Granularity>('daily')

// Bar chart and line chart share the same granularity toggle.
const buckets = computed(() => buildBuckets(getEvents(id.value), granularity.value))
const ma = computed(() => movingAverage(buckets.value, 7))

const barCaption = computed(() =>
  granularity.value === 'daily' ? 'Logged per day · last 30 days' : 'Logged per week · last year',
)
</script>

<template>
  <main class="screen">
    <header class="report-header">
      <RouterLink to="/reports" class="icon-btn" aria-label="Back to Reports">
        <AppIcon name="chevron-left" :size="22" />
      </RouterLink>
      <h1 class="report-title">{{ challenge ? challenge.name : 'Report' }}</h1>
    </header>

    <div v-if="!challenge" class="card empty">
      <p class="empty-text">
        Challenge not found.
        <RouterLink to="/reports" class="empty-link">Back to Reports</RouterLink>
      </p>
    </div>

    <template v-else>
      <div class="toggle" role="group" aria-label="Time range">
        <button
          type="button"
          class="btn btn-sm"
          :class="granularity === 'daily' ? 'btn-primary' : 'btn-secondary'"
          @click="granularity = 'daily'"
        >
          30 days
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="granularity === 'weekly' ? 'btn-primary' : 'btn-secondary'"
          @click="granularity = 'weekly'"
        >
          1 year
        </button>
      </div>

      <section class="card chart-card">
        <div class="eyebrow">{{ barCaption }}</div>
        <StackedBarChart :buckets="buckets" />
      </section>

      <section class="card chart-card">
        <div class="eyebrow">Success-rate trend · 7-{{ granularity === 'daily' ? 'day' : 'week' }} average</div>
        <MovingAverageChart :buckets="buckets" :values="ma" />
      </section>
    </template>
  </main>
</template>

<style scoped>
.report-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  margin-bottom: 16px;
}

.report-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: var(--fw-black);
  font-size: var(--fs-xl);
  line-height: var(--lh-tight);
  color: var(--fg);
  overflow-wrap: anywhere;
  min-width: 0;
}

.toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.chart-card {
  padding: 16px;
  margin-bottom: 12px;
}

.eyebrow {
  margin-bottom: 12px;
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--fg-subtle);
}

.empty {
  padding: 32px 24px;
  text-align: center;
}

.empty-text {
  margin: 0;
  font-size: var(--fs-base);
  line-height: var(--lh-relaxed);
  color: var(--fg-muted);
}

.empty-link {
  color: var(--primary);
  font-weight: var(--fw-bold);
}
</style>
