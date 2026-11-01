import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Brand from './Brand.jsx'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: '⌂' },
  { to: '/groups', label: 'My groups', icon: '♧' },
  { to: '/group-map', label: 'Group map', icon: '⌖' },
  { to: '/nearby', label: 'Nearby', icon: '◎' },
  { to: '/safety', label: 'Safety center', icon: '✳' },
]

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const doLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-slate-100 bg-white px-5 py-7 lg:flex">
        <Brand />
        <p className="mb-3 mt-12 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand/10 text-brand' : 'text-slate-500 hover:bg-slate-50 hover:text-ink'}`}>
              <span className="w-5 text-center text-lg leading-none">{item.icon}</span>{item.label}
              {item.to === '/group-map' && <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#f6f5ff] p-4">
          <div className="mb-2 grid h-9 w-9 place-items-center rounded-xl bg-white text-brand shadow-sm">✦</div>
          <p className="text-sm font-bold text-ink">Feel safer together</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Your location is only shared with people you trust.</p>
          <NavLink to="/safety" className="mt-3 inline-flex text-xs font-bold text-brand">Explore safety tools <span className="ml-1">→</span></NavLink>
        </div>
        <button onClick={doLogout} className="mt-5 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50">
          <span className="text-lg">↪</span> Sign out
        </button>
      </aside>
      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div className="lg:hidden"><Brand /></div>
          <div className="hidden items-center gap-2 text-sm text-slate-400 lg:flex"><span>Workspace</span><span>/</span><span className="font-semibold text-ink">Your circle</span></div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Demo data only</span>
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-50" aria-label="Open account menu">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e8e6ff] text-xs font-bold text-brand">{user?.name?.slice(0, 2).toUpperCase() || 'MP'}</span>
              <span className="hidden text-sm font-semibold sm:block">{user?.name || 'Maya'}</span>
              <span className="text-xs text-slate-400">⌄</span>
            </button>
            {menuOpen && <button onClick={doLogout} className="absolute right-5 top-[62px] rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold shadow-soft">Sign out</button>}
          </div>
        </header>
        <nav className="sticky top-[72px] z-10 flex gap-1 overflow-x-auto border-b border-slate-100 bg-white px-4 py-2 lg:hidden">
          {navItems.map(item => <NavLink key={item.to} to={item.to} className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${isActive ? 'bg-brand/10 text-brand' : 'text-slate-500'}`}>{item.label}</NavLink>)}
        </nav>
        <main className="mx-auto max-w-[1440px] p-5 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
