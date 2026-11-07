/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOTES_URL?: string
  readonly VITE_NOTES_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
