<script setup lang="ts">
import { Motion, useReducedMotion } from 'motion-v'
import { computed, useId } from 'vue'
import { findCandle, findEye, findMouth, findNose } from '../data/pumpkinParts'
import type { CandleId, EyeId, MouthId, NoseId } from '../types'

const props = withDefaults(
  defineProps<{
    eyes: EyeId
    nose: NoseId
    mouth: MouthId
    candle?: CandleId
    /** Свечка горит: лицо светится */
    glow?: boolean
    /** Затемнить тело (в тёмной комнате) */
    dim?: boolean
    /** Вспышка глаз */
    flash?: boolean
    /** Мерцание свечи */
    flicker?: boolean
  }>(),
  { candle: 'orange', glow: true, dim: false, flash: false, flicker: false },
)

const reduced = useReducedMotion()
const uid = useId()
const bodyId = `pk-body-${uid}`
const glowId = `pk-glow-${uid}`
const clipId = `pk-clip-${uid}`

const eye = computed(() => findEye(props.eyes))
const nose = computed(() => findNose(props.nose))
const mouth = computed(() => findMouth(props.mouth))
const candle = computed(() => findCandle(props.candle))

const OUTLINE = '#2a0e02'
const faceFill = computed(() => (props.glow ? candle.value.core : OUTLINE))
const eyeFill = computed(() => (props.flash ? '#ffffff' : faceFill.value))
const faceFilter = computed(() =>
  props.glow ? `drop-shadow(0 0 7px ${candle.value.glow}) drop-shadow(0 0 18px ${candle.value.glow})` : 'none',
)
const flickerAnim = computed(() =>
  props.flicker && props.glow && !reduced.value ? { opacity: [1, 0.78, 1, 0.9, 0.7, 1, 0.92, 1] } : { opacity: 1 },
)
</script>

<template>
  <svg viewBox="0 0 320 300" class="pointer-events-none block h-full w-full overflow-visible" role="img" aria-label="Тыква с вырезанным лицом">
    <defs>
      <radialGradient :id="bodyId" cx="0.5" cy="0.35" r="0.75">
        <stop offset="0" stop-color="#ffb04a" />
        <stop offset="0.55" stop-color="#ff7a1a" />
        <stop offset="1" stop-color="#b94606" />
      </radialGradient>
      <clipPath :id="clipId">
        <path :d="mouth.path" />
      </clipPath>
      <radialGradient :id="glowId" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" :stop-color="candle.glow" stop-opacity="0.4" />
        <stop offset="1" :stop-color="candle.glow" stop-opacity="0" />
      </radialGradient>
    </defs>

    <g :style="{ filter: dim ? 'brightness(0.42) saturate(0.9)' : 'none', transition: 'filter 0.6s' }">
      <!-- стебель -->
      <path d="M144 64 Q140 30 160 14 Q170 10 180 16 Q170 32 176 64 Z" fill="#5f7d1f" />
      <path d="M176 24 Q204 8 214 34 Q196 22 186 34" fill="none" stroke="#7bc43a" stroke-width="5" stroke-linecap="round" />
      <!-- доли -->
      <ellipse cx="62" cy="172" rx="62" ry="106" :fill="`url(#${bodyId})`" opacity="0.92" />
      <ellipse cx="258" cy="172" rx="62" ry="106" :fill="`url(#${bodyId})`" opacity="0.92" />
      <ellipse cx="112" cy="172" rx="76" ry="116" :fill="`url(#${bodyId})`" />
      <ellipse cx="208" cy="172" rx="76" ry="116" :fill="`url(#${bodyId})`" />
      <ellipse cx="160" cy="172" rx="70" ry="120" :fill="`url(#${bodyId})`" />
      <path
        d="M112 60 Q70 172 112 284 M208 60 Q250 172 208 284 M160 52 Q150 172 160 292 M60 90 Q22 172 60 256 M260 90 Q298 172 260 256"
        fill="none"
        stroke="#a33d04"
        stroke-opacity="0.55"
        stroke-width="3"
        stroke-linecap="round"
      />
      <ellipse cx="108" cy="104" rx="30" ry="14" fill="#ffd08a" opacity="0.35" transform="rotate(-28 108 104)" />
    </g>

    <!-- подсветка изнутри -->
    <Motion
      as="ellipse"
      cx="160"
      cy="178"
      rx="120"
      ry="100"
      :fill="`url(#${glowId})`"
      :style="{ opacity: glow ? 1 : 0, transition: 'opacity 0.6s' }"
      :animate="flickerAnim"
      :transition="{ duration: 2.6, repeat: Infinity, ease: 'linear' }"
    />

    <!-- лицо -->
    <Motion
      as="g"
      :style="{ filter: faceFilter, transition: 'filter 0.5s' }"
      :animate="flickerAnim"
      :transition="{ duration: 2.6, repeat: Infinity, ease: 'linear' }"
    >
      <Motion
        :key="`eyes-${eyes}`"
        as="g"
        class="origin-center [transform-box:fill-box]"
        :initial="{ scale: 0.3, opacity: 0 }"
        :animate="{ scale: flash ? [1, 1.45, 1.2] : 1, opacity: 1 }"
        :transition="{ type: 'spring', stiffness: 380, damping: 14 }"
      >
        <template v-for="side in [108, 212]" :key="side">
          <path
            :d="eye.path"
            :transform="side === 108 ? 'translate(108 132)' : 'translate(212 132) scale(-1 1)'"
            :fill="OUTLINE"
            :stroke="OUTLINE"
            stroke-width="9"
            stroke-linejoin="round"
          />
          <path
            :d="eye.path"
            :transform="side === 108 ? 'translate(108 132)' : 'translate(212 132) scale(-1 1)'"
            :fill="eyeFill"
            style="transition: fill 0.2s"
          />
        </template>
      </Motion>

      <Motion
        :key="`nose-${nose.id}`"
        as="g"
        class="origin-center [transform-box:fill-box]"
        :initial="{ scale: 0.3, opacity: 0 }"
        :animate="{ scale: 1, opacity: 1 }"
        :transition="{ type: 'spring', stiffness: 380, damping: 14 }"
      >
        <path :d="nose.path" transform="translate(160 170)" :fill="OUTLINE" :stroke="OUTLINE" stroke-width="9" stroke-linejoin="round" />
        <path :d="nose.path" transform="translate(160 170)" :fill="faceFill" style="transition: fill 0.3s" />
      </Motion>

      <Motion
        :key="`mouth-${mouth.id}`"
        as="g"
        class="origin-center [transform-box:fill-box]"
        :initial="{ scale: 0.3, opacity: 0 }"
        :animate="{ scale: 1, opacity: 1 }"
        :transition="{ type: 'spring', stiffness: 380, damping: 14 }"
      >
        <g transform="translate(160 226)">
          <path
            :d="mouth.path"
            :fill="mouth.stroke ? 'none' : OUTLINE"
            :stroke="OUTLINE"
            :stroke-width="(mouth.stroke ?? 0) + 9"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <path
            :d="mouth.path"
            :fill="mouth.stroke ? 'none' : faceFill"
            :stroke="mouth.stroke ? faceFill : 'none'"
            :stroke-width="mouth.stroke ?? 0"
            stroke-linejoin="round"
            stroke-linecap="round"
            style="transition: fill 0.3s, stroke 0.3s"
          />
          <g v-if="mouth.teeth" :clip-path="`url(#${clipId})`">
            <path :d="mouth.teeth" fill="#ff8a1f" :stroke="OUTLINE" stroke-width="5" stroke-linejoin="round" />
          </g>
        </g>
      </Motion>
    </Motion>
  </svg>
</template>
