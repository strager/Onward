<script setup lang="ts">
import { computed } from 'vue'

// Drawn (non-emoji) face per the Onward design system's MoodFace. The curve of the
// mouth encodes the tone; success/failure map to 'good' / 'low'.
export type MoodTone = 'rough' | 'low' | 'okay' | 'good' | 'great'

const props = withDefaults(
  defineProps<{ tone: MoodTone; size?: number; color?: string; outline?: boolean; sw?: number }>(),
  { size: 32, color: 'currentColor', outline: true, sw: 2.2 },
)

const SMILES: Record<MoodTone, string> = {
  rough: 'M8 17 Q12 13, 16 17',
  low: 'M8 16 Q12 14, 16 16',
  okay: 'M8 15 L16 15',
  good: 'M8 14 Q12 17, 16 14',
  great: 'M8 13 Q12 18, 16 13',
}

const smile = computed(() => SMILES[props.tone])
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="sw"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle v-if="outline" cx="12" cy="12" r="10" stroke-width="2" />
    <circle cx="9" cy="10" r="0.9" :fill="color" />
    <circle cx="15" cy="10" r="0.9" :fill="color" />
    <path :d="smile" />
  </svg>
</template>
