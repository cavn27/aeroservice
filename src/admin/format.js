// Formatos numéricos del panel (Perú).
const number = new Intl.NumberFormat('es-PE')
const soles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const solesRound = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 })
const compact = new Intl.NumberFormat('es-PE', { notation: 'compact', maximumFractionDigits: 1 })

export const fmtNumber = (v) => number.format(v ?? 0)
export const fmtSoles = (v) => soles.format(v ?? 0)
export const fmtSolesRound = (v) => solesRound.format(v ?? 0)
export const fmtSolesCompact = (v) => `S/ ${compact.format(v ?? 0)}`
export const fmtPercent = (v, digits = 1) => `${(v ?? 0).toFixed(digits)}%`
export const fmtMinutes = (v) => {
  if (v == null) return '—'
  if (v < 60) return `${Math.round(v)} min`
  const h = Math.floor(v / 60)
  const m = Math.round(v % 60)
  return m ? `${h} h ${m} min` : `${h} h`
}

// Variación porcentual frente al periodo anterior; null si no hay base de comparación.
export const pctChange = (current, previous) => (previous ? ((current - previous) / previous) * 100 : null)
