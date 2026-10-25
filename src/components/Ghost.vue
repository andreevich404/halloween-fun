<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed } from 'vue'
import type { GhostEntity } from '../types'
import GhostArt from './GhostArt.vue'

const props = defineProps<{ ghost: GhostEntity; reduced: boolean }>()
const emit = defineEmits<{ catch: [id: number] }>()

const label = computed(() => {
  if (props.ghost.kind === 'trap') return 'Тыква-ловушка, не трогать'
  if (props.ghost.kind === 'golden') return 'Поймать золотого призрака'
  return 'Поймать призрака'
})

const drift = computed(() =>
  props.reduced
    ? {}
    : {
        x: props.ghost.driftX,
        y: props.ghost.driftY,
        rotate: props.ghost.driftRotate,
      },
)
</script>

<template>
  <Motion
    class="absolute"
    :style="{
      left: `${ghost.x}%`,
      top: `${ghost.y}%`,
      width: `${ghost.size}px`,
      height: `${ghost.size * (ghost.kind === 'trap' ? 1 : 1.2)}px`,
    }"
    :initial="{ scale: 0, opacity: 0 }"
    :animate="{ scale: 1, opacity: 1 }"
    :exit="{ scale: 1.7, opacity: 0, rotate: 25 }"
    :transition="{ type: 'spring', stiffness: 420, damping: 16 }"
  >
    <Motion
      as="button"
      type="button"
      class="block h-full w-full cursor-pointer border-0 bg-transparent p-0"
      :data-testid="`ghost-${ghost.kind}`"
      :aria-label="label"
      :animate="drift"
      :transition="{
        duration: ghost.driftDuration,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }"
      :while-hover="{ scale: 1.12 }"
      :while-press="{ scale: 0.82 }"
      @pointerdown.prevent="emit('catch', ghost.id)"
      @click="emit('catch', ghost.id)"
    >
      <GhostArt :kind="ghost.kind" :color="ghost.color" :face="ghost.face" />
    </Motion>
  </Motion>
</template>
