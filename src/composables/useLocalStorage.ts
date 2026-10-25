import { ref, watch, type Ref } from 'vue'

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* приватный режим или переполнение — просто не сохраняем */
  }
}

/** Реактивное число в localStorage. Любые сбои хранилища глотаются. */
export function useStoredNumber(key: string, fallback = 0): Ref<number> {
  const raw = read(key)
  const parsed = raw === null ? Number.NaN : Number(raw)
  const state = ref<number>(Number.isFinite(parsed) ? parsed : fallback)
  watch(state, (value) => write(key, String(value)))
  return state
}
