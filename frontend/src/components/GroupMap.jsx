import { useEffect } from 'react'
import { Circle, MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function createAvatarIcon(person, selected) {
  return L.divIcon({
    className: '',
    html: `<div style="width:${selected ? 50 : 42}px;height:${selected ? 50 : 42}px;border-radius:50%;background:${person.color};border:3px solid white;box-shadow:0 4px 14px #26304433;display:grid;place-items:center;color:white;font:700 11px 'DM Sans',sans-serif;${selected ? 'outline:3px solid #635bff' : ''}">${person.initials}</div>`,
    iconSize: [selected ? 50 : 42, selected ? 50 : 42],
    iconAnchor: [selected ? 25 : 21, selected ? 25 : 21],
  })
}

function FitBounds({ people }) {
  const map = useMap()
  useEffect(() => {
    if (people.length > 1) map.fitBounds(people.map(person => [person.lat, person.lng]), { padding: [50, 50] })
  }, [map, people])
  return null
}

export default function GroupMap({ people, selectedId, onSelect, height = '430px' }) {
  const center = people.length ? [people[0].lat, people[0].lng] : [12.9716, 77.5946]
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ height }}>
      <MapContainer center={center} zoom={14} scrollWheelZoom className="h-full w-full">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {people.map(person => (
          <Marker key={person.id} position={[person.lat, person.lng]} icon={createAvatarIcon(person, selectedId === person.id)} eventHandlers={{ click: () => onSelect?.(person.id) }}>
            <Tooltip direction="top" offset={[0, -17]}>{person.name} · {person.place}</Tooltip>
          </Marker>
        ))}
        {people.length > 0 && <Circle center={[people[0].lat, people[0].lng]} radius={850} pathOptions={{ color: '#635bff', fillColor: '#635bff', fillOpacity: 0.035, weight: 1, dashArray: '5 7' }} />}
        <FitBounds people={people} />
      </MapContainer>
      <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-lg bg-white/95 px-3 py-2 text-[10px] font-semibold text-slate-500 shadow-sm">LIVE GROUP MAP · BENGALURU</div>
    </div>
  )
}
