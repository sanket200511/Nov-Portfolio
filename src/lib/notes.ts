export type Note = {
  id: string
  text: string
  kind: 'room' | 'visitor'
  createdAt: string
}

const KEY = 'nov-room-notes-v1'

export const roomNotes: Note[] = [
  {
    id: 'room-monitor',
    text: 'Start with the bright screen. That is the work.',
    kind: 'room',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'room-paper',
    text: 'The paper on the floor is for people in a hurry.',
    kind: 'room',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'room-phone',
    text: 'The phone knows how to reach him.',
    kind: 'room',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

export function loadVisitorNotes(): Note[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Note[]
    return Array.isArray(parsed) ? parsed.filter((note) => note.kind === 'visitor' && note.text) : []
  } catch {
    return []
  }
}

export function rememberNote(text: string): Note[] {
  const note: Note = {
    id: crypto.randomUUID(),
    text: text.trim().slice(0, 140),
    kind: 'visitor',
    createdAt: new Date().toISOString(),
  }
  const next = [note, ...loadVisitorNotes()].slice(0, 9)
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

function headers(): HeadersInit {
  const token = import.meta.env.VITE_NOTES_TOKEN
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

export async function pullRemoteNotes(): Promise<Note[]> {
  const url = import.meta.env.VITE_NOTES_URL
  if (!url) return []
  try {
    const response = await fetch(url, { headers: headers() })
    if (!response.ok) return []
    const data = (await response.json()) as { notes?: Note[] } | Note[]
    const notes = Array.isArray(data) ? data : data.notes
    return Array.isArray(notes) ? notes : []
  } catch {
    return []
  }
}

export async function pushRemoteNote(text: string): Promise<void> {
  const url = import.meta.env.VITE_NOTES_URL
  if (!url) return
  await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ text: text.trim().slice(0, 140) }),
  })
}
