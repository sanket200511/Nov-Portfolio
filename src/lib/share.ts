export function drawNoteCard(text: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.fillStyle = '#100e0c'
  ctx.fillRect(0, 0, 1200, 630)

  const glow = ctx.createRadialGradient(280, 220, 20, 280, 220, 420)
  glow.addColorStop(0, 'rgba(255, 179, 107, 0.55)')
  glow.addColorStop(1, 'rgba(16, 14, 12, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 1200, 630)

  ctx.fillStyle = '#f4e2a8'
  roundRect(ctx, 760, 150, 320, 240, 8)
  ctx.fill()
  ctx.fillStyle = '#2a2416'
  ctx.font = '32px Georgia, serif'
  wrapText(ctx, text, 788, 210, 268, 42)

  ctx.fillStyle = '#f4efe6'
  ctx.font = '500 22px "IBM Plex Mono", monospace'
  ctx.fillText('2:17 AM  ·  NAGPUR', 72, 120)
  ctx.font = 'italic 72px "Instrument Serif", Georgia, serif'
  ctx.fillText('You were in', 72, 240)
  ctx.fillText("Sanket's room.", 72, 320)
  ctx.font = '24px Georgia, serif'
  ctx.fillStyle = '#b7b0a4'
  ctx.fillText('The wall kept your note.', 72, 400)

  return canvas.toDataURL('image/png')
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapText(
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
