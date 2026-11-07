import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { PlainPage } from './ui/PlainPage'

const RoomPage = lazy(() => import('./ui/RoomPage'))

export default function App() {
  return (
    <Suspense fallback={<div className="boot">Opening the door…</div>}>
      <Routes>
        <Route path="/" element={<RoomPage />} />
        <Route path="/plain" element={<PlainPage />} />
      </Routes>
    </Suspense>
  )
}
