import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { people } from '../data/mockData.js'
import Avatar from '../components/Avatar.jsx'
import GroupMap from '../components/GroupMap.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'

function Metric({ label, value, hint, icon, color }) {
  return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-xs font-semibold text-slate-500">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl ${color}`}>{icon}</span></div><p className="mt-4 font-display text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs text-slate-400">{hint}</p></div>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [groupsLoading, setGroupsLoading] = useState(true)
  const [groupsError, setGroupsError] = useState('')

  useEffect(() => {
    let active = true
    api.get('/groups')
      .then(response => { if (active) setGroups(response.data.groups) })
      .catch(error => {
        if (active) setGroupsError(error.response?.data?.error || 'Could not load your groups.')
      })
      .finally(() => { if (active) setGroupsLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">Monday, October 26</p><h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">Good to see you, {user?.name?.split(' ')[0] || 'Maya'} <span>✦</span></h1><p className="mt-2 text-sm text-slate-500">Your circle is looking good today.</p></div><Link to="/group-map" className="rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20">Open group map <span className="ml-2">↗</span></Link></div>
      <div role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Location pins, people, and safety stats on this dashboard are sample data—not live tracking. TrackAI is not sharing anyone’s location.</div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="People in your circle" value="4 people" hint="Everyone's sharing today" icon="♧" color="bg-violet-50 text-brand" /><Metric label="Sharing location" value="3 online" hint="Updated just now" icon="⌖" color="bg-emerald-50 text-emerald-600" /><Metric label="Places saved" value="6 places" hint="Home, work & more" icon="♡" color="bg-orange-50 text-orange-500" /><Metric label="Your safety status" value="All good" hint="Your circle is safe" icon="✓" color="bg-sky-50 text-sky-600" /></div>
      <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="flex items-center justify-between px-5 py-4"><div><h2 className="font-display font-bold">Your circle, on the map</h2><p className="mt-1 text-xs text-slate-400">A little closer, wherever they are</p></div><Link to="/group-map" className="text-xs font-bold text-brand">Full map →</Link></div><div className="px-3 pb-3"><GroupMap people={people} height="320px" /></div></section>
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-display font-bold">Your groups</h2><p className="mt-1 text-xs text-slate-400">Saved to your account</p></div><Link to="/groups" className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 font-bold text-brand" aria-label="Create a group">+</Link></div><div className="mt-5 space-y-3">{groupsLoading ? <p className="text-sm text-slate-500">Loading groups…</p> : groupsError ? <p role="alert" className="text-sm text-rose-600">{groupsError}</p> : groups.length ? groups.map(group => <Link to="/groups" key={group.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-brand/20 hover:bg-violet-50/30"><span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: group.color }}>⌘</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{group.name}</p><p className="mt-1 text-xs text-slate-400">{group.members} {group.members === 1 ? 'member' : 'members'} · You are {group.role.toLowerCase()}</p></div><span className="text-slate-300">→</span></Link>) : <p className="text-sm text-slate-500">No groups yet. Create your first group below.</p>}</div><Link to="/groups" className="mt-4 block w-full rounded-xl border border-dashed border-slate-200 py-3 text-center text-xs font-bold text-slate-500 hover:border-brand hover:text-brand">+ Manage groups</Link></section>
      </div>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-display font-bold">Your people</h2><p className="mt-1 text-xs text-slate-400">Everyone's just a tap away</p></div><Link to="/nearby" className="text-xs font-bold text-brand">See all →</Link></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{people.map(person => <div key={person.id} className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3"><Avatar person={person} /><div className="min-w-0"><p className="truncate text-sm font-bold">{person.name}</p><p className="truncate text-xs text-slate-400">{person.place}</p></div><span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" /></div>)}</div></section>
    </div>
  )
}
