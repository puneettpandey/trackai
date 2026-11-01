import { Link } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import { people } from '../data/mockData.js'
import Avatar from '../components/Avatar.jsx'

export default function LandingPage() {
  return (
    <div className="overflow-hidden bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex"><a href="#how-it-works" className="hover:text-ink">How it works</a><a href="#safety" className="hover:text-ink">Safety</a></nav>
        <div className="flex items-center gap-2 sm:gap-4"><Link to="/login" className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-ink">Log in</Link><Link to="/register" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5">Get started <span className="ml-1">→</span></Link></div>
      </header>
      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-20 pt-12 md:grid-cols-[1.05fr_.95fr] md:pb-28 md:pt-20 sm:px-8">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3.5 py-2 text-xs font-bold text-brand"><span>✦</span> A little closer, wherever you are</div>
            <h1 className="max-w-[650px] font-display text-[42px] font-extrabold leading-[1.1] tracking-[-.045em] text-ink sm:text-6xl lg:text-[68px]">Your people.<br /><span className="text-brand">Right where</span> they need you.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">A calmer way to stay in sync. Share your location with your circle, find each other in a heartbeat, and feel good about every trip.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3"><Link to="/register" className="rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5">Create your circle <span className="ml-2">→</span></Link><Link to="/group-map" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-ink transition hover:border-slate-300">Explore the map</Link></div>
            <div className="mt-8 flex items-center gap-3"><div className="flex -space-x-2">{people.slice(0, 3).map(person => <Avatar key={person.id} person={person} size="sm" />)}</div><p className="text-xs text-slate-500"><span className="font-bold text-ink">A little peace of mind</span><br />for the people who matter most</p></div>
          </div>
          <div className="relative mx-auto w-full max-w-[570px] py-8">
            <div className="absolute -right-4 top-0 h-72 w-72 rounded-full bg-violet-100/80 blur-[80px]" />
            <div className="absolute -bottom-8 left-4 h-56 w-56 rounded-full bg-emerald-100/70 blur-[70px]" />
            <div className="relative min-h-[390px] overflow-hidden rounded-[34px] border-[8px] border-white bg-[#e7eee5] shadow-[0_35px_90px_rgba(46,56,82,.18)] sm:min-h-[480px]">
              <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'linear-gradient(28deg, transparent 46%, white 47%, white 49%, transparent 50%), linear-gradient(112deg, transparent 40%, #fff 41%, #fff 43%, transparent 44%), linear-gradient(165deg, transparent 56%, #fff 57%, #fff 59%, transparent 60%), linear-gradient(0deg, transparent 49%, #d1dfca 50%, #d1dfca 62%, transparent 63%)', backgroundSize: '170px 150px, 180px 140px, 220px 190px, 100% 100%' }} />
              <div className="absolute left-[14%] top-[19%] h-28 w-36 rounded-[45%] bg-[#cfe5c8]" /><div className="absolute right-[8%] top-[49%] h-32 w-40 rounded-[48%] bg-[#cfe5c8]" /><div className="absolute bottom-[9%] left-[23%] h-28 w-36 rounded-[45%] bg-[#d2e7cc]" />
              <div className="absolute left-[40%] top-[29%] h-28 w-24 rounded-[50%] border-2 border-dashed border-brand/40 bg-brand/5" />
              {people.slice(0, 3).map((person, index) => <div key={person.id} className={`float absolute ${index === 0 ? 'left-[25%] top-[24%]' : index === 1 ? 'right-[15%] top-[40%]' : 'bottom-[17%] left-[47%]'}`} style={{ animationDelay: `${index * .7}s` }}><div className="rounded-2xl bg-white px-3 py-2 shadow-lg"><div className="flex items-center gap-2"><Avatar person={person} size="sm" /><div><p className="text-xs font-bold text-ink">{person.name.split(' ')[0]}</p><p className="text-[9px] text-slate-400">{person.place}</p></div></div></div></div>)}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your circle · 4 online</p><p className="mt-1 text-sm font-bold">Everyone's close by <span className="ml-1 text-emerald-500">●</span></p></div><Link to="/group-map" className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-lg text-white">↗</Link></div>
            </div>
            <div className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-2xl bg-white p-3 shadow-soft sm:block"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">✓</div><p className="mt-2 text-[10px] font-bold">All safe</p></div>
          </div>
        </section>
        <section id="how-it-works" className="border-y border-slate-100 bg-[#fbfbfd] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl"><div className="mx-auto max-w-xl text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-brand">Good to be in the know</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Together is a safer place.</h2><p className="mt-3 text-sm leading-6 text-slate-500">All the little things that make looking out for each other feel effortless.</p></div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">{[{ icon: '⌖', title: 'See the bigger picture', text: 'A shared map makes it easy to find your people, without the endless “where are you?” texts.', tone: 'bg-violet-100 text-brand' }, { icon: '◷', title: 'Know they got there', text: 'Gentle place alerts let your circle know when someone arrives or heads out.', tone: 'bg-orange-100 text-orange-600' }, { icon: '♡', title: 'Safety, within reach', text: 'A simple SOS feature means help is only a tap away when it matters.', tone: 'bg-emerald-100 text-emerald-600' }].map(item => <article id="safety" key={item.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><div className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${item.tone}`}>{item.icon}</div><h3 className="mt-5 font-display text-base font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p></article>)}</div>
          </div>
        </section>
      </main>
      <footer className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-slate-400 sm:px-8"><Brand /><p>Made for the people you love. © TrackAI</p></footer>
    </div>
  )
}
