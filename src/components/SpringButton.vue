<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'acid' | 'ghost'
    href?: string
    type?: 'button' | 'submit'
    pressed?: boolean
  }>(),
  { variant: 'primary', type: 'button', href: undefined, pressed: undefined },
)

const classes = computed(() => {
  const base =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold tracking-wide no-underline select-none'
  switch (props.variant) {
    case 'acid':
      return `${base} border-2 border-acid bg-acid text-night-950 shadow-[0_0_28px_rgb(182_255_60/0.45)]`
    case 'ghost':
      return `${base} border-2 border-violet/70 bg-night-800/70 text-bone backdrop-blur`
    default:
      return `${base} border-2 border-pumpkin-soft bg-pumpkin text-night-950 shadow-[0_0_28px_rgb(255_122_26/0.5)]`
  }
})
</script>

<template>
  <Motion
    :as="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : type"
    :aria-pressed="pressed"
    :class="classes"
    :while-hover="{ scale: 1.07, rotate: -1.5 }"
    :while-press="{ scale: 0.9 }"
    :transition="{ type: 'spring', stiffness: 520, damping: 14 }"
  >
    <slot />
  </Motion>
</template>
