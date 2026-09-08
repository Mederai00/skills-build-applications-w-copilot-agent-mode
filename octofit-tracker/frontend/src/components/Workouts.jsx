import { useEffect, useState } from 'react'
import { createResource, deleteResource, fetchFromUrl, updateResource } from '../api.js'
import EntryModal from './EntryModal.jsx'

const WORKOUTS_API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState(null)
  const loadWorkouts = () => fetchFromUrl(WORKOUTS_API_URL).then(setWorkouts).catch(() => setError('Workouts are unavailable right now.'))
  useEffect(() => {
    const controller = new AbortController()
    fetchFromUrl(WORKOUTS_API_URL, controller.signal).then(setWorkouts).catch((reason) => { if (reason.name !== 'AbortError') setError('Workouts are unavailable right now.') })
    return () => controller.abort()
  }, [])
  const workoutFields = [{ name: 'title', label: 'Workout title', placeholder: 'Mobility Reset' }, { name: 'description', label: 'Description', placeholder: 'A focused recovery session.' }, { name: 'difficulty', label: 'Difficulty', placeholder: 'Beginner' }, { name: 'durationMinutes', label: 'Duration (minutes)', type: 'number' }, { name: 'exercises', label: 'Exercises', placeholder: 'Comma-separated exercises' }, { name: 'tags', label: 'Tags', placeholder: 'Comma-separated tags' }]
  async function removeWorkout(id) { if (window.confirm('Delete this workout?')) { await deleteResource(`${WORKOUTS_API_URL}${id}`); await loadWorkouts() } }
  return <section className="resource-page"><div className="resource-heading"><div><p className="eyebrow">LIBRARY / RECOMMENDED</p><h1>Find your next workout</h1></div><button className="btn btn-dark rounded-0" onClick={() => { setEditingWorkout(null); setShowModal(true) }} type="button">+ Add workout</button></div><p className="page-description">Short, focused sessions for wherever your energy is today.</p>{error && <p className="error-state">{error}</p>}<div className="workout-grid">{workouts.map((workout) => <article className="workout-card" key={workout._id}><div className="workout-top"><span>{workout.difficulty}</span><small>{workout.durationMinutes} MIN</small></div><h2>{workout.title}</h2><p>{workout.description}</p><div className="tag-list">{workout.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="row-actions"><button onClick={() => { setEditingWorkout(workout); setShowModal(true) }} type="button">Edit</button><button onClick={() => removeWorkout(workout._id)} type="button">Delete</button></div></article>)}</div>{!error && workouts.length === 0 && <p className="empty-state">No workouts yet.</p>}{showModal && <EntryModal fields={workoutFields} initialValues={editingWorkout && { title: editingWorkout.title, description: editingWorkout.description, difficulty: editingWorkout.difficulty, durationMinutes: editingWorkout.durationMinutes, exercises: editingWorkout.exercises?.join(','), tags: editingWorkout.tags?.join(',') }} onClose={() => setShowModal(false)} onSubmit={async (values) => { const payload = { ...values, durationMinutes: Number(values.durationMinutes), exercises: values.exercises.split(',').map((exercise) => exercise.trim()).filter(Boolean), tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean) }; await (editingWorkout ? updateResource(`${WORKOUTS_API_URL}${editingWorkout._id}`, payload) : createResource(WORKOUTS_API_URL, payload)); await loadWorkouts() }} title={editingWorkout ? 'Edit workout' : 'Create a workout'} />}</section>
}

export default Workouts