import { useEffect, useState } from 'react'
import { createResource, deleteResource, fetchFromUrl, updateResource } from '../api.js'
import EntryModal from './EntryModal.jsx'

const LEADERBOARD_API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const loadLeaderboard = () => fetchFromUrl(LEADERBOARD_API_URL).then(setEntries).catch(() => setError('Leaderboard is unavailable right now.'))
  useEffect(() => {
    const controller = new AbortController()
    fetchFromUrl(LEADERBOARD_API_URL, controller.signal).then(setEntries).catch((reason) => { if (reason.name !== 'AbortError') setError('Leaderboard is unavailable right now.') })
    return () => controller.abort()
  }, [])
  const leaderboardFields = [{ name: 'user', label: 'User ID', placeholder: 'MongoDB user ID' }, { name: 'rank', label: 'Rank', type: 'number' }, { name: 'points', label: 'Points', type: 'number' }, { name: 'streakDays', label: 'Streak days', type: 'number' }]
  async function removeEntry(id) { if (window.confirm('Delete this leaderboard entry?')) { await deleteResource(`${LEADERBOARD_API_URL}${id}`); await loadLeaderboard() } }
  return <section className="resource-page"><div className="resource-heading"><div><p className="eyebrow">COMPETITION / THIS WEEK</p><h1>Leaderboard</h1></div><button className="btn btn-dark rounded-0" onClick={() => { setEditingEntry(null); setShowModal(true) }} type="button">+ Add ranking</button></div><p className="page-description">A little friendly pressure, measured in points.</p>{error && <p className="error-state">{error}</p>}<div className="rank-list">{entries.map((entry) => <article className="rank-row" key={entry._id}><span className="rank-number">{String(entry.rank).padStart(2, '0')}</span><strong>{entry.user?.name ?? 'Member'}</strong><span>{entry.streakDays} day streak</span><b>{entry.points.toLocaleString()} pts</b><div className="row-actions"><button onClick={() => { setEditingEntry(entry); setShowModal(true) }} type="button">Edit</button><button onClick={() => removeEntry(entry._id)} type="button">Delete</button></div></article>)}</div>{!error && entries.length === 0 && <p className="empty-state">No leaderboard entries yet.</p>}{showModal && <EntryModal fields={leaderboardFields} initialValues={editingEntry && { user: editingEntry.user?._id ?? editingEntry.user, rank: editingEntry.rank, points: editingEntry.points, streakDays: editingEntry.streakDays }} onClose={() => setShowModal(false)} onSubmit={async (values) => { const payload = { ...values, rank: Number(values.rank), points: Number(values.points), streakDays: Number(values.streakDays) }; await (editingEntry ? updateResource(`${LEADERBOARD_API_URL}${editingEntry._id}`, payload) : createResource(LEADERBOARD_API_URL, payload)); await loadLeaderboard() }} title={editingEntry ? 'Edit leaderboard entry' : 'Add leaderboard entry'} />}</section>
}

export default Leaderboard