import { useEffect, useState } from 'react'
import { createResource, deleteResource, fetchFromUrl, updateResource } from '../api.js'
import EntryModal from './EntryModal.jsx'

const TEAMS_API_URL = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const loadTeams = () => fetchFromUrl(TEAMS_API_URL).then(setTeams).catch(() => setError('Teams are unavailable right now.'))
  useEffect(() => {
    const controller = new AbortController()
    fetchFromUrl(TEAMS_API_URL, controller.signal).then(setTeams).catch((reason) => { if (reason.name !== 'AbortError') setError('Teams are unavailable right now.') })
    return () => controller.abort()
  }, [])
  const teamFields = [{ name: 'name', label: 'Team name', placeholder: 'Peak Performers' }, { name: 'motto', label: 'Team motto', placeholder: 'Small steps, strong finish.' }, { name: 'members', label: 'Member IDs', placeholder: 'Comma-separated MongoDB user IDs' }, { name: 'totalPoints', label: 'Starting points', type: 'number', defaultValue: '0' }]
  async function removeTeam(id) { if (window.confirm('Delete this team?')) { await deleteResource(`${TEAMS_API_URL}${id}`); await loadTeams() } }
  return <section className="resource-page"><div className="resource-heading"><div><p className="eyebrow">SQUADS / COLLECTIVE ENERGY</p><h1>Your teams</h1></div><button className="btn btn-dark rounded-0" onClick={() => { setEditingTeam(null); setShowModal(true) }} type="button">+ Add team</button></div><p className="page-description">Progress is more fun when the group chat is cheering.</p>{error && <p className="error-state">{error}</p>}<div className="team-grid">{teams.map((team) => <article className="team-card" key={team._id}><span className="card-index">TEAM</span><h2>{team.name}</h2><p>{team.motto}</p><footer><span>{team.members?.length ?? 0} members</span><b>{team.totalPoints.toLocaleString()} pts</b></footer><div className="row-actions"><button onClick={() => { setEditingTeam(team); setShowModal(true) }} type="button">Edit</button><button onClick={() => removeTeam(team._id)} type="button">Delete</button></div></article>)}</div>{!error && teams.length === 0 && <p className="empty-state">No teams yet.</p>}{showModal && <EntryModal fields={teamFields} initialValues={editingTeam && { name: editingTeam.name, motto: editingTeam.motto, members: editingTeam.members?.map((member) => member._id ?? member).join(','), totalPoints: editingTeam.totalPoints }} onClose={() => setShowModal(false)} onSubmit={async (values) => { const payload = { ...values, members: values.members.split(',').map((member) => member.trim()).filter(Boolean), totalPoints: Number(values.totalPoints) }; await (editingTeam ? updateResource(`${TEAMS_API_URL}${editingTeam._id}`, payload) : createResource(TEAMS_API_URL, payload)); await loadTeams() }} title={editingTeam ? 'Edit team' : 'Create a team'} />}</section>
}

export default Teams