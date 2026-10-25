<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed } from 'vue'
import type { BurstEffect } from '../types'

const props = defineProps<{ effect: BurstEffect }>()

const COLORS = {
  good: ['#b6ff3c', '#ffffff', '#7cc4ff', '#ffb347'],
  gold: ['#ffd84a', '#fff7c2', '#ff9a1f', '#ffffff'],
  bad: ['#ff4d4d', '#ff7a1a', '#7a1fa0', '#ffffff'],
}

const sparks = computed(() => {
  const palette = COLORS[props.effect.tone]
  const count = props.effect.tone === 'gold' ? 16 : 10
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const dist = 38 + Math.random() * 46
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 5 + Math.random() * 7,
      color: palette[i % palette.length]!,
    }
  })
})

const labelColor = computed(
  () => ({ good: '#b6ff3c', gold: '#ffd84a', bad: '#ff6b6b' })[props.effect.tone],
)
</script>

<template>
  <div
    class="pointer-events-none absolute z-20"
    :style="{ left: `${effect.x}%`, top: `${effect.y}%`, width: '60px', height: '60px' }"
    aria-hidden="true"
  >
    <Motion
      v-for="s in sparks"
      :key="s.id"
      class="absolute left-1/2 top-1/2 rounded-full"
      :style="{
        width: `${s.size}px`,
        height: `${s.size}px`,
        background: s.color,
        boxShadow: `0 0 8px ${s.color}`,
      }"
      :initial="{ x: 0, y: 0, scale: 1, opacity: 1 }"
      :animate="{ x: s.x, y: s.y, scale: 0, opacity: 0 }"
      :transition="{ duration: 0.7, ease: 'easeOut' }"
    />
    <Motion
      class="font-display absolute left-1/2 top-1/2 -translate-x-1/2 whitespace-nowrap text-3xl font-bold"
      :style="{ color: labelColor, textShadow: '0 2px 0 #0a0614, 0 0 14px currentColor' }"
      :initial="{ y: 0, scale: 0.4, opacity: 0 }"
      :animate="{ y: -64, scale: [0.4, 1.4, 1], opacity: [0, 1, 1, 0] }"
      :transition="{ duration: 1, ease: 'easeOut' }"
    >
      {{ effect.label }}
    </Motion>
  </div>
</template>
