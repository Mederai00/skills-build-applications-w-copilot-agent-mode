import { useEffect, useState } from 'react'
import { fetchFromUrl } from '../api.js'

const WORKOUTS_API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetchFromUrl(WORKOUTS_API_URL, controller.signal).then(setWorkouts).catch((reason) => { if (reason.name !== 'AbortError') setError('Workouts are unavailable right now.') })
    return () => controller.abort()
  }, [])
  return <section className="resource-page"><p className="eyebrow">LIBRARY / RECOMMENDED</p><h1>Find your next workout</h1><p className="page-description">Short, focused sessions for wherever your energy is today.</p>{error && <p className="error-state">{error}</p>}<div className="workout-grid">{workouts.map((workout) => <article className="workout-card" key={workout._id}><div className="workout-top"><span>{workout.difficulty}</span><small>{workout.durationMinutes} MIN</small></div><h2>{workout.title}</h2><p>{workout.description}</p><div className="tag-list">{workout.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>{!error && workouts.length === 0 && <p className="empty-state">No workouts yet.</p>}</section>
}

export default Workouts