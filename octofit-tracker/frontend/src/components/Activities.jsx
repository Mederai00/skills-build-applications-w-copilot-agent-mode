import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetchCollection('activities', controller.signal).then(setActivities).catch((reason) => { if (reason.name !== 'AbortError') setError('Activities are unavailable right now.') })
    return () => controller.abort()
  }, [])
  return <ResourcePage eyebrow="ACTIVITY LOG" title="Recent movement" description="Every session adds a little more momentum.">
    {error ? <ErrorMessage message={error} /> : <div className="resource-list">{activities.map((activity) => <article className="resource-row" key={activity._id}><div><strong>{activity.type}</strong><span>{activity.user?.name ?? 'Member'} / {activity.durationMinutes} min</span></div><b>{activity.points} pts</b></article>)}</div>}
    {!error && activities.length === 0 && <EmptyState label="No activities recorded yet." />}
  </ResourcePage>
}

function ResourcePage({ children, description, eyebrow, title }) { return <section className="resource-page"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p>{children}</section> }
function EmptyState({ label }) { return <p className="empty-state">{label}</p> }
function ErrorMessage({ message }) { return <p className="error-state">{message}</p> }

export default Activities