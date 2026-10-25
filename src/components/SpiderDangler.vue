<script setup lang="ts">
import { Motion, useMotionValue, useTransform } from 'motion-v'

const y = useMotionValue(0)
const thread = useTransform(y, (v: number) => 48 + v)
</script>

<template>
  <div class="pointer-events-none absolute top-0 z-20 flex flex-col items-center" data-testid="spider">
    <Motion class="w-px bg-mist/70" :style="{ height: thread }" />
    <Motion
      class="pointer-events-auto -mt-1 cursor-grab touch-none select-none active:cursor-grabbing"
      drag="y"
      :drag-constraints="{ top: -20, bottom: 150 }"
      :drag-elastic="0.35"
      :drag-snap-to-origin="true"
      :drag-transition="{ bounceStiffness: 180, bounceDamping: 7 }"
      :style="{ y }"
      :while-hover="{ rotate: [0, -10, 10, -6, 0], transition: { duration: 0.5 } }"
      :while-drag="{ scale: 1.2 }"
      aria-label="Паучок на ниточке. Потяни его вниз"
      role="img"
    >
      <svg viewBox="0 0 64 56" class="h-12 w-14" aria-hidden="true">
        <g stroke="#2a1650" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M26 24 L10 12 L4 22 M26 30 L8 30 L2 42 M26 36 L10 48 L6 54 M30 40 L22 54" />
          <path d="M38 24 L54 12 L60 22 M38 30 L56 30 L62 42 M38 36 L54 48 L58 54 M34 40 L42 54" />
        </g>
        <ellipse cx="32" cy="38" rx="13" ry="14" fill="#2a1650" stroke="#6b3fd1" stroke-width="1.5" />
        <circle cx="32" cy="22" r="9" fill="#2a1650" stroke="#6b3fd1" stroke-width="1.5" />
        <circle cx="28" cy="21" r="2.6" fill="#b6ff3c" />
        <circle cx="36" cy="21" r="2.6" fill="#b6ff3c" />
        <path d="M32 32 L28 40 L32 46 L36 40 Z" fill="#ff7a1a" opacity="0.85" />
      </svg>
    </Motion>
  </div>
</template>
