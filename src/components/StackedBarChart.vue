<script setup lang="ts">
import { computed } from 'vue'
import type { Bucket } from '@/stats'

const props = defineProps<{ buckets: Bucket[] }>()

// Fixed coordinate space; the SVG scales to its container via width:100% + height:auto.
// Geometry intentionally matches MovingAverageChart so the two x-axes line up: same width,
// same left gutter for y-axis labels, same plot edges, same per-bucket x positions.
const W = 320
const H = 150
const PAD_LEFT = 30 // room for the y-axis count labels
const PAD_RIGHT = 6
const PLOT_TOP = 10
const PLOT_BOTTOM = 120 // 120..150 is the x-label band
const PLOT_H = PLOT_BOTTOM - PLOT_TOP

const allEmpty = computed(() => props.buckets.every((b) => b.success + b.failure === 0))

const dataMax = computed(() => Math.max(1, ...props.buckets.map((b) => b.success + b.failure)))

/** Round the axis up to a "nice" maximum and pick integer ticks (~3 intervals). */
const scale = computed(() => {
  const max = dataMax.value
  if (max <= 1) return { max: 1, ticks: [0, 1] }
  const rough = max / 3
  const pow = Math.pow(10, Math.floor(Math.log10(rough)))
  const n = rough / pow
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow
  const niceMax = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = 0; v <= niceMax + 1e-9; v += step) ticks.push(Math.round(v))
  return { max: niceMax, ticks }
})

// Label only a sparse subset so they stay legible (~7 labels regardless of bucket count).
const stride = computed(() => Math.max(1, Math.ceil(props.buckets.length / 7)))

function yAt(count: number): number {
  return PLOT_BOTTOM - (count / scale.value.max) * PLOT_H
}

const bars = computed(() => {
  const n = props.buckets.length
  const plotW = W - PAD_LEFT - PAD_RIGHT
  const slot = plotW / n
  const barW = slot * 0.7
  return props.buckets.map((b, i) => {
    const center = PAD_LEFT + (i + 0.5) * slot
    const hFail = (b.failure / scale.value.max) * PLOT_H
    const hSucc = (b.success / scale.value.max) * PLOT_H
    return {
      x: center - barW / 2,
      w: barW,
      labelX: center,
      label: i % stride.value === 0 ? b.label : '',
      fail: { y: PLOT_BOTTOM - hFail, h: hFail },
      succ: { y: PLOT_BOTTOM - hFail - hSucc, h: hSucc },
    }
  })
})
</script>

<template>
  <div class="chart">
    <div class="legend">
      <span class="swatch succ" aria-hidden="true" />Successes
      <span class="swatch fail" aria-hidden="true" />Failures
    </div>

    <p v-if="allEmpty" class="empty">No data yet</p>

    <svg v-else :viewBox="`0 0 ${W} ${H}`" class="svg" role="img" aria-label="Logged interactions per bucket">
      <g v-for="tick in scale.ticks" :key="tick">
        <line
          :x1="PAD_LEFT"
          :y1="yAt(tick)"
          :x2="W - PAD_RIGHT"
          :y2="yAt(tick)"
          :class="tick === 0 ? 'baseline' : 'grid'"
        />
        <text :x="PAD_LEFT - 6" :y="yAt(tick) + 3" class="axis numeric">{{ tick }}</text>
      </g>

      <template v-for="(bar, i) in bars" :key="i">
        <rect
          v-if="bar.fail.h > 0"
          :x="bar.x"
          :y="bar.fail.y"
          :width="bar.w"
          :height="bar.fail.h"
          rx="1"
          class="bar-fail"
        />
        <rect
          v-if="bar.succ.h > 0"
          :x="bar.x"
          :y="bar.succ.y"
          :width="bar.w"
          :height="bar.succ.h"
          rx="1"
          class="bar-succ"
        />
        <text v-if="bar.label" :x="bar.labelX" :y="PLOT_BOTTOM + 18" class="tick numeric">
          {{ bar.label }}
        </text>
      </template>
    </svg>
  </div>
</template>

<style scoped>
.chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-xs);
  color: var(--fg-muted);
  font-weight: var(--fw-semi);
}

.swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
}
.swatch.succ {
  background: var(--success-600);
}
.swatch.fail {
  background: var(--orange-600);
  margin-left: 8px;
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

.baseline {
  stroke: var(--ink-200);
  stroke-width: 1;
}

.bar-succ {
  fill: var(--success-600);
}
.bar-fail {
  fill: var(--orange-600);
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
