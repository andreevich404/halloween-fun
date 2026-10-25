<script setup lang="ts">
import { Motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion-v'
import { ref } from 'vue'
import BatsLayer from './BatsLayer.vue'
import SpiderDangler from './SpiderDangler.vue'
import SpookySky from './SpookySky.vue'
import SpringButton from './SpringButton.vue'

const reduced = useReducedMotion()
const heroEl = ref<HTMLElement | null>(null)

const rawX = useMotionValue(0)
const rawY = useMotionValue(0)
const mouseX = useSpring(rawX, { stiffness: 60, damping: 18 })
const mouseY = useSpring(rawY, { stiffness: 60, damping: 18 })

const { scrollYProgress } = useScroll({ target: heroEl, offset: ['start start', 'end start'] })

const titleX = useTransform(mouseX, [-1, 1], [-10, 10])
const titleScroll = useTransform(scrollYProgress, [0, 1], [0, 140])
const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

function onPointerMove(e: PointerEvent): void {
  if (reduced.value || !heroEl.value) return
  const rect = heroEl.value.getBoundingClientRect()
  rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
  rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
}

const LINES = ['Тыквенная', 'лихорадка']

interface Letter {
  ch: string
  index: number
  flicker: boolean
  delay: number
}

let counter = 0
const letters: Letter[][] = LINES.map((line) =>
  [...line].map((ch) => {
    const index = counter++
    return { ch, index, flicker: index % 3 === 1, delay: 0.5 + index * 0.05 }
  }),
)
</script>

<template>
  <section
    id="top"
    ref="heroEl"
    class="relative flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden"
    aria-labelledby="hero-title"
    @pointermove="onPointerMove"
  >
    <SpookySky :mouse-x="mouseX" :mouse-y="mouseY" :scroll-p="scrollYProgress" />
    <BatsLayer />
    <SpiderDangler class="left-[10%] sm:left-[18%]" />

    <Motion class="relative z-20 flex flex-col items-center px-4 pb-32 pt-16 text-center" :style="{ x: titleX, y: titleScroll, opacity: titleOpacity }">
      <p class="mb-4 rounded-full border border-acid/60 bg-night-950/60 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-acid backdrop-blur sm:text-sm sm:tracking-[0.3em]">
        31 октября · вход свободный
      </p>
      <h1
        id="hero-title"
        class="font-display text-[clamp(2.9rem,13.5vw,8.5rem)] leading-[0.95] text-pumpkin text-glow-orange"
        aria-label="Тыквенная лихорадка"
      >
        <span v-for="(line, li) in letters" :key="li" class="block" aria-hidden="true">
          <Motion
            v-for="l in line"
            :key="l.index"
            as="span"
            class="inline-block"
            :initial="{ y: 90, opacity: 0, rotate: l.index % 2 ? 18 : -18, scale: 0.4 }"
            :animate="{ y: 0, opacity: 1, rotate: 0, scale: 1 }"
            :transition="{ type: 'spring', stiffness: 150, damping: 11, delay: l.delay }"
          >
            <Motion
              as="span"
              class="inline-block"
              :animate="
                l.flicker && !reduced
                  ? { opacity: [1, 0.35, 1, 0.7, 1, 1, 0.5, 1] }
                  : { opacity: 1 }
              "
              :transition="{
                duration: 1.6,
                delay: 2.4 + (l.index % 5) * 0.7,
                repeat: Infinity,
                repeatDelay: 2.5 + (l.index % 4),
                times: [0, 0.1, 0.2, 0.3, 0.4, 0.7, 0.8, 1],
              }"
            >{{ l.ch }}</Motion>
          </Motion>
        </span>
      </h1>
      <Motion
        as="p"
        class="mt-6 max-w-xl text-lg text-bone sm:text-xl"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 1.6, duration: 0.7 }"
      >
        Ночь, когда тыквы шепчутся, призраки играют в догонялки, а дедлайны кусаются сильнее вампиров.
      </Motion>
      <Motion
        class="mt-8 flex flex-wrap items-center justify-center gap-3"
        :initial="{ opacity: 0, scale: 0.6 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ type: 'spring', stiffness: 200, damping: 12, delay: 1.9 }"
      >
        <SpringButton variant="acid" href="#game" data-testid="cta-scroll">
          Вниз, к призракам
          <Motion
            as="span"
            aria-hidden="true"
            :animate="reduced ? {} : { y: [0, 5, 0] }"
            :transition="{ duration: 1.1, repeat: Infinity }"
          >↓</Motion>
        </SpringButton>
        <SpringButton variant="ghost" href="#oracle">Спросить тыкву</SpringButton>
      </Motion>
    </Motion>
  </section>
</template>
