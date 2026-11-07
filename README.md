# The room

Sanket Kurve’s portfolio is one room at 2:17am in Nagpur. The monitor is CrisisForge. The laptop is the other builds. The phone is how to reach him. The paper on the floor is the resume for someone who will not play.

## Run

```bash
npm install
npm run dev
```

Open the room at `/`. The same story, as a page, is at `/plain`.

## Notes on the wall

Notes you leave are kept in this browser. To share them with the next visitor, point `VITE_NOTES_URL` at an endpoint that accepts `GET` (returns `{ "notes": [...] }`) and `POST` `{ "text" }`. A Supabase table for that is in `supabase/notes.sql`.

Sound stays off until you turn it on. The rain and the fan are generated in the browser, so there is no audio file to download.
