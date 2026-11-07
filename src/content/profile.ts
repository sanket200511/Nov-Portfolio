export const profile = {
  name: 'Sanket Kurve',
  role: 'Trainee engineer',
  location: 'Nagpur, Maharashtra',
  email: 'sanketkurve.2005@gmail.com',
  phone: '+91 87998 39743',
  phoneHref: 'tel:+918799839743',
  github: 'https://github.com/sanket200511',
  linkedin: 'https://www.linkedin.com/in/sanket-kurve-03a8b3196',
  college: 'S.B. Jain Institute of Technology, Management & Research',
  degree: 'B.Tech, Computer Science and Engineering',
  years: '2023 – 2027',
  cgpa: '8.06 / 10',
  summary:
    'Software engineer building Python ETL, FastAPI services, and PostgreSQL-backed tools. The part he cares about is the unglamorous one: validation, tests, and systems that still tell the truth when the input is messy.',
}

export type Project = {
  name: string
  href: string
  stack: string
  role: string
  summary: string
}

export const crisisForge: Project = {
  name: 'CrisisForge AI',
  href: 'https://github.com/sanket200511/CrisisForge-AI',
  stack: 'Python · FastAPI · React · scikit-learn',
  role: 'Prototype',
  summary:
    'A decision-support prototype for an 8-hospital network in Nagpur. It forecasts arrivals, compares triage strategies, and suggests transfers before the crowded rooms run out of beds. Evaluated on synthetic data. It does not make clinical decisions by itself.',
}

export const projects: Project[] = [
  {
    name: 'VibePulse',
    href: 'https://github.com/sanket200511/VibePulse',
    stack: 'React · FastAPI',
    role: 'Engineering intelligence',
    summary:
      'A local-first platform for watching what a codebase is actually doing. Events in, a careful investigation out. The rule on the tin is the right one: observe first, never invent. On the resume this is dashboard integration, event contracts, and documentation.',
  },
  {
    name: 'Nyay AI',
    href: 'https://github.com/sanket200511/Nyay-AI',
    stack: 'TypeScript',
    role: 'Legal guidance prototype',
    summary:
      'A prototype for making the Indian legal process legible: rights, drafted notices, case tracking, and a path toward a lawyer. The aim is access. It is not a law firm.',
  },
  {
    name: 'CityWatch',
    href: 'https://github.com/sanket200511/CityWatch',
    stack: 'React · Python · YOLOv8',
    role: 'Safety prototype',
    summary:
      'A women’s safety prototype for Nagpur. Threat detection on camera feeds, Telegram alerts, and a SafeRoute map of safer and less safe zones. Built to shorten the time between an incident and a person who can help.',
  },
  {
    name: 'SMRES',
    href: 'https://github.com/sanket200511/SMRES',
    stack: 'FastAPI · React · PostgreSQL',
    role: 'Integration lead',
    summary:
      'Facility maintenance that scores a ticket in the open — safety, impact, people affected, time — and escalates life-safety words on their own. Four people built it. Sanket led integration, the test pipeline, and the demo.',
  },
  {
    name: 'ShieldCall AI',
    href: 'https://github.com/sanket200511/ShieldCall-AI',
    stack: 'React · FastAPI · Kotlin',
    role: 'Hackathon',
    summary:
      'Real-time scam detection for calls and messages, aimed at people who get talked out of their savings. A Byte Quest build with a family dashboard. It was a local demo, not a shipped app.',
  },
  {
    name: 'Transfer value',
    href: 'https://github.com/sanket200511/Dynamic-Football-Player-Transfer-Value-Prediction',
    stack: 'Python · machine learning',
    role: 'Infosys Springboard',
    summary:
      'A football transfer-value model. Performance, market history, and social sentiment cleaned into one dataset, then used to estimate what a player might be worth. Virtual internship, October to December 2025.',
  },
  {
    name: 'Medical diagnosis',
    href: 'https://github.com/sanket200511/Implementation-of-AI-Powered-Medical-Diagnosis-System',
    stack: 'Python · Streamlit · scikit-learn',
    role: 'Internship project',
    summary:
      'A symptom checker from an AICTE TechSaksham internship. Classical models return a probability, and the page explains itself with charts. A learning project, not a device a clinic should trust.',
  },
]

export const experience = [
  {
    when: 'Mar 2026 — present',
    title: 'Trainee engineer',
    place: 'ArithWise Solutions, Nagpur',
    detail:
      'Promoted from software engineering intern. Python ETL connectors, SQL editor and query APIs, PostgreSQL, contributions to Spark and PySpark jobs, data-quality checks, Pytest, and GitHub Actions. Also AI-enabled analytics inside the existing platform.',
  },
  {
    when: 'Oct 2025 — Dec 2025',
    title: 'Virtual intern',
    place: 'Infosys Springboard',
    detail:
      'Built a football player transfer-value project from performance data, and tried social-media sentiment as one more signal. The work was the pipeline as much as the model.',
  },
]

export const skills = [
  { label: 'Languages', items: 'Python, SQL, JavaScript' },
  { label: 'Backend', items: 'FastAPI, REST, JSON, PostgreSQL' },
  { label: 'Data', items: 'ETL, validation, Spark / PySpark' },
  { label: 'Practice', items: 'Pytest, GitHub Actions, Git, Redis, Celery' },
  { label: 'Also', items: 'React, Docker, GCP fundamentals' },
]

export const marks = [
  'First prize — HackInverse',
  'Top 10 — HackNagpur 2.0',
  'Google Cloud Arcade Champion and Legend',
  'Meta Back-End Developer',
  'Meta Front-End Developer',
  'Python for Everybody',
  'Google AI Essentials',
]

export type Selection =
  | 'monitor'
  | 'laptop'
  | 'notebook'
  | 'phone'
  | 'board'
  | 'window'
  | 'paper'
  | 'mug'
  | 'lamp'
  | 'note'

export const shelf: { id: Exclude<Selection, 'note' | 'mug' | 'lamp'>; label: string }[] = [
  { id: 'monitor', label: 'Monitor' },
  { id: 'laptop', label: 'Laptop' },
  { id: 'notebook', label: 'Notebook' },
  { id: 'phone', label: 'Phone' },
  { id: 'board', label: 'Board' },
  { id: 'window', label: 'Window' },
  { id: 'paper', label: 'Paper' },
]
