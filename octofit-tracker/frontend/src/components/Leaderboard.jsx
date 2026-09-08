import { useEffect, useState } from 'react'
import { fetchFromUrl } from '../api.js'

const LEADERBOARD_API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetchFromUrl(LEADERBOARD_API_URL, controller.signal).then(setEntries).catch((reason) => { if (reason.name !== 'AbortError') setError('Leaderboard is unavailable right now.') })
    return () => controller.abort()
  }, [])
  return <section className="resource-page"><p className="eyebrow">COMPETITION / THIS WEEK</p><h1>Leaderboard</h1><p className="page-description">A little friendly pressure, measured in points.</p>{error && <p className="error-state">{error}</p>}<div className="rank-list">{entries.map((entry) => <article className="rank-row" key={entry._id}><span className="rank-number">{String(entry.rank).padStart(2, '0')}</span><strong>{entry.user?.name ?? 'Member'}</strong><span>{entry.streakDays} day streak</span><b>{entry.points.toLocaleString()} pts</b></article>)}</div>{!error && entries.length === 0 && <p className="empty-state">No leaderboard entries yet.</p>}</section>
}

export default Leaderboard