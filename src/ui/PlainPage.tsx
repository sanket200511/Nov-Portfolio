import { Link } from 'react-router-dom'
import { crisisForge, experience, marks, profile, projects, skills } from '../content/profile'

export function PlainPage() {
  return (
    <article className="plain">
      <header className="plain-hero">
        <p className="kicker">Nagpur · 2:17 is a room, this is the page</p>
        <h1>{profile.name}</h1>
        <p className="lead">
          {profile.role}. Python, FastAPI, PostgreSQL, and the pipelines around them. {profile.summary}
        </p>
        <div className="plain-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.phoneHref}>{profile.phone}</a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <Link to="/">Enter the room</Link>
        </div>
      </header>

      <section>
        <h2>Now</h2>
        {experience.map((item) => (
          <div key={item.title} className="block">
            <p className="meta">{item.when}</p>
            <h3>
              {item.title} · {item.place}
            </h3>
            <p>{item.detail}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Selected work</h2>
        <div className="block">
          <p className="meta">{crisisForge.role}</p>
          <h3>{crisisForge.name}</h3>
          <p>{crisisForge.summary}</p>
          <a href={crisisForge.href} target="_blank" rel="noreferrer">
            {crisisForge.href.replace('https://github.com/', '')}
          </a>
        </div>
        {projects.map((project) => (
          <div key={project.name} className="block">
            <p className="meta">
              {project.role} · {project.stack}
            </p>
            <h3>{project.name}</h3>
            <p>{project.summary}</p>
            <a href={project.href} target="_blank" rel="noreferrer">
              {project.href.replace('https://github.com/', '')}
            </a>
          </div>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        <div className="block">
          <p className="meta">{profile.years}</p>
          <h3>{profile.degree}</h3>
          <p>
            {profile.college}. CGPA {profile.cgpa}.
          </p>
        </div>
      </section>

      <section>
        <h2>Skills</h2>
        <ul className="skills">
          {skills.map((skill) => (
            <li key={skill.label}>
              <strong>{skill.label}</strong>
              <span>{skill.items}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Marks</h2>
        <ul className="marks">
          {marks.map((mark) => (
            <li key={mark}>{mark}</li>
          ))}
        </ul>
      </section>
    </article>
  )
}
