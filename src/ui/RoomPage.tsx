import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profile, projects, type Selection } from '../content/profile'
import { loadVisitorNotes, pullRemoteNotes, pushRemoteNote, rememberNote, roomNotes, type Note } from '../lib/notes'
import { drawNoteCard } from '../lib/share'
import { setRoomSound } from '../lib/sound'
import { RoomScene } from '../room/Scene'
import { Panel } from './Panel'

const lines = ['2:17 AM', 'Nagpur is asleep.', 'The room was not expecting you.']

export default function RoomPage() {
  const [booting, setBooting] = useState(true)
  const [line, setLine] = useState(0)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [noteText, setNoteText] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [projectIndex, setProjectIndex] = useState(0)
  const [notes, setNotes] = useState<Note[]>(roomNotes)
  const [composer, setComposer] = useState(false)
  const [draft, setDraft] = useState('')
  const [soundOn, setSoundOn] = useState(false)
  const [card, setCard] = useState<string | null>(null)
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setBooting(false)
      return
    }
    const timers = [
      window.setTimeout(() => setLine(1), 1400),
      window.setTimeout(() => setLine(2), 2800),
      window.setTimeout(() => setBooting(false), 4600),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [])

  useEffect(() => {
    const canvas = document.createElement('canvas')
    setWebgl(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')))
    const local = loadVisitorNotes()
    setNotes([...roomNotes, ...local])
    void pullRemoteNotes().then((remote) => {
      if (remote.length) setNotes([...roomNotes, ...remote, ...local])
    })
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelection(null)
        setComposer(false)
        setCard(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const project = projects[projectIndex] ?? projects[0]

  function pick(id: string) {
    if (id === 'write') {
      setComposer(true)
      setSelection(null)
      return
    }
    if (id.startsWith('note:')) {
      setSelection('note')
      setNoteText(id.slice(5))
      return
    }
    const next = id as Selection
    setSelection(next)
    setNoteText(null)
  }

  function leaveNote() {
    const text = draft.trim()
    if (text.length < 2) return
    const local = rememberNote(text)
    setNotes([...roomNotes, ...local])
    void pushRemoteNote(text)
    setDraft('')
    setComposer(false)
    setCard(drawNoteCard(text))
    setSelection('note')
    setNoteText(text)
  }

  function toggleSound() {
    const next = !soundOn
    setSoundOn(setRoomSound(next))
  }

  return (
    <main className="stage">
      <div className="canvas-wrap" aria-hidden={!webgl}>
        {webgl && (
          <RoomScene
            entered={!booting}
            laptopTitle={project?.name ?? 'VibePulse'}
            laptopStack={project?.stack ?? ''}
            notes={notes}
            onPick={pick}
            onHover={setHover}
            onMiss={() => setSelection(null)}
          />
        )}
      </div>

      <div className="grain" />

      <header className="hud top">
        <div>
          <p className="mark">{profile.name}</p>
          <p className="quiet">A room in {profile.location}</p>
        </div>
        <div className="hud-actions">
          <button type="button" onClick={toggleSound}>
            {soundOn ? 'Sound on' : 'Sound off'}
          </button>
          <Link to="/plain">Read it straight</Link>
        </div>
      </header>

      {hover && <p className="hover-label">{hoverLabel(hover)}</p>}

      <Panel
        onWrite={() => {
          setSelection(null)
          setComposer(true)
        }}
        selection={selection}
        noteText={noteText}
        projectIndex={projectIndex}
        onProject={setProjectIndex}
        onClose={() => setSelection(null)}
      />

      {composer && (
        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault()
            leaveNote()
          }}
        >
          <p className="kicker">The next person will find this</p>
          <textarea
            value={draft}
            maxLength={140}
            placeholder="One sentence. Keep it kind."
            onChange={(event) => setDraft(event.target.value)}
            autoFocus
          />
          <div className="composer-actions">
            <button type="button" className="text-button" onClick={() => setComposer(false)}>
              Cancel
            </button>
            <button type="submit" className="action" disabled={draft.trim().length < 2}>
              Stick it to the wall
            </button>
          </div>
        </form>
      )}

      {card && (
        <div className="share">
          <img src={card} alt="A card that says you were in Sanket's room" />
          <div className="composer-actions">
            <a className="action" href={card} download="sanket-room.png">
              Save the card
            </a>
            <button type="button" className="text-button" onClick={() => setCard(null)}>
              Back to the room
            </button>
          </div>
        </div>
      )}

      {!webgl && (
        <section className="fallback">
          <h1>This browser cannot open the room.</h1>
          <p>The work is still here, on the plain page.</p>
          <Link className="action" to="/plain">
            Read it straight
          </Link>
        </section>
      )}

      <div className={booting ? 'boot' : 'boot out'} aria-hidden={!booting}>
        <p>{lines[line]}</p>
      </div>
    </main>
  )
}

function hoverLabel(hover: string): string {
  if (hover === 'write' || hover.startsWith('note')) return 'Note'
  const names: Record<string, string> = {
    monitor: 'Monitor',
    laptop: 'Laptop',
    notebook: 'Notebook',
    phone: 'Phone',
    board: 'Board',
    window: 'Window',
    paper: 'Paper',
    mug: 'Mug',
    lamp: 'Lamp',
  }
  return names[hover] ?? ''
}
