<script setup lang="ts">
import { Motion } from 'motion-v'
import { useActiveSection } from '../composables/useActiveSection'

const LINKS = [
  { id: 'top', label: 'Старт' },
  { id: 'game', label: 'Призраки' },
  { id: 'oracle', label: 'Гадалка' },
  { id: 'builder', label: 'Тыква' },
] as const

const active = useActiveSection(LINKS.map((l) => l.id))
</script>

<template>
  <Motion
    as="header"
    class="sticky top-0 z-50 border-b border-night-600/70 bg-night-950/85 backdrop-blur-md"
    :initial="{ y: -70 }"
    :animate="{ y: 0 }"
    :transition="{ type: 'spring', stiffness: 140, damping: 16, delay: 0.2 }"
  >
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
      <a href="#top" class="flex items-center gap-2 text-bone no-underline" aria-label="Тыквенная лихорадка, в начало">
        <Motion
          as="span"
          class="inline-flex"
          :while-hover="{ rotate: [0, -14, 14, -8, 0], scale: 1.15 }"
          :transition="{ duration: 0.5 }"
        >
          <svg viewBox="0 0 64 64" class="h-8 w-8" aria-hidden="true">
            <path d="M30 12c1-4 4-6 8-6-1 4-3 6-6 7z" fill="#7bc43a" />
            <ellipse cx="20" cy="38" rx="13" ry="16" fill="#e8620c" />
            <ellipse cx="44" cy="38" rx="13" ry="16" fill="#e8620c" />
            <ellipse cx="32" cy="38" rx="14" ry="18" fill="#ff8a1f" />
            <path d="M22 33l5 6h-10zM42 33l5 6H37z" fill="#ffe66b" />
            <path d="M20 46q12 10 24 0-3 6-12 7-9-1-12-7z" fill="#ffe66b" />
          </svg>
        </Motion>
        <span class="font-display hidden text-lg text-pumpkin-soft md:inline">Тыквенная лихорадка</span>
      </a>
      <nav aria-label="Разделы сайта" class="flex items-center gap-0.5 sm:gap-1">
        <a
          v-for="link in LINKS"
          :key="link.id"
          :href="`#${link.id}`"
          class="relative rounded-full px-2.5 py-2 text-sm font-semibold no-underline transition-colors sm:px-4 sm:text-base"
          :class="active === link.id ? 'text-night-950' : 'text-mist hover:text-bone'"
          :aria-current="active === link.id ? 'true' : undefined"
          :data-testid="`nav-${link.id}`"
        >
          <Motion
            v-if="active === link.id"
            layout-id="nav-pill"
            class="absolute inset-0 rounded-full bg-acid"
            :transition="{ type: 'spring', stiffness: 420, damping: 32 }"
          />
          <span class="relative z-10">{{ link.label }}</span>
        </a>
      </nav>
    </div>
  </Motion>
</template>
