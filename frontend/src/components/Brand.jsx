import { Link } from 'react-router-dom'

export default function Brand({ light = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 font-display text-[19px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-lg shadow-brand/25">
        <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" aria-hidden="true">
          <path d="M12 21s7-5.16 7-11a7 7 0 1 0-14 0c0 5.84 7 11 7 11Z" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="10" r="2.5" fill="currentColor" />
        </svg>
      </span>
      trackai
    </Link>
  )
}
