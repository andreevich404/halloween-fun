<script setup lang="ts">
import { Motion, useReducedMotion, useTransform, type MotionValue } from 'motion-v'

const props = defineProps<{
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  scrollP: MotionValue<number>
}>()

const reduced = useReducedMotion()

/** Детерминированный генератор, чтобы звёзды не прыгали между перезагрузками. */
function mulberry(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rnd = mulberry(1031)
const stars = Array.from({ length: 64 }, (_, i) => ({
  id: i,
  x: rnd() * 100,
  y: rnd() * 78,
  size: 1.5 + rnd() * 2.8,
  duration: 1.8 + rnd() * 3.4,
  delay: rnd() * 4,
  min: 0.15 + rnd() * 0.3,
}))

function layer(depth: number, scrollShift: number) {
  return {
    x: useTransform(props.mouseX, [-1, 1], [depth, -depth]),
    y: useTransform([props.mouseY, props.scrollP], (v: number[]) => -(v[0] ?? 0) * depth * 0.5 + (v[1] ?? 0) * scrollShift),
  }
}

const starsLayer = layer(8, 40)
const moonLayer = layer(22, 130)
const cloudLayer = layer(14, 80)
const farLayer = layer(14, 24)
const nearLayer = layer(34, -10)
</script>

<template>
  <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0 bg-gradient-to-b from-[#06021a] via-[#190a3b] to-[#43185a]" />
    <div class="absolute inset-x-0 bottom-0 h-3/5 bg-[radial-gradient(ellipse_at_50%_100%,rgb(255_122_26/0.32),transparent_65%)]" />

    <!-- звёзды -->
    <Motion class="absolute -inset-x-6 inset-y-0" :style="starsLayer">
      <Motion
        v-for="s in stars"
        :key="s.id"
        class="absolute rounded-full bg-bone"
        :style="{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, boxShadow: '0 0 6px #fff' }"
        :animate="reduced ? { opacity: 0.8 } : { opacity: [s.min, 1, s.min], scale: [0.8, 1.25, 0.8] }"
        :transition="{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }"
      />
    </Motion>

    <!-- луна -->
    <Motion class="absolute right-[8%] top-[14%] sm:right-[14%] sm:top-[12%]" :style="moonLayer">
      <Motion
        class="h-28 w-28 sm:h-44 sm:w-44"
        :animate="reduced ? {} : { y: [0, -16, 0], rotate: [-3, 3, -3] }"
        :transition="{ duration: 7, repeat: Infinity, ease: 'easeInOut' }"
      >
        <svg viewBox="0 0 200 200" class="h-full w-full overflow-visible">
          <defs>
            <radialGradient id="moon-body" cx="0.38" cy="0.34" r="0.8">
              <stop offset="0" stop-color="#fffbe0" />
              <stop offset="0.7" stop-color="#ffe9a0" />
              <stop offset="1" stop-color="#e8c06a" />
            </radialGradient>
            <radialGradient id="moon-halo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.45" stop-color="#ffe9a0" stop-opacity="0.45" />
              <stop offset="1" stop-color="#ffe9a0" stop-opacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="150" fill="url(#moon-halo)" />
          <circle cx="100" cy="100" r="78" fill="url(#moon-body)" />
          <circle cx="76" cy="84" r="14" fill="#d9b360" opacity="0.5" />
          <circle cx="120" cy="124" r="19" fill="#d9b360" opacity="0.45" />
          <circle cx="126" cy="70" r="8" fill="#d9b360" opacity="0.5" />
          <circle cx="82" cy="132" r="7" fill="#d9b360" opacity="0.45" />
          <!-- зловещая ухмылка на луне -->
          <path d="M62 112 Q100 148 138 112" stroke="#b78a2e" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5" />
        </svg>
      </Motion>
    </Motion>

    <!-- облака -->
    <Motion class="absolute inset-x-0 top-[24%]" :style="cloudLayer">
      <Motion
        class="h-16 w-[140%] opacity-60 sm:h-24"
        :animate="reduced ? {} : { x: ['-6%', '6%', '-6%'] }"
        :transition="{ duration: 30, repeat: Infinity, ease: 'easeInOut' }"
      >
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" class="h-full w-full">
          <path d="M0 70 Q80 30 160 60 Q230 20 320 55 Q420 25 500 62 Q600 30 700 60 Q800 35 900 58 Q960 50 1000 66 V100 H0 Z" fill="#3a1a62" />
        </svg>
      </Motion>
    </Motion>

    <!-- дальний план: холмы, деревья, дом -->
    <Motion class="absolute -inset-x-10 bottom-0 h-[44%] min-h-52 sm:min-h-64" :style="farLayer">
      <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" class="h-full w-full">
        <path d="M0 320 V232 Q200 188 380 224 T760 214 T1100 222 T1440 204 V320 Z" fill="#1a0b38" />
        <!-- мёртвые деревья -->
        <g stroke="#0e0622" stroke-width="7" stroke-linecap="round" fill="none">
          <path d="M240 240 V170 M240 196 L208 168 M240 184 L270 154 M208 168 L196 148 M270 154 L286 136" />
          <path d="M1210 232 V160 M1210 188 L1180 164 M1210 176 L1240 150 M1240 150 L1252 126" />
        </g>
        <!-- дом с привидениями -->
        <g fill="#0e0622">
          <rect x="640" y="170" width="170" height="70" />
          <path d="M628 172 L725 110 L822 172 Z" />
          <rect x="770" y="116" width="26" height="62" />
          <path d="M764 118 L783 90 L802 118 Z" />
          <rect x="652" y="132" width="22" height="50" />
          <path d="M646 134 L663 108 L680 134 Z" />
        </g>
        <Motion as="g" fill="#ffb347" :animate="reduced ? {} : { opacity: [1, 0.55, 1, 0.8, 1] }" :transition="{ duration: 3.6, repeat: Infinity }">
          <rect x="662" y="190" width="18" height="24" rx="3" />
          <rect x="700" y="190" width="18" height="24" rx="3" fill="#b6ff3c" />
          <rect x="738" y="190" width="18" height="24" rx="3" />
          <rect x="776" y="190" width="18" height="24" rx="3" fill="#b6ff3c" />
          <rect x="656" y="146" width="10" height="16" rx="2" />
          <rect x="779" y="138" width="10" height="16" rx="2" fill="#b6ff3c" />
        </Motion>
      </svg>
    </Motion>

    <!-- ближний план: кладбище -->
    <Motion class="absolute -inset-x-16 bottom-0 h-[30%] min-h-36 sm:min-h-44" :style="nearLayer">
      <svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" class="h-full w-full">
        <path d="M0 220 V150 Q360 118 720 142 T1440 128 V220 Z" fill="#07030f" />
        <g fill="#07030f">
          <!-- надгробия -->
          <path d="M520 160 V108 Q520 86 546 86 Q572 86 572 108 V160 Z" />
          <path d="M880 158 V114 Q880 96 900 96 Q920 96 920 114 V158 Z" />
          <path d="M140 146 V110 Q140 94 160 94 Q180 94 180 110 V146 Z" />
          <path d="M1280 140 V100 Q1280 84 1300 84 Q1320 84 1320 100 V140 Z" />
          <!-- кресты -->
          <path d="M348 150 V88 H364 V104 H388 V120 H364 V150 Z" />
          <path d="M1080 146 V92 H1094 V106 H1114 V120 H1094 V146 Z" />
          <!-- забор -->
          <path d="M0 140 H1440 V152 H0 Z" opacity="0.0" />
        </g>
        <g fill="#07030f">
          <path
            v-for="n in 22"
            :key="n"
            :d="`M${n * 66 - 40} 160 V112 L${n * 66 - 34} 102 L${n * 66 - 28} 112 V160 Z`"
            opacity="0.9"
          />
        </g>
        <!-- мини-фонари из тыкв -->
        <g>
          <ellipse cx="650" cy="170" rx="30" ry="24" fill="#a63e05" />
          <ellipse cx="650" cy="170" rx="22" ry="24" fill="#e8620c" />
          <path d="M638 164 l6 -8 l6 8 Z M656 164 l6 -8 l6 8 Z M640 180 q10 8 24 0 q-12 -2 -24 0 Z" fill="#ffe66b" />
          <path d="M646 148 q2 -8 10 -10" stroke="#5f7d1f" stroke-width="5" fill="none" stroke-linecap="round" />
          <ellipse cx="1180" cy="176" rx="22" ry="18" fill="#e8620c" />
          <path d="M1170 172 l5 -6 l5 6 Z M1182 172 l5 -6 l5 6 Z M1170 182 q9 6 22 0 q-11 -2 -22 0 Z" fill="#b6ff3c" />
        </g>
      </svg>
    </Motion>
  </div>
</template>
