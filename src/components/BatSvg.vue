<script setup lang="ts">
import { Motion } from 'motion-v'

defineProps<{ flap: boolean; speed: number }>()
</script>

<template>
  <svg viewBox="0 0 120 60" class="block h-full w-full overflow-visible" aria-hidden="true">
    <!-- левое крыло -->
    <Motion
      as="g"
      :style="{ originX: 1, originY: 0.9 }"
      :animate="flap ? { rotate: [-26, 22, -26], scaleY: [1, 0.8, 1] } : {}"
      :transition="{ duration: speed, repeat: Infinity, ease: 'easeInOut' }"
    >
      <path d="M52 30 Q34 2 2 10 Q12 20 8 34 Q20 28 26 40 Q34 32 44 44 Q52 40 54 34 Z" fill="#1c0f3a" stroke="#6b3fd1" stroke-width="1.5" stroke-linejoin="round" />
    </Motion>
    <!-- правое крыло -->
    <Motion
      as="g"
      :style="{ originX: 0, originY: 0.9 }"
      :animate="flap ? { rotate: [26, -22, 26], scaleY: [1, 0.8, 1] } : {}"
      :transition="{ duration: speed, repeat: Infinity, ease: 'easeInOut' }"
    >
      <path d="M68 30 Q86 2 118 10 Q108 20 112 34 Q100 28 94 40 Q86 32 76 44 Q68 40 66 34 Z" fill="#1c0f3a" stroke="#6b3fd1" stroke-width="1.5" stroke-linejoin="round" />
    </Motion>
    <!-- тело -->
    <ellipse cx="60" cy="38" rx="11" ry="15" fill="#2a1650" stroke="#6b3fd1" stroke-width="1.5" />
    <path d="M50 26 L52 12 L58 22 Z M70 26 L68 12 L62 22 Z" fill="#2a1650" stroke="#6b3fd1" stroke-width="1.5" stroke-linejoin="round" />
    <circle cx="55" cy="33" r="2.6" fill="#b6ff3c" />
    <circle cx="65" cy="33" r="2.6" fill="#b6ff3c" />
    <path d="M56 43 l2 4 l2 -4 l2 4 l2 -4" stroke="#fff" stroke-width="1.2" fill="none" stroke-linejoin="round" />
  </svg>
</template>
