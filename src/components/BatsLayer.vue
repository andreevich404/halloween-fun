<script setup lang="ts">
import { Motion, useReducedMotion } from 'motion-v'
import { onBeforeUnmount, reactive } from 'vue'
import BatSvg from './BatSvg.vue'

interface Flight {
  key: number
  size: number
  flip: boolean
  x: string[]
  y: string[]
  rotate: number[]
  duration: number
  delay: number
  flap: number
}

const COUNT = 5
const reduced = useReducedMotion()
const timers: number[] = []

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

let counter = 0
function makeFlight(first: boolean): Flight {
  const flip = Math.random() < 0.5
  const startX = flip ? 118 : -18
  const endX = flip ? -18 : 118
  const midA = rand(20, 45)
  const midB = rand(55, 80)
  const y0 = rand(6, 60)
  const wobble = () => rand(4, 58)
  return {
    key: counter++,
    size: rand(34, 78),
    flip,
    x: [startX, midA, midB, endX].map((v) => `${v}vw`),
    y: [y0, wobble(), wobble(), wobble()].map((v) => `${v}vh`),
    rotate: [rand(-14, 0), rand(8, 20), rand(-18, -4), rand(2, 14)],
    duration: rand(7, 13),
    delay: first ? rand(0, 4) : rand(0.5, 5),
    flap: rand(0.22, 0.34),
  }
}

const bats = reactive<Flight[]>(Array.from({ length: COUNT }, () => makeFlight(true)))

function respawn(index: number): void {
  const t = window.setTimeout(() => {
    bats[index] = makeFlight(false)
  }, 200)
  timers.push(t)
}

onBeforeUnmount(() => timers.forEach((t) => window.clearTimeout(t)))
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
    <template v-if="!reduced">
      <Motion
        v-for="(bat, i) in bats"
        :key="bat.key"
        class="absolute left-0 top-0"
        :style="{ width: `${bat.size}px`, height: `${bat.size / 2}px` }"
        :initial="{ x: bat.x[0], y: bat.y[0], rotate: bat.rotate[0] }"
        :animate="{ x: bat.x, y: bat.y, rotate: bat.rotate }"
        :transition="{ duration: bat.duration, delay: bat.delay, ease: 'easeInOut' }"
        @animation-complete="respawn(i)"
      >
        <div :style="{ transform: bat.flip ? 'scaleX(-1)' : 'none' }" class="h-full w-full">
          <BatSvg :flap="true" :speed="bat.flap" />
        </div>
      </Motion>
    </template>
    <!-- при reduced-motion — одна неподвижная летучая мышь -->
    <div v-else class="absolute left-[42%] top-[11%] h-8 w-16 opacity-80">
      <BatSvg :flap="false" :speed="1" />
    </div>
  </div>
</template>
