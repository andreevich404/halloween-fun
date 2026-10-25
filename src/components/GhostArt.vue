<script setup lang="ts">
import { computed, useId } from 'vue'
import type { GhostColor, GhostFace, GhostKind } from '../types'

const props = defineProps<{
  kind: GhostKind
  color: GhostColor
  face: GhostFace
}>()

const uid = useId()
const gradId = `ghost-grad-${uid}`

const PALETTE: Record<GhostColor, { top: string; bottom: string; glow: string }> = {
  blue: { top: '#e8f6ff', bottom: '#7cc4ff', glow: 'rgb(124 196 255 / 0.75)' },
  green: { top: '#f0ffd0', bottom: '#a8f03c', glow: 'rgb(182 255 60 / 0.7)' },
  pink: { top: '#fff0f8', bottom: '#ff8ccc', glow: 'rgb(255 140 204 / 0.75)' },
  purple: { top: '#f1e6ff', bottom: '#a67bff', glow: 'rgb(166 123 255 / 0.8)' },
  gold: { top: '#fff7c2', bottom: '#ffc42b', glow: 'rgb(255 206 60 / 0.95)' },
}

const palette = computed(() => PALETTE[props.color])
const isTrap = computed(() => props.kind === 'trap')
const isGold = computed(() => props.kind === 'golden')
const INK = '#1a1030'
</script>

<template>
  <!-- Тыква-ловушка -->
  <svg
    v-if="isTrap"
    viewBox="0 0 100 100"
    class="block h-full w-full"
    :style="{ filter: 'drop-shadow(0 0 10px rgb(182 255 60 / 0.8))' }"
    aria-hidden="true"
  >
    <path d="M47 14 Q48 4 58 2 Q56 12 52 16 Z" fill="#6fbd2c" />
    <ellipse cx="27" cy="58" rx="22" ry="32" fill="#c24a08" />
    <ellipse cx="73" cy="58" rx="22" ry="32" fill="#c24a08" />
    <ellipse cx="50" cy="58" rx="24" ry="34" fill="#ff7a1a" />
    <path d="M30 48 L40 40 L42 54 Z M70 48 L60 40 L58 54 Z" fill="#b6ff3c" />
    <path
      d="M26 68 L34 76 L42 66 L50 78 L58 66 L66 76 L74 68 L70 84 Q50 94 30 84 Z"
      fill="#b6ff3c"
    />
    <path d="M22 34 L36 40 M78 34 L64 40" stroke="#4a1a00" stroke-width="3" stroke-linecap="round" />
  </svg>

  <!-- Призрак -->
  <svg
    v-else
    viewBox="0 -10 100 130"
    class="block h-full w-full"
    :style="{ filter: `drop-shadow(0 0 ${isGold ? 14 : 9}px ${palette.glow})` }"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="palette.top" />
        <stop offset="1" :stop-color="palette.bottom" />
      </linearGradient>
    </defs>
    <path
      d="M8 112 V52 C8 22 26 6 50 6 C74 6 92 22 92 52 V112 L78 99 L64 113 L50 99 L36 113 L22 99 Z"
      :fill="`url(#${gradId})`"
    />
    <path d="M8 66 Q-4 74 2 88 Q10 84 12 76 Z M92 66 Q104 74 98 88 Q90 84 88 76 Z" :fill="palette.bottom" opacity="0.9" />
    <path
      v-if="isGold"
      d="M28 12 L33 -4 L42 8 L50 -8 L58 8 L67 -4 L72 12 Z"
      fill="#ffd84a"
      stroke="#b9801a"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <ellipse cx="26" cy="64" rx="6" ry="4" fill="#ff6fa8" opacity="0.45" />
    <ellipse cx="74" cy="64" rx="6" ry="4" fill="#ff6fa8" opacity="0.45" />

    <template v-if="face === 'boo'">
      <ellipse cx="36" cy="46" rx="6" ry="9" :fill="INK" />
      <ellipse cx="64" cy="46" rx="6" ry="9" :fill="INK" />
      <ellipse cx="50" cy="74" rx="9" ry="12" :fill="INK" />
    </template>
    <template v-else-if="face === 'grin'">
      <ellipse cx="36" cy="46" rx="5" ry="8" :fill="INK" />
      <ellipse cx="64" cy="46" rx="5" ry="8" :fill="INK" />
      <path d="M28 64 Q50 94 72 64 Z" :fill="INK" />
      <path d="M38 67 h8 v6 h-8 Z M54 67 h8 v6 h-8 Z" fill="#fff" />
    </template>
    <template v-else-if="face === 'sleepy'">
      <path d="M28 48 Q36 56 44 48 M56 48 Q64 56 72 48" :stroke="INK" stroke-width="4" fill="none" stroke-linecap="round" />
      <ellipse cx="50" cy="74" rx="6" ry="8" :fill="INK" />
      <path d="M74 20 h10 l-10 12 h10" :stroke="INK" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="face === 'angry'">
      <path d="M26 36 L44 46 M74 36 L56 46" :stroke="INK" stroke-width="5" stroke-linecap="round" />
      <circle cx="38" cy="53" r="5" :fill="INK" />
      <circle cx="62" cy="53" r="5" :fill="INK" />
      <path d="M32 78 L40 68 L46 78 L54 68 L60 78 L68 68" :stroke="INK" stroke-width="4" fill="none" stroke-linejoin="round" stroke-linecap="round" />
    </template>
    <template v-else-if="face === 'tongue'">
      <circle cx="36" cy="46" r="8" :fill="INK" />
      <circle cx="64" cy="46" r="8" :fill="INK" />
      <circle cx="39" cy="43" r="2.6" fill="#fff" />
      <circle cx="67" cy="43" r="2.6" fill="#fff" />
      <path d="M32 68 Q50 80 68 68" :stroke="INK" stroke-width="4" fill="none" stroke-linecap="round" />
      <path d="M42 74 Q50 98 58 74 Z" fill="#ff5c93" :stroke="INK" stroke-width="2" />
    </template>
    <template v-else>
      <path d="M30 40 l12 12 m0 -12 l-12 12 M58 40 l12 12 m0 -12 l-12 12" :stroke="INK" stroke-width="4.5" stroke-linecap="round" />
      <path d="M32 76 Q38 68 44 76 T56 76 T68 76" :stroke="INK" stroke-width="4" fill="none" stroke-linecap="round" />
    </template>
  </svg>
</template>
