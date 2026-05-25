<script setup lang="ts">
import { computed, onUnmounted, reactive } from 'vue'
import { countToday, logOutcome, removeLastEvents } from '@/store'
import type { Challenge, Outcome } from '@/types'

const props = defineProps<{ challenge: Challenge }>()

const UNDO_WINDOW_MS = 30_000

// Ephemeral "recent batch": presses since the undo button appeared. Not persisted.
const recent = reactive<Record<Outcome, number>>({ success: 0, failure: 0 })
const recentTotal = computed(() => recent.success + recent.failure)

let timerId: ReturnType<typeof setTimeout> | null = null

function clearTimer(): void {
  if (timerId !== null) {
    clearTimeout(timerId)
    timerId = null
  }
}

function resetRecent(): void {
  recent.success = 0
  recent.failure = 0
}

// Restart the 30s window on every press, so undo lives 30s past the last press.
function bumpTimer(): void {
  clearTimer()
  timerId = setTimeout(() => {
    resetRecent() // window expired: events stay committed, only the undo affordance clears
    timerId = null
  }, UNDO_WINDOW_MS)
}

function press(outcome: Outcome): void {
  logOutcome(props.challenge.id, outcome)
  recent[outcome]++
  bumpTimer()
}

function undo(): void {
  removeLastEvents(props.challenge.id, recentTotal.value)
  clearTimer()
  resetRecent()
}

onUnmounted(clearTimer)
</script>

<template>
  <div class="row">
    <div class="info">
      <span class="name">{{ challenge.name }}</span>
      <span class="count">{{ countToday(challenge.id) }} today</span>
    </div>
    <div class="buttons">
      <button
        type="button"
        class="undo"
        :class="{ hidden: recentTotal === 0 }"
        :disabled="recentTotal === 0"
        aria-label="Undo recent presses"
        @click="undo"
      >
        ⟲
      </button>
      <button
        type="button"
        class="face"
        aria-label="Log a good interaction"
        @click="press('success')"
      >
        😊
        <span v-if="recent.success > 0" class="badge">{{ recent.success }}</span>
      </button>
      <button
        type="button"
        class="face"
        aria-label="Log a tough interaction"
        @click="press('failure')"
      >
        😟
        <span v-if="recent.failure > 0" class="badge">{{ recent.failure }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid #e3e3e3;
  border-radius: 0.75rem;
  background: #fff;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.name {
  font-weight: 600;
  overflow-wrap: anywhere;
}

.count {
  font-size: 0.85rem;
  color: #777;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.undo {
  font-size: 1.4rem;
  line-height: 1;
  width: 2.4rem;
  height: 3rem;
  border: none;
  background: none;
  color: #888;
  cursor: pointer;
}

/* Hidden but still occupies space, so the row never shifts when undo appears. */
.undo.hidden {
  visibility: hidden;
}

.face {
  position: relative;
  font-size: 1.6rem;
  line-height: 1;
  width: 3rem;
  height: 3rem;
  border: 1px solid #e3e3e3;
  border-radius: 0.75rem;
  background: #fafafa;
  cursor: pointer;
}

.face:hover {
  background: #f0f0f0;
}

.face:active {
  transform: scale(0.94);
}

.badge {
  position: absolute;
  top: -0.35rem;
  right: -0.35rem;
  box-sizing: border-box;
  min-width: 1.15rem;
  height: 1.15rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: #2f6fed;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.15rem;
  text-align: center;
}
</style>
