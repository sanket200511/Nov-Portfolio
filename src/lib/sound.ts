let context: AudioContext | null = null
let stopCurrent: (() => void) | null = null

export function setRoomSound(on: boolean): boolean {
  if (!on) {
    stopCurrent?.()
    stopCurrent = null
    return false
  }

  const AudioCtx = window.AudioContext
  context ??= new AudioCtx()
  void context.resume()
  stopCurrent?.()

  const length = context.sampleRate * 2
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)
  let brown = 0
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1
    brown = (brown + 0.02 * white) / 1.02
    data[i] = brown * 3.2
  }

  const rain = context.createBufferSource()
  rain.buffer = buffer
  rain.loop = true
  const highpass = context.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 900
  const rainGain = context.createGain()
  rainGain.gain.value = 0.045
  rain.connect(highpass)
  highpass.connect(rainGain)
  rainGain.connect(context.destination)
  rain.start()

  const hum = context.createOscillator()
  hum.type = 'sine'
  hum.frequency.value = 58
  const humGain = context.createGain()
  humGain.gain.value = 0.012
  hum.connect(humGain)
  humGain.connect(context.destination)
  hum.start()

  stopCurrent = () => {
    rain.stop()
    hum.stop()
    rainGain.disconnect()
    humGain.disconnect()
  }
  return true
}
