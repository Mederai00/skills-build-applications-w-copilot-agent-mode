import { useEffect, useState } from 'react'
import { createResource, deleteResource, fetchFromUrl, updateResource } from '../api.js'
import EntryModal from './EntryModal.jsx'

const ACTIVITIES_API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const loadActivities = () => fetchFromUrl(ACTIVITIES_API_URL).then(setActivities).catch(() => setError('Activities are unavailable right now.'))
  useEffect(() => {
    const controller = new AbortController()
    fetchFromUrl(ACTIVITIES_API_URL, controller.signal).then(setActivities).catch((reason) => { if (reason.name !== 'AbortError') setError('Activities are unavailable right now.') })
    return () => controller.abort()
  }, [])
  const activityFields = [{ name: 'user', label: 'User ID', placeholder: 'MongoDB user ID' }, { name: 'type', label: 'Activity type', placeholder: 'Running' }, { name: 'durationMinutes', label: 'Duration (minutes)', type: 'number' }, { name: 'calories', label: 'Calories', type: 'number' }, { name: 'points', label: 'Points', type: 'number' }, { name: 'completedAt', label: 'Completed at', type: 'date' }]
  async function removeActivity(id) { if (window.confirm('Delete this activity?')) { await deleteResource(`${ACTIVITIES_API_URL}${id}`); await loadActivities() } }
  return <ResourcePage action={<button className="btn btn-dark rounded-0" onClick={() => { setEditingActivity(null); setShowModal(true) }} type="button">+ Add activity</button>} eyebrow="ACTIVITY LOG" title="Recent movement" description="Every session adds a little more momentum.">
    {error ? <ErrorMessage message={error} /> : <div className="resource-list">{activities.map((activity) => <article className="resource-row" key={activity._id}><div><strong>{activity.type}</strong><span>{activity.user?.name ?? 'Member'} / {activity.durationMinutes} min</span></div><b>{activity.points} pts</b><div className="row-actions"><button onClick={() => { setEditingActivity(activity); setShowModal(true) }} type="button">Edit</button><button onClick={() => removeActivity(activity._id)} type="button">Delete</button></div></article>)}</div>}
    {!error && activities.length === 0 && <EmptyState label="No activities recorded yet." />}
    {showModal && <EntryModal fields={activityFields} initialValues={editingActivity && { user: editingActivity.user?._id ?? editingActivity.user, type: editingActivity.type, durationMinutes: editingActivity.durationMinutes, calories: editingActivity.calories, points: editingActivity.points, completedAt: editingActivity.completedAt?.slice(0, 10) }} onClose={() => setShowModal(false)} onSubmit={async (values) => { const payload = { ...values, durationMinutes: Number(values.durationMinutes), calories: Number(values.calories), points: Number(values.points), completedAt: new Date(values.completedAt).toISOString() }; await (editingActivity ? updateResource(`${ACTIVITIES_API_URL}${editingActivity._id}`, payload) : createResource(ACTIVITIES_API_URL, payload)); await loadActivities() }} title={editingActivity ? 'Edit activity' : 'Log an activity'} />}
  </ResourcePage>
}

function ResourcePage({ action, children, description, eyebrow, title }) { return <section className="resource-page"><div className="resource-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{action}</div><p className="page-description">{description}</p>{children}</section> }
function EmptyState({ label }) { return <p className="empty-state">{label}</p> }
function ErrorMessage({ message }) { return <p className="error-state">{message}</p> }

export default Activities