import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetchCollection('teams', controller.signal).then(setTeams).catch((reason) => { if (reason.name !== 'AbortError') setError('Teams are unavailable right now.') })
    return () => controller.abort()
  }, [])
  return <section className="resource-page"><p className="eyebrow">SQUADS / COLLECTIVE ENERGY</p><h1>Your teams</h1><p className="page-description">Progress is more fun when the group chat is cheering.</p>{error && <p className="error-state">{error}</p>}<div className="team-grid">{teams.map((team) => <article className="team-card" key={team._id}><span className="card-index">TEAM</span><h2>{team.name}</h2><p>{team.motto}</p><footer><span>{team.members?.length ?? 0} members</span><b>{team.totalPoints.toLocaleString()} pts</b></footer></article>)}</div>{!error && teams.length === 0 && <p className="empty-state">No teams yet.</p>}</section>
}

export default Teams