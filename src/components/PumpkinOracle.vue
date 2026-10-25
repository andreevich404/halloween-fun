<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from 'motion-v'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSound } from '../composables/useSound'
import { pickPrediction } from '../data/predictions'
import type { Prediction } from '../types'
import PumpkinSvg from './PumpkinSvg.vue'
import SectionTitle from './SectionTitle.vue'
import SpringButton from './SpringButton.vue'

interface Candy {
  id: number
  color: string
  stripe: string
}

const CANDIES: Candy[] = [
  { id: 1, color: '#ff4fa0', stripe: '#ffd1e8' },
  { id: 2, color: '#7cc4ff', stripe: '#e3f4ff' },
  { id: 3, color: '#b6ff3c', stripe: '#f1ffd0' },
  { id: 4, color: '#a67bff', stripe: '#e8dcff' },
  { id: 5, color: '#ffd84a', stripe: '#fff6c4' },
]

const reduced = useReducedMotion()
const { play } = useSound()

const current = ref<Prediction | null>(null)
const flipped = ref(false)
const shaking = ref(false)
const busy = ref(false)
const candies = ref<Candy[]>([...CANDIES])
const eaten = ref(0)
const chewing = ref(0)
const areaEl = ref<HTMLElement | null>(null)
const pumpkinEl = ref<HTMLElement | null>(null)
const mounted = ref(false)
let timer: number | undefined

onMounted(() => {
  mounted.value = true
})
onBeforeUnmount(() => window.clearTimeout(timer))

const pumpkinAnimate = computed(() => {
  if (shaking.value) {
    return {
      rotate: [0, -9, 9, -7, 7, -4, 4, 0],
      scale: [1, 1.07, 1.03, 1.08, 1.02, 1.05, 1],
      y: 0,
    }
  }
  if (chewing.value > 0) return { scale: [1, 1.12, 0.94, 1.08, 1], rotate: 0, y: 0 }
  return reduced.value ? { rotate: 0, scale: 1, y: 0 } : { rotate: 0, scale: 1, y: [0, -8, 0] }
})

const pumpkinTransition = computed(() =>
  shaking.value
    ? { duration: 0.7, ease: 'easeInOut' as const }
    : chewing.value > 0
      ? { duration: 0.5 }
      : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const },
)

function ask(): void {
  if (busy.value) return
  busy.value = true
  flipped.value = false
  shaking.value = true
  play('spooky')
  timer = window.setTimeout(() => {
    shaking.value = false
    current.value = pickPrediction(current.value?.id ?? null)
    flipped.value = true
    busy.value = false
  }, 750)
}

function onCandyDragEnd(candy: Candy, info: { point: { x: number; y: number } }): void {
  const el = pumpkinEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const px = info.point.x - window.scrollX
  const py = info.point.y - window.scrollY
  const inside = px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom
  if (!inside) return
  candies.value = candies.value.filter((c) => c.id !== candy.id)
  eaten.value++
  chewing.value++
  play('catch')
  window.setTimeout(() => {
    chewing.value = 0
  }, 520)
}

function refill(): void {
  candies.value = [...CANDIES]
}
</script>

<template>
  <section id="oracle" class="relative overflow-hidden bg-gradient-to-b from-night-900 via-night-800 to-night-900 px-4 py-20 sm:py-24" aria-labelledby="oracle-title">
    <div class="relative mx-auto max-w-5xl">
      <SectionTitle
        eyebrow="Предсказания"
        title="Тыква-гадалка"
        lead="Постучи по тыкве, задай вопрос про жизнь и получи абсолютно ненаучный ответ. Если подкупить её конфетой, она станет разговорчивее."
      />

      <div class="grid items-center gap-10 lg:grid-cols-2">
        <!-- Тыква + конфеты -->
        <div ref="areaEl" class="relative flex flex-col items-center gap-4 rounded-3xl px-2 pb-4 pt-2">
          <div ref="pumpkinEl">
          <Motion
            as="button"
            type="button"
            class="relative block aspect-[320/300] w-72 cursor-pointer border-0 bg-transparent p-0 sm:w-96"
            aria-label="Спросить тыкву-гадалку"
            data-testid="oracle-pumpkin"
            :animate="pumpkinAnimate"
            :transition="pumpkinTransition"
            :while-hover="{ scale: 1.04 }"
            :while-press="{ scale: 0.94 }"
            @click="ask"
          >
            <PumpkinSvg eyes="triangle" nose="triangle" :mouth="eaten > 0 && !shaking ? 'smile' : 'toothy'" :flash="shaking" flicker />
          </Motion>
          </div>

          <p class="text-center text-mist" data-testid="candy-hint">
            <template v-if="candies.length">Перетащи конфету тыкве в рот. Съедено: {{ eaten }}</template>
            <template v-else>Все конфеты съедены: {{ eaten }}. Тыква сыта и довольна.</template>
          </p>

          <div class="flex min-h-16 flex-wrap items-center justify-center gap-3" data-testid="candy-tray">
            <AnimatePresence>
              <Motion
                v-for="candy in (mounted ? candies : [])"
                :key="candy.id"
                class="grid h-14 w-14 cursor-grab touch-none place-items-center active:cursor-grabbing"
                drag
                :drag-constraints="areaEl ?? false"
                :drag-elastic="0.4"
                :drag-snap-to-origin="true"
                :drag-transition="{ bounceStiffness: 500, bounceDamping: 18 }"
                :initial="{ scale: 0, rotate: -90 }"
                :animate="{ scale: 1, rotate: 0 }"
                :exit="{ scale: 0, rotate: 200, opacity: 0 }"
                :while-hover="{ scale: 1.15 }"
                :while-drag="{ scale: 1.3, rotate: 14, zIndex: 20 }"
                :transition="{ type: 'spring', stiffness: 300, damping: 16 }"
                data-testid="candy"
                @drag-end="(_e: PointerEvent, info: { point: { x: number; y: number } }) => onCandyDragEnd(candy, info)"
              >
                <svg viewBox="0 0 64 40" class="h-10 w-14" aria-label="Конфета" role="img">
                  <path d="M14 20 L2 8 L2 32 Z M50 20 L62 8 L62 32 Z" :fill="candy.color" />
                  <ellipse cx="32" cy="20" rx="20" ry="14" :fill="candy.color" />
                  <path d="M22 9 Q16 20 22 31 M32 6 Q26 20 32 34 M42 9 Q36 20 42 31" :stroke="candy.stripe" stroke-width="3" fill="none" stroke-linecap="round" />
                </svg>
              </Motion>
            </AnimatePresence>
            <Motion
              v-if="!candies.length"
              as="button"
              type="button"
              class="rounded-full border border-violet/60 bg-night-900 px-4 py-2 text-sm font-semibold text-bone"
              :initial="{ scale: 0 }"
              :animate="{ scale: 1 }"
              :while-press="{ scale: 0.9 }"
              @click="refill"
            >
              Принести ещё конфет
            </Motion>
          </div>
        </div>

        <!-- Карточка предсказания -->
        <div class="flex flex-col items-center gap-6">
          <div class="w-full max-w-md [perspective:1200px]">
            <Motion
              class="relative h-72 w-full [transform-style:preserve-3d] sm:h-80"
              :animate="{ rotateY: flipped ? 180 : 0 }"
              :transition="{ type: 'spring', stiffness: 120, damping: 14 }"
              data-testid="flip-card"
            >
              <div
                class="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-violet/60 bg-gradient-to-br from-night-700 to-night-900 p-6 text-center shadow-[0_0_40px_rgb(166_123_255/0.25)]"
              >
                <Motion
                  as="span"
                  class="font-display text-7xl text-violet"
                  :animate="reduced ? {} : { rotate: [-6, 6, -6], scale: [1, 1.1, 1] }"
                  :transition="{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }"
                >?</Motion>
                <p class="text-lg text-bone">Тыква готова пророчить.</p>
                <p class="text-mist">Нажми на неё или на кнопку ниже.</p>
              </div>
              <div
                class="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-pumpkin bg-gradient-to-br from-[#3a1a05] to-night-900 p-6 text-center shadow-[0_0_44px_rgb(255_122_26/0.35)] [transform:rotateY(180deg)]"
              >
                <p class="text-sm font-bold uppercase tracking-[0.25em] text-acid">Тыква говорит</p>
                <p class="text-xl font-semibold leading-snug text-bone sm:text-2xl" data-testid="prediction-text">
                  {{ current?.text }}
                </p>
              </div>
            </Motion>
          </div>

          <SpringButton variant="primary" data-testid="ask-button" @click="ask">
            {{ current ? 'Спросить ещё раз' : 'Спросить тыкву' }}
          </SpringButton>
        </div>
      </div>
    </div>
  </section>
</template>
