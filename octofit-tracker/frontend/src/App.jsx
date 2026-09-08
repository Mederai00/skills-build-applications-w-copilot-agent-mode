import { NavLink, Route, Routes } from 'react-router-dom'
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
  return <div className="app-shell">
    <header className="topbar">
      <NavLink className="brand" to="/"><span className="brand-mark">O</span><span>OctoFit</span></NavLink>
      <nav className="main-nav" aria-label="Primary navigation">
        {navigation.map((item) => <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end={item.path === '/'} key={item.path} to={item.path}>{item.label}</NavLink>)}
      </nav>
      <span className="status-chip"><span /> Live workspace</span>
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
  </div>
}

export default App