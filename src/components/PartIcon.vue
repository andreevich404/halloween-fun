<script setup lang="ts">
import { computed } from 'vue'
import { findEye, findMouth, findNose } from '../data/pumpkinParts'

const props = defineProps<{ kind: 'eye' | 'nose' | 'mouth'; id: string }>()

const def = computed(() => {
  if (props.kind === 'eye') return findEye(props.id as never)
  if (props.kind === 'nose') return findNose(props.id as never)
  return findMouth(props.id as never)
})
const teeth = computed(() => ('teeth' in def.value ? def.value.teeth : undefined))
const stroke = computed(() => ('stroke' in def.value ? def.value.stroke : undefined))
const viewBox = computed(() => (props.kind === 'mouth' ? '-76 -42 152 96' : '-40 -40 80 80'))
</script>

<template>
  <svg :viewBox="viewBox" class="h-9 w-12 shrink-0" aria-hidden="true">
    <path
      :d="def.path"
      :fill="stroke ? 'none' : 'currentColor'"
      :stroke="stroke ? 'currentColor' : 'none'"
      :stroke-width="stroke ?? 0"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
    <path v-if="teeth" :d="teeth" fill="#120a24" stroke="#120a24" stroke-width="2" stroke-linejoin="round" />
  </svg>
</template>
