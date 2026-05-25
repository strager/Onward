<script setup lang="ts">
import { computed } from 'vue'
import type { Bucket } from '@/stats'

const props = defineProps<{
  buckets: Bucket[]
  /** Success-rate moving average per bucket, 0..1, or null where the window had no events. */
  values: (number | null)[]
}>()

// Fixed coordinate space; scales to container via width:100% + height:auto.
const W = 320
const H = 150
const PAD_LEFT = 30 // room for the "100%" axis labels
const PAD_RIGHT = 6
const PLOT_TOP = 10
const PLOT_BOTTOM = 120 // 120..150 is the x-label band

const allNull = computed(() => props.values.every((v) => v === null))

const gridLines = [
  { v: 1, label: '100%' },
  { v: 0.5, label: '50%' },
  { v: 0, label: '0%' },
]

const stride = computed(() => Math.max(1, Math.ceil(props.buckets.length / 7)))

function xAt(i: number): number {
  const plotW = W - PAD_LEFT - PAD_RIGHT
  return PAD_LEFT + ((i + 0.5) * plotW) / props.values.length
}

function yAt(v: number): number {
  return PLOT_BOTTOM - v * (PLOT_BOTTOM - PLOT_TOP)
}

// Split into runs of consecutive non-null points so the line breaks across gaps.
const segments = computed(() => {
  const runs: { x: number; y: number }[][] = []
  let current: { x: number; y: number }[] = []
  props.values.forEach((v, i) => {
    if (v === null) {
      if (current.length > 0) runs.push(current)
      current = []
    } else {
      current.push({ x: xAt(i), y: yAt(v) })
    }
  })
  if (current.length > 0) runs.push(current)
  return runs
})

const polylines = computed(() =>
  segments.value
    .filter((run) => run.length >= 2)
    .map((run) => run.map((p) => `${p.x},${p.y}`).join(' ')),
)

// Isolated non-null points (surrounded by gaps) wouldn't show as a line, so dot them.
const dots = computed(() => {
  const out: { x: number; y: number }[] = []
  for (const run of segments.value) {
    if (run.length === 1 && run[0] !== undefined) out.push(run[0])
  }
  return out
})

const xLabels = computed(() =>
  props.buckets
    .map((b, i) => ({ x: xAt(i), label: b.label, show: i % stride.value === 0 }))
    .filter((l) => l.show),
)
</script>

<template>
  <div class="chart">
    <p v-if="allNull" class="empty">Not enough data yet</p>

    <svg v-else :viewBox="`0 0 ${W} ${H}`" class="svg" role="img" aria-label="Success-rate trend">
      <g v-for="line in gridLines" :key="line.label">
        <line :x1="PAD_LEFT" :y1="yAt(line.v)" :x2="W - PAD_RIGHT" :y2="yAt(line.v)" class="grid" />
        <text :x="PAD_LEFT - 6" :y="yAt(line.v) + 3" class="axis numeric">{{ line.label }}</text>
      </g>

      <polyline v-for="(pts, i) in polylines" :key="i" :points="pts" class="line" />
      <circle v-for="(dot, i) in dots" :key="`d${i}`" :cx="dot.x" :cy="dot.y" r="2.5" class="dot" />

      <text v-for="(l, i) in xLabels" :key="`x${i}`" :x="l.x" :y="PLOT_BOTTOM + 18" class="tick numeric">
        {{ l.label }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.chart {
  display: flex;
  flex-direction: column;
}

.svg {
  display: block;
  width: 100%;
  height: auto;
}

.grid {
  stroke: var(--ink-100);
  stroke-width: 1;
}

.line {
  fill: none;
  stroke: var(--primary);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dot {
  fill: var(--primary);
}

.axis {
  fill: var(--fg-subtle);
  font-size: 9px;
  text-anchor: end;
}

.tick {
  fill: var(--fg-subtle);
  font-size: 9px;
  text-anchor: middle;
}

.empty {
  margin: 0;
  padding: 32px 0;
  text-align: center;
  color: var(--fg-muted);
  font-weight: var(--fw-semi);
}
</style>
