import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { clearAuth, currentAuth, login } from './api.js'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

const navigation = [
  { label: 'Overview', path: '/' },
  { label: 'Activities', path: '/activities' },
  { label: 'Teams', path: '/teams' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Workouts', path: '/workouts' },
  { label: 'Members', path: '/users' },
]

function Overview() {
  return <section className="overview-grid">
    <div className="intro-panel">
      <p className="eyebrow">OCTOFIT TRACKER / DAILY PULSE</p>
      <h1>Train with your team. Stay in motion.</h1>
      <p className="lead-copy">One clear view of your movement, your people, and the next small win.</p>
      <NavLink className="btn btn-dark rounded-0 px-4" to="/activities">Log activity</NavLink>
    </div>
    <div className="signal-panel">
      <span className="signal-label">TODAY&apos;S SIGNAL</span>
      <strong>Move together</strong>
      <p>Review the leaderboard, find a workout, and keep the streak alive.</p>
      <div className="signal-line"><span /></div>
      <small>API connected through the configured Codespace</small>
    </div>
  </section>
}

function App() {
  const [auth, setAuth] = useState(currentAuth)
  const [showLogin, setShowLogin] = useState(false)
  useEffect(() => { const sync = () => setAuth(currentAuth()); window.addEventListener('octofit-auth-change', sync); return () => window.removeEventListener('octofit-auth-change', sync) }, [])
  return <div className="app-shell">
    <header className="topbar">
      <NavLink className="brand" to="/"><span className="brand-mark">O</span><span>OctoFit</span></NavLink>
      <nav className="main-nav" aria-label="Primary navigation">
        {navigation.map((item) => <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end={item.path === '/'} key={item.path} to={item.path}>{item.label}</NavLink>)}
      </nav>
      {auth ? <div className="auth-controls"><span className="status-chip"><span /> {auth.user.name} / {auth.user.role}</span><button className="auth-button" onClick={() => clearAuth()} type="button">Sign out</button></div> : <button className="auth-button" onClick={() => setShowLogin(true)} type="button">Sign in</button>}
    </header>
    <main className="page-content">
      <Routes>
        <Route element={<Overview />} path="/" />
        <Route element={<Activities />} path="/activities" />
        <Route element={<Teams />} path="/teams" />
        <Route element={<Leaderboard />} path="/leaderboard" />
        <Route element={<Workouts />} path="/workouts" />
        <Route element={<Users />} path="/users" />
      </Routes>
    </main>
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
  </div>
}

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('maya.chen@example.com')
  const [password, setPassword] = useState('octofit123')
  const [error, setError] = useState('')
  async function submit(event) { event.preventDefault(); setError(''); try { await login(email, password); onClose() } catch (reason) { setError(reason.message) } }
  return <div className="modal-backdrop" role="presentation"><div className="entry-modal" role="dialog" aria-modal="true" aria-labelledby="login-title"><div className="modal-heading"><div><p className="eyebrow">ACCOUNT ACCESS</p><h2 id="login-title">Sign in to OctoFit</h2></div><button aria-label="Close login" className="modal-close" onClick={onClose} type="button">×</button></div><form onSubmit={submit}><div className="modal-fields"><label>Email<input onChange={(event) => setEmail(event.target.value)} type="email" value={email} /></label><label>Password<input onChange={(event) => setPassword(event.target.value)} type="password" value={password} /></label></div>{error && <p className="error-state">{error}</p>}<div className="modal-actions"><button className="btn btn-outline-dark rounded-0" onClick={onClose} type="button">Cancel</button><button className="btn btn-dark rounded-0" type="submit">Sign in</button></div></form></div></div>
}

export default App