// Periodos de consulta en fechas de Perú (YYYY-MM-DD), independientes de la zona horaria del navegador.

const TZ = 'America/Lima'

export const todayLima = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date())

// Aritmética de fechas sobre UTC para no arrastrar horarios de verano ni la zona local.
const parse = (iso) => new Date(`${iso}T00:00:00Z`)
const iso = (d) => d.toISOString().slice(0, 10)
export const addDays = (isoDate, n) => {
  const d = parse(isoDate)
  d.setUTCDate(d.getUTCDate() + n)
  return iso(d)
}
export const daysBetween = (from, to) => Math.round((parse(to) - parse(from)) / 86400000) + 1

export const PRESETS = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'ayer', label: 'Ayer' },
  { id: '7d', label: '7 días' },
  { id: '30d', label: '30 días' },
  { id: 'mes', label: 'Este mes' },
  { id: 'mes_anterior', label: 'Mes anterior' },
]

export function presetRange(id, today = todayLima()) {
  const firstOfMonth = `${today.slice(0, 8)}01`
  switch (id) {
    case 'hoy':
      return { desde: today, hasta: today }
    case 'ayer':
      return { desde: addDays(today, -1), hasta: addDays(today, -1) }
    case '7d':
      return { desde: addDays(today, -6), hasta: today }
    case '30d':
      return { desde: addDays(today, -29), hasta: today }
    case 'mes_anterior': {
      const lastPrev = addDays(firstOfMonth, -1)
      return { desde: `${lastPrev.slice(0, 8)}01`, hasta: lastPrev }
    }
    case 'mes':
    default:
      return { desde: firstOfMonth, hasta: today }
  }
}

// Detecta si un rango coincide con un preset (para resaltar el botón activo).
export const matchPreset = (desde, hasta) => PRESETS.find((p) => {
  const r = presetRange(p.id)
  return r.desde === desde && r.hasta === hasta
})?.id

const shortDate = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const longDate = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
export const formatDay = (isoDate) => shortDate.format(parse(isoDate))
export const formatRange = (desde, hasta) => (desde === hasta ? longDate.format(parse(desde)) : `${formatDay(desde)} – ${longDate.format(parse(hasta))}`)
