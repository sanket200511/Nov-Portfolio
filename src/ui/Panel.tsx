import { Link } from 'react-router-dom'
import {
  crisisForge,
  experience,
  marks,
  profile,
  projects,
  skills,
  type Selection,
} from '../content/profile'

type PanelProps = {
  selection: Selection | null
  noteText: string | null
  projectIndex: number
  onProject: (index: number) => void
  onClose: () => void
  onWrite: () => void
}

const titles: Record<Selection, string> = {
  monitor: 'The bright screen',
  laptop: 'Other builds',
  notebook: 'Who he is',
  phone: 'How to reach him',
  board: 'How he builds',
  window: 'The years outside',
  paper: 'For people in a hurry',
  mug: 'The empty cup',
  lamp: 'The only warm light',
  note: 'Left on the wall',
}

export function Panel({ selection, noteText, projectIndex, onProject, onClose, onWrite }: PanelProps) {
  if (!selection) return null
  const project = projects[projectIndex] ?? projects[0]

  return (
    <aside className="panel" role="dialog" aria-label={titles[selection]}>
      <header className="panel-head">
        <p className="kicker">{labelFor(selection)}</p>
        <button type="button" className="text-button" onClick={onClose}>
          Close
        </button>
      </header>
      <h2>{titles[selection]}</h2>

      {selection === 'monitor' && (
        <>
          <p className="lead">{crisisForge.summary}</p>
          <p className="meta">{crisisForge.stack}</p>
          <a className="action" href={crisisForge.href} target="_blank" rel="noreferrer">
            Open CrisisForge on GitHub
          </a>
        </>
      )}

      {selection === 'laptop' && project && (
        <>
          <div className="pager">
            <button type="button" onClick={() => onProject((projectIndex + projects.length - 1) % projects.length)}>
              Previous
            </button>
            <span>
              {projectIndex + 1} / {projects.length}
            </span>
            <button type="button" onClick={() => onProject((projectIndex + 1) % projects.length)}>
              Next
            </button>
          </div>
          <h3>{project.name}</h3>
          <p className="meta">
            {project.role} · {project.stack}
          </p>
          <p className="lead">{project.summary}</p>
          <a className="action" href={project.href} target="_blank" rel="noreferrer">
            View the repository
          </a>
        </>
      )}

      {selection === 'notebook' && (
        <>
          <p className="lead">{profile.summary}</p>
          <p>
            {profile.degree} at {profile.college}. {profile.years}. CGPA {profile.cgpa}. He works in {profile.location}.
          </p>
        </>
      )}

      {selection === 'phone' && (
        <ul className="links">
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <a href={profile.phoneHref}>{profile.phone}</a>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub · sanket200511
            </a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      )}

      {selection === 'board' && (
        <>
          <ul className="skills">
            {skills.map((skill) => (
              <li key={skill.label}>
                <strong>{skill.label}</strong>
                <span>{skill.items}</span>
              </li>
            ))}
          </ul>
          <ul className="marks">
            {marks.map((mark) => (
              <li key={mark}>{mark}</li>
            ))}
          </ul>
        </>
      )}

      {selection === 'window' && (
        <ol className="timeline">
          <li>
            <p className="meta">{profile.years}</p>
            <h3>{profile.degree}</h3>
            <p>
              {profile.college}, Nagpur. CGPA {profile.cgpa}.
            </p>
          </li>
          {experience.map((item) => (
            <li key={item.title}>
              <p className="meta">{item.when}</p>
              <h3>
                {item.title}, {item.place}
              </h3>
              <p>{item.detail}</p>
            </li>
          ))}
        </ol>
      )}

      {selection === 'paper' && (
        <>
          <p className="lead">
            {profile.name}. {profile.role} at ArithWise. {profile.location}. The same story, without the room.
          </p>
          <Link className="action" to="/plain">
            Read the plain page
          </Link>
        </>
      )}

      {selection === 'mug' && (
        <p className="lead">
          The cup is empty. The build is not. Trainee engineer at ArithWise, and the hours in this room are where the
          pipelines get honest.
        </p>
      )}

      {selection === 'lamp' && (
        <p className="lead">Warm light, cold logs. If you only have a minute, the paper on the floor is the resume.</p>
      )}

      {selection === 'note' && (
        <>
          <p className="lead">{noteText}</p>
          <button type="button" className="action" onClick={onWrite}>
            Leave your own
          </button>
        </>
      )}
    </aside>
  )
}

function labelFor(selection: Selection): string {
  if (selection === 'monitor') return crisisForge.name
  if (selection === 'note') return 'A note'
  return 'In the room'
}
