import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Следит, какая из секций сейчас в центре экрана. */
export function useActiveSection(ids: readonly string[]): Ref<string> {
  const active = ref<string>(ids[0] ?? '')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.value = entry.target.id
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  return active
}
