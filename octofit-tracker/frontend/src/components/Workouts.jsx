import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetchCollection('workouts', controller.signal).then(setWorkouts).catch((reason) => { if (reason.name !== 'AbortError') setError('Workouts are unavailable right now.') })
    return () => controller.abort()
  }, [])
  return <section className="resource-page"><p className="eyebrow">LIBRARY / RECOMMENDED</p><h1>Find your next workout</h1><p className="page-description">Short, focused sessions for wherever your energy is today.</p>{error && <p className="error-state">{error}</p>}<div className="workout-grid">{workouts.map((workout) => <article className="workout-card" key={workout._id}><div className="workout-top"><span>{workout.difficulty}</span><small>{workout.durationMinutes} MIN</small></div><h2>{workout.title}</h2><p>{workout.description}</p><div className="tag-list">{workout.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div>{!error && workouts.length === 0 && <p className="empty-state">No workouts yet.</p>}</section>
}

export default Workouts