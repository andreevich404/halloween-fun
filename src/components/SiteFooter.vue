<script setup lang="ts">
import { Motion } from 'motion-v'
import SpiderDangler from './SpiderDangler.vue'
</script>

<template>
  <footer class="relative overflow-hidden border-t border-night-600 bg-night-950 px-4 pb-10 pt-24 text-center">
    <SpiderDangler class="right-[12%]" />
    <svg class="pointer-events-none absolute left-0 top-0 h-28 w-28 text-mist/30 sm:h-40 sm:w-40" viewBox="0 0 100 100" aria-hidden="true">
      <g stroke="currentColor" stroke-width="1" fill="none">
        <path d="M0 0 L100 0 M0 0 L90 40 M0 0 L60 70 M0 0 L30 90 M0 0 L0 100" />
        <path d="M24 0 Q20 20 0 24 M48 0 Q40 40 0 48 M72 0 Q58 58 0 72 M96 0 Q78 78 0 96" />
      </g>
    </svg>
    <Motion
      class="mx-auto max-w-xl"
      :initial="{ opacity: 0, y: 30 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :in-view-options="{ once: true }"
      :transition="{ type: 'spring', stiffness: 120, damping: 16 }"
    >
      <p class="font-display text-3xl text-pumpkin-soft text-glow-orange">Бу! Испугался?</p>
      <p class="mt-3 text-mist">
        Сшито ночью, пока призраки спали, а тыквы вели светскую беседу. Ни один дедлайн при создании не пострадал
        (они просто сдвинулись).
      </p>
      <p class="mt-6 text-sm text-mist">Потяни паучка за ниточку. Он это любит. Наверное.</p>
    </Motion>
  </footer>
</template>
