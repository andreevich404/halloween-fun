import type { CandleDef, EyeDef, EyeId, MouthDef, MouthId, NoseDef, NoseId } from '../types'

function starPath(outer: number, inner: number, points: number): string {
  const parts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI / points) * i - Math.PI / 2
    parts.push(`${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`)
  }
  return `M${parts.join(' L')} Z`
}

/** Пути глаз заданы для левого глаза вокруг (0,0); правый зеркалится. */
export const EYES: EyeDef[] = [
  { id: 'triangle', label: 'Треугольные', path: 'M-28 22 L0 -28 L28 22 Z' },
  { id: 'round', label: 'Круглые', path: 'M-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0 Z' },
  { id: 'angry', label: 'Злые', path: 'M-32 -24 L30 4 L22 28 L-28 16 Z' },
  { id: 'slanted', label: 'Косые', path: 'M-34 12 Q-6 -34 34 -14 Q4 28 -34 12 Z' },
  { id: 'slits', label: 'Щёлки', path: 'M-34 2 Q0 -16 34 2 Q0 12 -34 2 Z' },
  { id: 'star', label: 'Звёзды', path: starPath(32, 14, 5) },
]

export const NOSES: NoseDef[] = [
  { id: 'triangle', label: 'Треугольный', path: 'M0 -16 L16 16 L-16 16 Z' },
  { id: 'round', label: 'Круглый', path: 'M-11 0 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 Z' },
  {
    id: 'dots',
    label: 'Дырочки',
    path: 'M-18 4 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z M6 4 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z',
  },
]

export const MOUTHS: MouthDef[] = [
  {
    id: 'toothy',
    label: 'Зубастая',
    path: 'M-66 -14 Q0 -34 66 -14 Q74 34 0 46 Q-74 34 -66 -14 Z',
    teeth: 'M-40 -24 h22 v20 h-22 Z M18 -24 h22 v20 h-22 Z M-11 36 h22 v14 h-22 Z',
  },
  { id: 'smile', label: 'Улыбка', path: 'M-62 -12 Q0 54 62 -12 Q0 14 -62 -12 Z' },
  {
    id: 'zigzag',
    label: 'Зигзаг',
    path: 'M-62 6 L-41 -12 L-20 6 L0 -12 L20 6 L41 -12 L62 6',
    stroke: 14,
  },
  { id: 'oh', label: 'Буква «О»', path: 'M-22 0 a22 28 0 1 0 44 0 a22 28 0 1 0 -44 0 Z' },
  {
    id: 'fangs',
    label: 'Клыки',
    path: 'M-64 -16 Q0 18 64 -16 Q0 48 -64 -16 Z',
    teeth: 'M-42 -12 L-28 22 L-16 -2 Z M16 -2 L28 22 L42 -12 Z',
  },
  { id: 'smirk', label: 'Ухмылка', path: 'M-60 12 Q-12 40 30 20 Q54 10 64 -18 Q44 40 -8 44 Q-48 42 -60 12 Z' },
]

export const CANDLES: CandleDef[] = [
  { id: 'orange', label: 'Оранжевая', core: '#ffd36b', glow: '#ff9a1f', swatch: '#ff9a1f' },
  { id: 'green', label: 'Кислотная', core: '#e6ff9a', glow: '#9dff3a', swatch: '#9dff3a' },
  { id: 'violet', label: 'Фиолетовая', core: '#e3caff', glow: '#b57bff', swatch: '#b57bff' },
]

export const EYE_IDS: EyeId[] = EYES.map((e) => e.id)
export const NOSE_IDS: NoseId[] = NOSES.map((n) => n.id)
export const MOUTH_IDS: MouthId[] = MOUTHS.map((m) => m.id)

export function findEye(id: EyeId): EyeDef {
  return EYES.find((e) => e.id === id) ?? EYES[0]!
}
export function findNose(id: NoseId): NoseDef {
  return NOSES.find((n) => n.id === id) ?? NOSES[0]!
}
export function findMouth(id: MouthId): MouthDef {
  return MOUTHS.find((m) => m.id === id) ?? MOUTHS[0]!
}
export function findCandle(id: string): CandleDef {
  return CANDLES.find((c) => c.id === id) ?? CANDLES[0]!
}
