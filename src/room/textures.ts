import * as THREE from 'three'

export function canvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  draw(ctx, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

export function crisisScreen(): THREE.CanvasTexture {
  return canvasTexture(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = '#071018'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#8fd0ff'
    ctx.font = '600 42px Segoe UI, sans-serif'
    ctx.fillText('CRISISFORGE', 48, 78)
    ctx.fillStyle = '#8ea0b3'
    ctx.font = '24px Segoe UI, sans-serif'
    ctx.fillText('Nagpur  ·  8 hospitals  ·  synthetic', 48, 118)

    const loads = [0.92, 0.71, 0.64, 0.83, 0.48, 0.77, 0.58, 0.88]
    loads.forEach((load, index) => {
      const x = 48 + (index % 4) * 240
      const y = 180 + Math.floor(index / 4) * 200
      ctx.fillStyle = '#102033'
      ctx.fillRect(x, y, 200, 140)
      ctx.fillStyle = load > 0.85 ? '#ffb25a' : '#7dcea0'
      ctx.fillRect(x + 16, y + 88, 168 * load, 18)
      ctx.fillStyle = '#d5e6f2'
      ctx.font = '22px Segoe UI, sans-serif'
      ctx.fillText(`Ward ${index + 1}`, x + 16, y + 42)
      ctx.fillText(`${Math.round(load * 100)}%`, x + 16, y + 74)
    })
  })
}

export function laptopScreen(title: string, stack: string): THREE.CanvasTexture {
  return canvasTexture(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = '#10140f'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#d6f5c5'
    ctx.font = '600 54px Segoe UI, sans-serif'
    ctx.fillText(title.toUpperCase(), 56, 140)
    ctx.fillStyle = '#8ea888'
    ctx.font = '28px Segoe UI, sans-serif'
    wrap(ctx, stack, 56, 210, 900, 40)
    ctx.fillStyle = '#243024'
    for (let i = 0; i < 8; i += 1) ctx.fillRect(56, 320 + i * 28, 700 - (i % 3) * 80, 10)
  })
}

export function phoneScreen(): THREE.CanvasTexture {
  return canvasTexture(400, 760, (ctx, w, h) => {
    ctx.fillStyle = '#0c1016'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#f4efe6'
    ctx.font = '500 72px Segoe UI, sans-serif'
    ctx.fillText('2:17', 36, 150)
    ctx.font = '24px Segoe UI, sans-serif'
    ctx.fillStyle = '#9aa8b5'
    ctx.fillText('3 notifications', 36, 200)
    const rows = ['GitHub', 'LinkedIn', 'sanketkurve.2005']
    rows.forEach((row, index) => {
      ctx.fillStyle = '#182232'
      ctx.fillRect(24, 280 + index * 120, 352, 100)
      ctx.fillStyle = '#f4efe6'
      ctx.font = '28px Segoe UI, sans-serif'
      ctx.fillText(row, 44, 340 + index * 120)
    })
  })
}

export function noteTexture(text: string, paper: string): THREE.CanvasTexture {
  return canvasTexture(512, 384, (ctx, w, h) => {
    ctx.fillStyle = paper
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(60, 40, 20, 0.15)'
    ctx.lineWidth = 8
    ctx.strokeRect(8, 8, w - 16, h - 16)
    ctx.fillStyle = '#2c2618'
    ctx.font = '36px Georgia, serif'
    wrap(ctx, text, 36, 78, 440, 46)
  })
}

export function boardTexture(): THREE.CanvasTexture {
  return canvasTexture(1024, 680, (ctx, w, h) => {
    ctx.fillStyle = '#efeae2'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#2a4d73'
    ctx.font = '54px Georgia, serif'
    const lines = ['Python', 'FastAPI  ·  PostgreSQL', 'ETL that does not lie', 'Pytest  ·  GitHub Actions']
    lines.forEach((line, index) => ctx.fillText(line, 70, 140 + index * 110))
    ctx.strokeStyle = '#8a3d32'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(70, 560)
    ctx.lineTo(420, 520)
    ctx.stroke()
  })
}

export function clockTexture(): THREE.CanvasTexture {
  return canvasTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#14110e'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#ffb36b'
    ctx.font = '500 92px Segoe UI, sans-serif'
    ctx.fillText('2:17', 70, 150)
    ctx.font = '24px Segoe UI, sans-serif'
    ctx.fillStyle = '#d9cbb8'
    ctx.fillText('AM', 360, 150)
  })
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let cursor = y
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursor)
      line = word
      cursor += lineHeight
    } else {
      line = next
    }
  }
  if (line) ctx.fillText(line, x, cursor)
}
