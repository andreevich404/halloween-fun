import { ref } from 'vue'

export type SoundName = 'catch' | 'gold' | 'trap' | 'start' | 'end' | 'spooky'

interface Tone {
  freq: number
  at: number
  len: number
  type: OscillatorType
  gain: number
  slideTo?: number
}

const TONES: Record<SoundName, Tone[]> = {
  catch: [{ freq: 520, slideTo: 880, at: 0, len: 0.12, type: 'triangle', gain: 0.14 }],
  gold: [
    { freq: 660, at: 0, len: 0.09, type: 'sine', gain: 0.16 },
    { freq: 880, at: 0.08, len: 0.09, type: 'sine', gain: 0.16 },
    { freq: 1320, at: 0.16, len: 0.18, type: 'sine', gain: 0.16 },
  ],
  trap: [{ freq: 180, slideTo: 70, at: 0, len: 0.3, type: 'sawtooth', gain: 0.12 }],
  start: [
    { freq: 330, at: 0, len: 0.1, type: 'square', gain: 0.08 },
    { freq: 495, at: 0.1, len: 0.14, type: 'square', gain: 0.08 },
  ],
  end: [
    { freq: 440, at: 0, len: 0.15, type: 'triangle', gain: 0.14 },
    { freq: 330, at: 0.15, len: 0.15, type: 'triangle', gain: 0.14 },
    { freq: 220, at: 0.3, len: 0.3, type: 'triangle', gain: 0.14 },
  ],
  spooky: [{ freq: 300, slideTo: 140, at: 0, len: 0.45, type: 'sine', gain: 0.14 }],
}

// Общее состояние: один переключатель на всю страницу (по умолчанию звук выключен).
const enabled = ref(false)
let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (ctx) return ctx
  try {
    const Ctor = window.AudioContext
    ctx = new Ctor()
  } catch {
    ctx = null
  }
  return ctx
}

export function useSound() {
  function toggle(): void {
    enabled.value = !enabled.value
    if (enabled.value) {
      void getContext()?.resume()
      play('start')
    }
  }

  function play(name: SoundName): void {
    if (!enabled.value) return
    const audio = getContext()
    if (!audio) return
    if (audio.state === 'suspended') void audio.resume()
    const now = audio.currentTime
    for (const tone of TONES[name]) {
      const osc = audio.createOscillator()
      const amp = audio.createGain()
      osc.type = tone.type
      osc.frequency.setValueAtTime(tone.freq, now + tone.at)
      if (tone.slideTo) {
        osc.frequency.exponentialRampToValueAtTime(tone.slideTo, now + tone.at + tone.len)
      }
      amp.gain.setValueAtTime(0.0001, now + tone.at)
      amp.gain.exponentialRampToValueAtTime(tone.gain, now + tone.at + 0.015)
      amp.gain.exponentialRampToValueAtTime(0.0001, now + tone.at + tone.len)
      osc.connect(amp).connect(audio.destination)
      osc.start(now + tone.at)
      osc.stop(now + tone.at + tone.len + 0.02)
    }
  }

  return { enabled, toggle, play }
}
