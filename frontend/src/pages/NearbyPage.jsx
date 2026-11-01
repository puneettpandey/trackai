import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import { people } from '../data/mockData.js'

export default function NearbyPage() {
  const [query, setQuery] = useState('')
  const filtered = people.filter(person => `${person.name} ${person.place}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Around your circle</p><h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">People nearby</h1><p className="mt-2 text-sm text-slate-500">A quick look at who's around and where you can meet.</p></div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]"><section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><label className="relative block"><span className="absolute left-4 top-3 text-slate-400">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find someone or a place..." className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" /></label><div className="mt-4 flex items-center justify-between text-xs"><span className="font-bold">{filtered.length} people nearby</span><span className="text-slate-400">Within 5 km</span></div>
          <div className="mt-3 divide-y divide-slate-100">{filtered.map(person => <div key={person.id} className="flex items-center gap-3 py-4"><Avatar person={person} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{person.name}</p><p className="mt-1 truncate text-xs text-slate-400">{person.place}</p><p className="mt-1 text-[10px] text-slate-400">Updated {person.eta}</p></div><div className="text-right"><span className="block text-xs font-bold">{person.distance}</span><span className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Nearby</span></div></div>)}
            {!filtered.length && <p className="py-8 text-center text-sm text-slate-400">No one found. Try another name or place.</p>}</div>
        </section><section className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"><div className="flex items-center justify-between px-2 pb-3"><h2 className="text-sm font-bold">Nearby map</h2><span className="text-[10px] text-slate-400">Bengaluru, India</span></div><div className="h-[420px] overflow-hidden rounded-xl"><iframe title="Map showing Bengaluru" className="h-full w-full border-0" src="https://www.openstreetmap.org/export/embed.html?bbox=77.56%2C12.93%2C77.63%2C12.99&layer=mapnik" /></div></section></div>
      <p className="text-center text-[11px] text-slate-400">All people and places shown are sample demo data.</p>
    </div>
  )
}
