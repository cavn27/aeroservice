// Utilidades de distancia, horarios y enlaces de navegación para el buscador de estaciones.

export function distanceKm([lat1, lng1], [lat2, lng2]) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export const formatKm = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`)

export function openStatus(hours, now = new Date()) {
  if (!hours) return { open: true, label: 'Abierto 24 horas' }
  const [from, to] = hours
  const h = now.getHours() + now.getMinutes() / 60
  const open = h >= from && h < to
  const pad = (n) => `${String(n).padStart(2, '0')}:00`
  return { open, label: open ? `Abierto hasta las ${pad(to)}` : `Cerrado · abre a las ${pad(from)}` }
}

export const directionsLinks = ({ lat, lng }) => [
  { label: 'Google Maps', href: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` },
  { label: 'Waze', href: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` },
]

const priceFormat = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
export const formatPrice = (value) => (value == null ? 'Consultar' : priceFormat.format(value))
