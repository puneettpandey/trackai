import { useMemo, useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import GroupMap from '../components/GroupMap.jsx'
import { groups, people } from '../data/mockData.js'
import { Link } from 'react-router-dom'

export default function GroupMapPage() {
  const [selectedId, setSelectedId] = useState(people[0].id)
  const [groupId, setGroupId] = useState('weekend')
  const [sharing, setSharing] = useState(true)
  const selected = useMemo(() => people.find(person => person.id === selectedId), [selectedId])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Demo map</p><h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">Your group map</h1><p className="mt-2 text-sm text-slate-500">Explore the sample map and interface.</p></div><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"><span className="text-sm font-semibold">Demo location toggle</span><input type="checkbox" checked={sharing} onChange={event => setSharing(event.target.checked)} className="peer sr-only" /><span className={`relative h-6 w-11 rounded-full transition ${sharing ? 'bg-brand' : 'bg-slate-300'} after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition ${sharing ? 'after:translate-x-5' : ''}`} /></label></div>
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2 overflow-x-auto">{groups.map(group => <button key={group.id} onClick={() => setGroupId(group.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${groupId === group.id ? 'bg-ink text-white' : 'border border-slate-200 bg-white text-slate-500'}`}>{group.name} <span className="ml-1 opacity-60">{group.members}</span></button>)}</div><Link to="/groups" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600">Manage groups</Link></div>
      {!sharing && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Demo toggle is paused. Location sharing is not connected to the backend.</div>}
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"><GroupMap people={people} selectedId={selectedId} onSelect={setSelectedId} height="min(65vh, 610px)" /></section>
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-display font-bold">{groups.find(group => group.id === groupId)?.name}</h2><p className="mt-1 text-xs text-slate-400">Sample members · not live</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">DEMO</span></div>
          <div className="mt-5 space-y-1">{people.map(person => <button key={person.id} onClick={() => setSelectedId(person.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedId === person.id ? 'bg-violet-50' : 'hover:bg-slate-50'}`}><Avatar person={person} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{person.name}</p><p className="mt-0.5 truncate text-xs text-slate-400">{person.place}</p><p className="mt-1 text-[10px] text-slate-400">{person.eta}</p></div><span className="h-2 w-2 rounded-full bg-emerald-400" /></button>)}</div>
          {selected && <div className="mt-4 rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2"><Avatar person={selected} size="sm" /><div><p className="text-xs font-bold">{selected.name.split(' ')[0]} is {selected.distance}</p><p className="mt-0.5 text-[10px] text-slate-400">Location updated {selected.eta}</p></div></div><button className="mt-3 w-full rounded-lg bg-white py-2.5 text-xs font-bold text-brand shadow-sm">Get directions ↗</button></div>}
        </section>
      </div>
      <p className="text-center text-[11px] text-slate-400">Map pins and location values are sample data only. Location sharing is not connected and no real location is sent.</p>
    </div>
  )
}
