<script setup lang="ts">
import { Motion } from 'motion-v'

defineProps<{ eyebrow: string; title: string; lead: string }>()

const item = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 160, damping: 16 } },
}
</script>

<template>
  <Motion
    class="mx-auto mb-10 max-w-2xl text-center"
    initial="hidden"
    while-in-view="show"
    :in-view-options="{ once: true, amount: 0.4 }"
    :variants="{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }"
  >
    <Motion as="p" :variants="item" class="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-acid">
      {{ eyebrow }}
    </Motion>
    <Motion as="h2" :variants="item" class="font-display text-4xl text-pumpkin-soft text-glow-orange sm:text-5xl">
      {{ title }}
    </Motion>
    <Motion as="p" :variants="item" class="mt-4 text-lg text-mist">
      {{ lead }}
    </Motion>
  </Motion>
</template>
