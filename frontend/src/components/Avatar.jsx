export default function Avatar({ person, size = 'md', className = '' }) {
  const dimensions = size === 'sm' ? 'h-8 w-8 text-[10px]' : size === 'lg' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-xs'
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full font-bold text-white ring-2 ring-white ${dimensions} ${className}`}
      style={{ backgroundColor: person.color }}
      aria-label={person.name}
      title={person.name}
    >
      {person.initials}
    </span>
  )
}
