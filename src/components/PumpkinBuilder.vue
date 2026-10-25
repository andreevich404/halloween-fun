<script setup lang="ts">
import { AnimatePresence, Motion, useReducedMotion } from 'motion-v'
import { computed, reactive, ref } from 'vue'
import { CANDLES, EYES, MOUTHS, NOSES, EYE_IDS, MOUTH_IDS, NOSE_IDS, findCandle } from '../data/pumpkinParts'
import type { CandleId, EyeId, MouthId, NoseId, PumpkinConfig, SavedPumpkin } from '../types'
import PartIcon from './PartIcon.vue'
import PumpkinSvg from './PumpkinSvg.vue'
import SectionTitle from './SectionTitle.vue'
import SegmentedControl from './SegmentedControl.vue'
import SpringButton from './SpringButton.vue'

const reduced = useReducedMotion()

const config = reactive<PumpkinConfig>({ eyes: 'angry', nose: 'triangle', mouth: 'toothy', candle: 'orange' })
const lightsOn = ref(false)
const popKey = ref(0)
const gallery = ref<SavedPumpkin[]>([])
let uid = 1

const candle = computed(() => findCandle(config.candle))
const eyeModel = computed({ get: () => config.eyes, set: (v: EyeId) => (config.eyes = v) })
const noseModel = computed({ get: () => config.nose, set: (v: NoseId) => (config.nose = v) })
const mouthModel = computed({ get: () => config.mouth, set: (v: MouthId) => (config.mouth = v) })
const candleModel = computed({ get: () => config.candle, set: (v: CandleId) => (config.candle = v) })

const roomBg = computed(() => (lightsOn.value ? '#4a3680' : '#050210'))

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function randomize(): void {
  config.eyes = pick(EYE_IDS)
  config.nose = pick(NOSE_IDS)
  config.mouth = pick(MOUTH_IDS)
  config.candle = pick(CANDLES).id
  popKey.value++
}

function save(): void {
  gallery.value = [{ ...config, uid: uid++ }, ...gallery.value].slice(0, 6)
}

function load(item: SavedPumpkin): void {
  config.eyes = item.eyes
  config.nose = item.nose
  config.mouth = item.mouth
  config.candle = item.candle
}

function remove(id: number): void {
  gallery.value = gallery.value.filter((g) => g.uid !== id)
}
</script>

<template>
  <section id="builder" class="relative overflow-hidden bg-night-900 px-4 py-20 sm:py-24" aria-labelledby="builder-title">
    <div class="relative mx-auto max-w-6xl">
      <SectionTitle
        eyebrow="Конструктор"
        title="Вырежи свою тыкву"
        lead="Выбирай глаза, нос и рот, зажигай свечу нужного цвета и выключай свет. Только пальцы целы остаются."
      />

      <div class="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
        <!-- Комната -->
        <div class="mx-auto flex w-full max-w-xl flex-col gap-4 lg:max-w-none">
          <Motion
            class="relative flex aspect-[4/3.4] w-full items-end justify-center overflow-hidden rounded-3xl border border-night-600"
            :animate="{ backgroundColor: roomBg }"
            :transition="{ duration: 0.6 }"
            data-testid="room"
            :data-lights="lightsOn ? 'on' : 'off'"
          >
            <!-- окно с луной -->
            <div class="absolute left-5 top-5 h-20 w-16 rounded-t-full border-4 border-night-600 bg-[#0d0a2a] sm:h-28 sm:w-24">
              <div class="absolute right-2 top-3 h-6 w-6 rounded-full bg-[#fff3c4] shadow-[0_0_18px_#fff3c4] sm:h-8 sm:w-8" />
              <div class="absolute inset-x-0 top-1/2 h-1 bg-night-600" />
              <div class="absolute inset-y-0 left-1/2 w-1 bg-night-600" />
            </div>
            <!-- свечение свечи -->
            <Motion
              class="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              :style="{ background: `radial-gradient(circle, ${candle.glow}66 0%, transparent 60%)` }"
              :animate="{
                opacity: lightsOn ? 0.18 : reduced ? 0.9 : [0.9, 0.6, 1, 0.75, 0.95, 0.65, 0.9],
              }"
              :transition="{ duration: lightsOn || reduced ? 0.5 : 2.4, repeat: lightsOn || reduced ? 0 : Infinity }"
            />
            <div class="absolute inset-x-0 bottom-0 h-10 bg-black/45" />
            <Motion
              :key="popKey"
              class="relative z-10 mb-4 w-[72%] max-w-md"
              :initial="{ scale: 0.7, rotate: -12, opacity: 0.4 }"
              :animate="{ scale: 1, rotate: 0, opacity: 1 }"
              :transition="{ type: 'spring', stiffness: 260, damping: 12 }"
              data-testid="builder-pumpkin"
            >
              <PumpkinSvg
                :eyes="config.eyes"
                :nose="config.nose"
                :mouth="config.mouth"
                :candle="config.candle"
                :glow="true"
                :dim="!lightsOn"
                flicker
              />
            </Motion>
          </Motion>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span id="lights-label" class="font-semibold text-bone">Свет: {{ lightsOn ? 'включён' : 'выключен' }}</span>
              <button
                type="button"
                role="switch"
                :aria-checked="lightsOn"
                aria-labelledby="lights-label"
                data-testid="lights-toggle"
                class="flex h-9 w-16 cursor-pointer items-center rounded-full border-2 border-violet/70 bg-night-950 p-1"
                :class="lightsOn ? 'justify-end' : 'justify-start'"
                @click="lightsOn = !lightsOn"
              >
                <Motion
                  layout
                  class="h-6 w-6 rounded-full"
                  :class="lightsOn ? 'bg-pumpkin-soft shadow-[0_0_12px_#ffb347]' : 'bg-mist/60'"
                  :transition="{ type: 'spring', stiffness: 500, damping: 28 }"
                />
              </button>
            </div>
            <div class="flex gap-3">
              <SpringButton variant="ghost" data-testid="save-pumpkin" @click="save">В галерею</SpringButton>
              <SpringButton variant="acid" data-testid="random-pumpkin" @click="randomize">Случайная тыква</SpringButton>
            </div>
          </div>
        </div>

        <!-- Контролы -->
        <div class="flex flex-col gap-5">
          <SegmentedControl v-model="eyeModel" group-id="eyes" label="Глаза" :options="EYES">
            <template #icon="{ option }"><PartIcon kind="eye" :id="option.id" /></template>
          </SegmentedControl>
          <SegmentedControl v-model="noseModel" group-id="nose" label="Нос" :options="NOSES">
            <template #icon="{ option }"><PartIcon kind="nose" :id="option.id" /></template>
          </SegmentedControl>
          <SegmentedControl v-model="mouthModel" group-id="mouth" label="Рот" :options="MOUTHS">
            <template #icon="{ option }"><PartIcon kind="mouth" :id="option.id" /></template>
          </SegmentedControl>
          <SegmentedControl v-model="candleModel" group-id="candle" label="Свеча внутри" compact :options="CANDLES">
            <template #icon="{ option }">
              <span
                class="h-4 w-4 rounded-full border-2 border-night-950"
                :style="{ background: CANDLES.find((c) => c.id === option.id)?.swatch }"
              />
            </template>
          </SegmentedControl>
        </div>
      </div>

      <!-- Галерея -->
      <div class="mt-10">
        <h3 class="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-acid">Галерея тыкв</h3>
        <p v-if="!gallery.length" class="text-mist" data-testid="gallery-empty">
          Пока пусто. Нажми «В галерею», и тыква переедет сюда на постоянное жительство.
        </p>
        <Motion layout class="flex flex-wrap gap-4" data-testid="gallery">
          <AnimatePresence mode="popLayout">
            <Motion
              v-for="item in gallery"
              :key="item.uid"
              layout
              class="relative w-28 rounded-2xl border border-night-600 bg-night-800 p-2 sm:w-32"
              :initial="{ opacity: 0, scale: 0.4, y: 30 }"
              :animate="{ opacity: 1, scale: 1, y: 0 }"
              :exit="{ opacity: 0, scale: 0.3, rotate: 25 }"
              :transition="{ type: 'spring', stiffness: 300, damping: 22 }"
            >
              <button
                type="button"
                class="block w-full cursor-pointer border-0 bg-transparent p-0"
                aria-label="Вернуть эту тыкву в конструктор"
                @click="load(item)"
              >
                <PumpkinSvg :eyes="item.eyes" :nose="item.nose" :mouth="item.mouth" :candle="item.candle" />
              </button>
              <button
                type="button"
                class="absolute -right-2 -top-2 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-night-950 bg-pumpkin text-lg font-bold leading-none text-night-950"
                aria-label="Убрать тыкву из галереи"
                @click="remove(item.uid)"
              >
                ×
              </button>
            </Motion>
          </AnimatePresence>
        </Motion>
      </div>
    </div>
  </section>
</template>
