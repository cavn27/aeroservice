import { CalendarRange } from 'lucide-react'
import { card } from '../ui'
import { LOCALES } from './labels'
import { matchPreset, PRESETS, presetRange, todayLima } from './periods'
import { filterInput } from './filters'

export default function PeriodFilters({ desde, hasta, local, onChange, children, actions }) {
  const active = matchPreset(desde, hasta)
  return (
    <div className={`${card} flex flex-wrap items-center gap-3 p-3`}>
      <div role="group" aria-label="Periodo" className="flex flex-wrap gap-1 rounded-xl bg-surface p-1 dark:bg-white/5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={active === p.id}
            onClick={() => onChange(presetRange(p.id))}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active === p.id ? 'bg-white text-ink shadow-sm dark:bg-navy-800 dark:text-white' : 'text-muted hover:text-ink dark:text-white/60 dark:hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <CalendarRange className="size-4 text-muted dark:text-white/50" />
        <label className="sr-only" htmlFor="f-desde">Desde</label>
        <input id="f-desde" type="date" value={desde} max={hasta} onChange={(e) => e.target.value && onChange({ desde: e.target.value })} className={filterInput} />
        <span className="text-muted">-</span>
        <label className="sr-only" htmlFor="f-hasta">Hasta</label>
        <input id="f-hasta" type="date" value={hasta} min={desde} max={todayLima()} onChange={(e) => e.target.value && onChange({ hasta: e.target.value })} className={filterInput} />
      </div>
      <label className="sr-only" htmlFor="f-local">Sede</label>
      <select id="f-local" value={local} onChange={(e) => onChange({ local: e.target.value })} className={`${filterInput} min-w-48`}>
        <option value="">Todas las sedes</option>
        {Object.entries(LOCALES).map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
      {children}
      {actions && <div className="ml-auto flex items-center gap-3">{actions}</div>}
    </div>
  )
}
