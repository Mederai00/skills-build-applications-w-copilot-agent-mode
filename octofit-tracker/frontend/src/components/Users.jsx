import { useEffect, useState } from 'react'
import { fetchFromUrl } from '../api.js'

const USERS_API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetchFromUrl(USERS_API_URL, controller.signal).then(setUsers).catch((reason) => { if (reason.name !== 'AbortError') setError('Members are unavailable right now.') })
    return () => controller.abort()
  }, [])
  return <section className="resource-page"><p className="eyebrow">COMMUNITY / MEMBERS</p><h1>People in motion</h1><p className="page-description">Meet the people making consistency look contagious.</p>{error && <p className="error-state">{error}</p>}<div className="member-list">{users.map((user) => <article className="member-row" key={user._id}><span className="avatar">{user.avatar ?? user.name?.slice(0, 2).toUpperCase()}</span><div><strong>{user.name}</strong><span>{user.email}</span></div><b>{user.totalPoints.toLocaleString()} pts</b></article>)}</div>{!error && users.length === 0 && <p className="empty-state">No members yet.</p>}</section>
}

export default Users