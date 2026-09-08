import { useEffect, useState } from 'react'
import { createResource, deleteResource, fetchFromUrl, updateResource } from '../api.js'
import EntryModal from './EntryModal.jsx'

const USERS_API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const loadUsers = () => fetchFromUrl(USERS_API_URL).then(setUsers).catch(() => setError('Members are unavailable right now.'))
  useEffect(() => {
    const controller = new AbortController()
    fetchFromUrl(USERS_API_URL, controller.signal).then(setUsers).catch((reason) => { if (reason.name !== 'AbortError') setError('Members are unavailable right now.') })
    return () => controller.abort()
  }, [])
  const userFields = [{ name: 'name', label: 'Full name', placeholder: 'Alex Morgan' }, { name: 'email', label: 'Email', type: 'email', placeholder: 'alex@example.com' }, { name: 'avatar', label: 'Avatar initials', placeholder: 'AM', required: false }, { name: 'totalPoints', label: 'Starting points', type: 'number', defaultValue: '0' }]
  async function removeUser(id) { if (window.confirm('Delete this member?')) { await deleteResource(`${USERS_API_URL}${id}`); await loadUsers() } }
  return <section className="resource-page"><div className="resource-heading"><div><p className="eyebrow">COMMUNITY / MEMBERS</p><h1>People in motion</h1></div><button className="btn btn-dark rounded-0" onClick={() => { setEditingUser(null); setShowModal(true) }} type="button">+ Add member</button></div><p className="page-description">Meet the people making consistency look contagious.</p>{error && <p className="error-state">{error}</p>}<div className="member-list">{users.map((user) => <article className="member-row" key={user._id}><span className="avatar">{user.avatar ?? user.name?.slice(0, 2).toUpperCase()}</span><div><strong>{user.name}</strong><span>{user.email}</span></div><b>{user.totalPoints.toLocaleString()} pts</b><div className="row-actions"><button onClick={() => { setEditingUser(user); setShowModal(true) }} type="button">Edit</button><button onClick={() => removeUser(user._id)} type="button">Delete</button></div></article>)}</div>{!error && users.length === 0 && <p className="empty-state">No members yet.</p>}{showModal && <EntryModal fields={userFields} initialValues={editingUser && { name: editingUser.name, email: editingUser.email, avatar: editingUser.avatar, totalPoints: editingUser.totalPoints }} onClose={() => setShowModal(false)} onSubmit={async (values) => { const payload = { ...values, totalPoints: Number(values.totalPoints) }; await (editingUser ? updateResource(`${USERS_API_URL}${editingUser._id}`, payload) : createResource(USERS_API_URL, payload)); await loadUsers() }} title={editingUser ? 'Edit member' : 'Add a member'} />}</section>
}

export default Users