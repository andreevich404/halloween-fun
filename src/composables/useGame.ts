import { computed, onScopeDispose, ref } from 'vue'
import type {
  BurstEffect,
  GamePhase,
  GhostColor,
  GhostEntity,
  GhostFace,
  Rank,
} from '../types'
import { useStoredNumber } from './useLocalStorage'
import { useSound } from './useSound'

export const GAME_SECONDS = 30
const MAX_GHOSTS = 5
const TRAP_SCORE_PENALTY = 3
const TRAP_TIME_PENALTY_MS = 2000
const GOLD_POINTS = 5

export const RANKS: Rank[] = [
  { min: 0, title: 'Начинающий пугало', note: 'Призраки смеются над тобой. Но тихо, из вежливости.' },
  { min: 8, title: 'Стажёр-привидение', note: 'Уже не мимо, но ещё не точно. Тыква кивает.' },
  { min: 16, title: 'Ночной сторож', note: 'С фонариком и верой в лучшее. Кладбище под присмотром.' },
  { min: 28, title: 'Охотник за духами', note: 'Призраки переходят на другую сторону улицы.' },
  { min: 42, title: 'Мастер экзорцизма', note: 'Даже полтергейст просит у тебя автограф.' },
  { min: 60, title: 'Повелитель теней', note: 'Призраки сами записываются в очередь. Тыквы аплодируют.' },
]

const COLORS: { color: GhostColor; points: number }[] = [
  { color: 'blue', points: 1 },
  { color: 'green', points: 1 },
  { color: 'pink', points: 1 },
  { color: 'purple', points: 2 },
]
const FACES: GhostFace[] = ['boo', 'grin', 'sleepy', 'angry', 'tongue', 'dizzy']

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function drift(amplitude: number, steps: number): number[] {
  const values: number[] = [0]
  for (let i = 1; i < steps; i++) values.push(Math.round(rand(-amplitude, amplitude)))
  values.push(0)
  return values
}

export function rankFor(score: number): Rank {
  let result = RANKS[0]!
  for (const rank of RANKS) if (score >= rank.min) result = rank
  return result
}

export function useGame() {
  const { play } = useSound()
  const phase = ref<GamePhase>('idle')
  const score = ref(0)
  const timeLeftMs = ref(GAME_SECONDS * 1000)
  const caught = ref(0)
  const newRecord = ref(false)
  const best = useStoredNumber('pumpkin-fever:best', 0)
  const ghosts = ref<GhostEntity[]>([])
  const effects = ref<BurstEffect[]>([])
  const shakeKey = ref(0)
  /** Короткая блокировка кнопок после финиша, чтобы быстрые тапы не перезапускали игру */
  const locked = ref(false)

  let nextId = 1
  let tickTimer: number | undefined
  let spawnTimer: number | undefined
  let startedAt = 0
  const lifeTimers = new Map<number, number>()

  const rank = computed(() => rankFor(score.value))
  const progress = computed(() => timeLeftMs.value / (GAME_SECONDS * 1000))
  const secondsLeft = computed(() => Math.max(0, Math.ceil(timeLeftMs.value / 1000)))

  function elapsedSec(): number {
    return (performance.now() - startedAt) / 1000
  }

  function makeGhost(): GhostEntity {
    const roll = Math.random()
    const kind = roll < 0.07 ? 'golden' : roll < 0.2 && elapsedSec() > 3 ? 'trap' : 'normal'
    const base = pick(COLORS)
    const hurry = Math.min(1, elapsedSec() / GAME_SECONDS)
    const lifetime =
      kind === 'golden' ? rand(1700, 2300) : rand(2600, 3800) - hurry * 800 - (base.points > 1 ? 400 : 0)
    const amp = kind === 'golden' ? 70 : base.points > 1 ? 52 : 36

    // Стараемся не ставить призраков друг на друга.
    let x = 0
    let y = 0
    for (let attempt = 0; attempt < 8; attempt++) {
      x = rand(4, 76)
      y = rand(6, 70)
      const clear = ghosts.value.every((g) => Math.hypot(g.x - x, (g.y - y) * 1.3) > 18)
      if (clear) break
    }

    return {
      id: nextId++,
      kind,
      color: kind === 'golden' ? 'gold' : base.color,
      face: kind === 'golden' ? 'grin' : pick(FACES),
      x,
      y,
      size: kind === 'golden' ? 78 : kind === 'trap' ? 70 : Math.round(rand(70, 96)),
      points: kind === 'golden' ? GOLD_POINTS : kind === 'trap' ? -TRAP_SCORE_PENALTY : base.points,
      lifetime,
      driftX: drift(amp, 4),
      driftY: drift(amp * 0.8, 4),
      driftRotate: drift(14, 4),
      driftDuration: kind === 'golden' ? rand(1.1, 1.6) : rand(2.2, 3.2),
    }
  }

  function removeGhost(id: number): void {
    const timer = lifeTimers.get(id)
    if (timer !== undefined) window.clearTimeout(timer)
    lifeTimers.delete(id)
    ghosts.value = ghosts.value.filter((g) => g.id !== id)
  }

  function addEffect(effect: Omit<BurstEffect, 'id'>): void {
    const id = nextId++
    effects.value.push({ ...effect, id })
    window.setTimeout(() => {
      effects.value = effects.value.filter((e) => e.id !== id)
    }, 1100)
  }

  function spawn(): void {
    if (phase.value !== 'playing') return
    if (ghosts.value.length < MAX_GHOSTS) {
      const ghost = makeGhost()
      ghosts.value.push(ghost)
      lifeTimers.set(ghost.id, window.setTimeout(() => removeGhost(ghost.id), ghost.lifetime))
    }
    const hurry = Math.min(1, elapsedSec() / GAME_SECONDS)
    spawnTimer = window.setTimeout(spawn, rand(450, 800) - hurry * 220)
  }

  function finish(): void {
    window.clearInterval(tickTimer)
    window.clearTimeout(spawnTimer)
    for (const timer of lifeTimers.values()) window.clearTimeout(timer)
    lifeTimers.clear()
    ghosts.value = []
    timeLeftMs.value = 0
    newRecord.value = score.value > best.value
    if (newRecord.value) best.value = score.value
    phase.value = 'over'
    locked.value = true
    window.setTimeout(() => {
      locked.value = false
    }, 900)
    play('end')
  }

  function start(): void {
    window.clearInterval(tickTimer)
    window.clearTimeout(spawnTimer)
    score.value = 0
    caught.value = 0
    newRecord.value = false
    ghosts.value = []
    effects.value = []
    timeLeftMs.value = GAME_SECONDS * 1000
    startedAt = performance.now()
    phase.value = 'playing'
    play('start')
    spawn()
    tickTimer = window.setInterval(() => {
      timeLeftMs.value = Math.max(0, timeLeftMs.value - 100)
      if (timeLeftMs.value <= 0) finish()
    }, 100)
  }

  function catchGhost(id: number): void {
    if (phase.value !== 'playing') return
    const ghost = ghosts.value.find((g) => g.id === id)
    if (!ghost) return
    removeGhost(id)

    if (ghost.kind === 'trap') {
      score.value = Math.max(0, score.value - TRAP_SCORE_PENALTY)
      timeLeftMs.value = Math.max(0, timeLeftMs.value - TRAP_TIME_PENALTY_MS)
      shakeKey.value++
      addEffect({ x: ghost.x, y: ghost.y, label: `-${TRAP_SCORE_PENALTY} и -2 с`, tone: 'bad' })
      play('trap')
      if (timeLeftMs.value <= 0) finish()
      return
    }

    score.value += ghost.points
    caught.value++
    addEffect({
      x: ghost.x,
      y: ghost.y,
      label: `+${ghost.points}`,
      tone: ghost.kind === 'golden' ? 'gold' : 'good',
    })
    play(ghost.kind === 'golden' ? 'gold' : 'catch')
  }

  onScopeDispose(() => {
    window.clearInterval(tickTimer)
    window.clearTimeout(spawnTimer)
    for (const timer of lifeTimers.values()) window.clearTimeout(timer)
  })

  return {
    phase,
    score,
    best,
    caught,
    newRecord,
    ghosts,
    effects,
    shakeKey,
    locked,
    rank,
    progress,
    secondsLeft,
    start,
    catchGhost,
  }
}
