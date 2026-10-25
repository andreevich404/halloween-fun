<script setup lang="ts" generic="T extends string">
import { Motion } from 'motion-v'

defineProps<{
  groupId: string
  label: string
  options: { id: T; label: string }[]
  modelValue: T
  compact?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: T] }>()
</script>

<template>
  <fieldset class="m-0 min-w-0 border-0 p-0">
    <legend class="mb-2 p-0 text-sm font-bold uppercase tracking-[0.2em] text-acid">{{ label }}</legend>
    <div
      role="radiogroup"
      :aria-label="label"
      class="grid gap-1.5 rounded-2xl border border-night-600 bg-night-900 p-1.5"
      :class="compact ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'"
    >
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        role="radio"
        :aria-checked="option.id === modelValue"
        :data-testid="`${groupId}-${option.id}`"
        class="relative flex min-h-12 items-center justify-center gap-2 rounded-xl border-0 bg-transparent px-2 py-1.5 text-sm font-semibold transition-colors"
        :class="option.id === modelValue ? 'text-night-950' : 'text-bone hover:text-pumpkin-soft'"
        @click="emit('update:modelValue', option.id)"
      >
        <Motion
          v-if="option.id === modelValue"
          :layout-id="`seg-${groupId}`"
          class="absolute inset-0 rounded-xl bg-pumpkin shadow-[0_0_18px_rgb(255_122_26/0.55)]"
          :transition="{ type: 'spring', stiffness: 420, damping: 30 }"
        />
        <span class="relative z-10 flex items-center gap-2" :class="compact ? 'flex-col gap-1 text-xs sm:flex-row sm:gap-2 sm:text-sm' : ''">
          <slot name="icon" :option="option" />
          <span>{{ option.label }}</span>
        </span>
      </button>
    </div>
  </fieldset>
</template>
