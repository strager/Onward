<script setup lang="ts">
import { computed, onUnmounted, reactive } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import MoodFace from '@/components/MoodFace.vue'
import { countToday, logOutcome, removeLastEvents } from '@/store'
import type { Challenge, Outcome } from '@/types'

const props = defineProps<{ challenge: Challenge }>()

const UNDO_WINDOW_MS = 30_000

// Faces: success reads as a green smile, failure as a warm-orange slight frown (not "rough").
const FACE_COLOR = { success: 'var(--success-600)', failure: 'var(--orange-600)' } as const

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
  <div class="card row">
    <div class="info">
      <span class="name">{{ challenge.name }}</span>
      <span class="count numeric">{{ countToday(challenge.id) }} today</span>
    </div>
    <div class="buttons">
      <button
        type="button"
        class="icon-btn undo"
        :class="{ hidden: recentTotal === 0 }"
        :disabled="recentTotal === 0"
        aria-label="Undo recent presses"
        @click="undo"
      >
        <AppIcon name="undo" :size="20" />
      </button>
      <button
        type="button"
        class="face"
        aria-label="Log a good interaction"
        @click="press('success')"
      >
        <MoodFace tone="good" :size="44" :sw="1.3" :outline="false" :color="FACE_COLOR.success" />
        <span v-if="recent.success > 0" class="badge numeric">{{ recent.success }}</span>
      </button>
      <button
        type="button"
        class="face"
        aria-label="Log a tough interaction"
        @click="press('failure')"
      >
        <MoodFace tone="low" :size="44" :sw="1.3" :outline="false" :color="FACE_COLOR.failure" />
        <span v-if="recent.failure > 0" class="badge numeric">{{ recent.failure }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.name {
  font-weight: var(--fw-extra);
  font-size: 16px;
  color: var(--ink-900);
  overflow-wrap: anywhere;
}

.count {
  font-size: 13px;
  color: var(--fg-muted);
}

.buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Undo: hidden but still occupies space, so the row never shifts when it appears. */
.undo.hidden {
  visibility: hidden;
}

.face {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--r-pill);
  background: var(--surface);
  border: 2px solid var(--ink-200);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out);
}

.face:hover {
  border-color: var(--ink-300);
}

.face:active {
  transform: translateY(2px);
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  box-sizing: border-box;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: var(--r-pill);
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  font-weight: var(--fw-extra);
  line-height: 20px;
  text-align: center;
  box-shadow: var(--shadow-xs);
}
</style>
