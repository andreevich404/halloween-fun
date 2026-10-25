export type GhostKind = 'normal' | 'golden' | 'trap'
export type GhostColor = 'blue' | 'green' | 'pink' | 'purple' | 'gold'
export type GhostFace = 'boo' | 'grin' | 'sleepy' | 'angry' | 'tongue' | 'dizzy'

export interface GhostEntity {
  id: number
  kind: GhostKind
  color: GhostColor
  face: GhostFace
  /** Позиция в процентах поля */
  x: number
  y: number
  /** Размер в пикселях */
  size: number
  points: number
  lifetime: number
  driftX: number[]
  driftY: number[]
  driftRotate: number[]
  driftDuration: number
}

export interface BurstEffect {
  id: number
  x: number
  y: number
  label: string
  tone: 'good' | 'gold' | 'bad'
}

export type GamePhase = 'idle' | 'playing' | 'over'

export interface Rank {
  min: number
  title: string
  note: string
}

export interface Prediction {
  id: number
  text: string
}

export type EyeId = 'triangle' | 'round' | 'angry' | 'slanted' | 'slits' | 'star'
export type NoseId = 'triangle' | 'round' | 'dots'
export type MouthId = 'toothy' | 'smile' | 'zigzag' | 'oh' | 'fangs' | 'smirk'
export type CandleId = 'orange' | 'green' | 'violet'

export interface PartOption<Id extends string> {
  id: Id
  label: string
}

export interface EyeDef extends PartOption<EyeId> {
  path: string
}

export interface NoseDef extends PartOption<NoseId> {
  path: string
}

export interface MouthDef extends PartOption<MouthId> {
  /** Дырка (светится) */
  path: string
  /** Зубы (цвета тыквы), поверх дырки */
  teeth?: string
  /** Толщина обводки, если рот нарисован линией */
  stroke?: number
}

export interface CandleDef extends PartOption<CandleId> {
  core: string
  glow: string
  swatch: string
}

export interface PumpkinConfig {
  eyes: EyeId
  nose: NoseId
  mouth: MouthId
  candle: CandleId
}

export interface SavedPumpkin extends PumpkinConfig {
  uid: number
}
