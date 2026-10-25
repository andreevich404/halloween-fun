<script setup lang="ts">
import { AnimatePresence, Motion, animate, useReducedMotion } from 'motion-v'
import { ref, watch } from 'vue'
import { GAME_SECONDS, useGame } from '../composables/useGame'
import { useSound } from '../composables/useSound'
import BurstFx from './BurstFx.vue'
import Ghost from './Ghost.vue'
import SectionTitle from './SectionTitle.vue'
import SpringButton from './SpringButton.vue'

const reduced = useReducedMotion()
const { enabled: soundOn, toggle: toggleSound } = useSound()
const {
  phase, score, best, caught, newRecord, ghosts, effects, shakeKey, locked, rank,
  progress, secondsLeft, start, catchGhost,
} = useGame()

const fieldRef = ref<HTMLElement | null>(null)

watch(shakeKey, () => {
  if (fieldRef.value && !reduced.value) {
    void animate(fieldRef.value, { x: [0, -14, 14, -9, 9, 0] }, { duration: 0.45 })
  }
})
</script>

<template>
  <section id="game" class="relative overflow-hidden bg-[#160d30] px-4 py-20 sm:py-24" aria-labelledby="game-title">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-night-950 to-transparent" />
    <div class="relative mx-auto max-w-4xl">
      <SectionTitle
        eyebrow="Мини-игра"
        title="Ловец призраков"
        lead="30 секунд, толпа привидений и подозрительные тыквы. Лови духов касанием, золотых лови особенно, а зелёных тыкв — сторонись."
      />

      <Motion
        class="rounded-3xl border border-night-600 bg-night-800/80 p-3 shadow-[0_0_60px_rgb(166_123_255/0.15)] sm:p-5"
        :initial="{ opacity: 0, y: 60 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true, amount: 0.15 }"
        :transition="{ type: 'spring', stiffness: 110, damping: 16 }"
      >
        <!-- HUD -->
        <div class="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2" data-testid="hud">
          <div class="flex items-baseline gap-2">
            <span class="text-sm text-mist">Счёт</span>
            <Motion
              :key="score"
              as="span"
              class="inline-block min-w-[2ch] text-3xl font-extrabold tabular-nums text-acid text-glow-acid"
              :initial="{ scale: 1.5, rotate: -6 }"
              :animate="{ scale: 1, rotate: 0 }"
              :transition="{ type: 'spring', stiffness: 500, damping: 14 }"
              data-testid="score"
            >{{ score }}</Motion>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-sm text-mist">Рекорд</span>
            <span class="text-xl font-bold text-pumpkin-soft" data-testid="best">{{ best }}</span>
          </div>
          <div class="ml-auto flex items-center gap-3">
            <span class="text-xl font-bold tabular-nums text-bone" data-testid="timer">{{ secondsLeft }} с</span>
            <Motion
              as="button"
              type="button"
              class="min-h-11 rounded-full border border-violet/60 bg-night-900 px-4 text-sm font-semibold text-bone"
              :aria-pressed="soundOn"
              data-testid="sound-toggle"
              :while-hover="{ scale: 1.06 }"
              :while-press="{ scale: 0.92 }"
              @click="toggleSound"
            >
              Звук: {{ soundOn ? 'вкл' : 'выкл' }}
            </Motion>
          </div>
        </div>
        <div class="mb-3 h-2.5 overflow-hidden rounded-full bg-night-950">
          <div
            class="h-full rounded-full bg-gradient-to-r from-acid to-pumpkin transition-[width] duration-100 ease-linear"
            :style="{ width: `${progress * 100}%` }"
          />
        </div>

        <!-- Поле -->
        <div
          ref="fieldRef"
          class="ghost-field relative h-[26rem] overflow-hidden rounded-2xl border border-night-600 bg-gradient-to-b from-[#33207a] via-[#24154f] to-[#150a33] sm:h-[32rem]"
          data-testid="field"
        >
          <svg class="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0 100 V70 Q20 60 40 70 V52 q8 -14 16 0 V70 H90 V60 L100 40 L110 60 V72 H150 q10 -20 20 0 V66 H200 V50 q8 -16 16 0 V70 H260 V58 h6 V46 h6 V58 h6 V70 H320 q12 -22 24 0 V62 h20 V72 H400 V100 Z"
              fill="#07030f"
            />
          </svg>
          <div class="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-violet/20 blur-3xl" />

          <AnimatePresence>
            <Ghost
              v-for="g in ghosts"
              :key="g.id"
              :ghost="g"
              :reduced="reduced"
              @catch="catchGhost"
            />
          </AnimatePresence>
          <BurstFx v-for="e in effects" :key="e.id" :effect="e" />

          <AnimatePresence mode="wait">
            <Motion
              v-if="phase === 'idle'"
              key="idle"
              class="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-night-950/70 p-6 text-center backdrop-blur-[2px]"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :exit="{ opacity: 0, scale: 1.1 }"
            >
              <p class="font-display text-3xl text-pumpkin-soft text-glow-orange sm:text-4xl">Готов к охоте?</p>
              <p class="max-w-md text-mist">
                Касайся призраков, пока они не растаяли. Золотой даёт +5, фиолетовый +2. Зелёная тыква отнимет
                3 очка и 2 секунды.
              </p>
              <SpringButton variant="acid" data-testid="start" @click="start">Начать охоту</SpringButton>
            </Motion>
            <Motion
              v-else-if="phase === 'over'"
              key="over"
              class="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-night-950/80 p-6 text-center backdrop-blur-sm"
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :exit="{ opacity: 0, scale: 1.1 }"
              :transition="{ type: 'spring', stiffness: 200, damping: 18 }"
              data-testid="result"
            >
              <p class="text-sm font-bold uppercase tracking-[0.3em] text-acid">Время вышло</p>
              <p class="font-display text-3xl text-pumpkin-soft text-glow-orange sm:text-4xl" data-testid="rank">
                {{ rank.title }}
              </p>
              <p class="text-lg text-bone">
                Очков: <b class="text-acid" data-testid="final-score">{{ score }}</b> · поймано: {{ caught }}
              </p>
              <Motion
                v-if="newRecord"
                class="rounded-full bg-pumpkin px-4 py-1 text-sm font-bold text-night-950"
                :initial="{ scale: 0, rotate: -20 }"
                :animate="{ scale: [0, 1.3, 1], rotate: [-20, 6, -3] }"
                :transition="{ delay: 0.3, duration: 0.6 }"
              >
                Новый рекорд!
              </Motion>
              <p class="max-w-sm text-mist">{{ rank.note }}</p>
              <SpringButton variant="acid" data-testid="restart" :disabled="locked" :class="locked ? 'opacity-60' : ''" @click="start">Ещё раз</SpringButton>
            </Motion>
          </AnimatePresence>
        </div>
        <p class="mt-3 text-center text-sm text-mist">
          Длительность раунда: {{ GAME_SECONDS }} секунд. Рекорд хранится в твоём браузере.
        </p>
      </Motion>
    </div>
  </section>
</template>
