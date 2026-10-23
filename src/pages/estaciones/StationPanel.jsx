import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Check, Clock, MapPin, Navigation, Phone, SlidersHorizontal } from 'lucide-react'
import { products, services } from '../../data/estaciones'
import { directionsLinks, formatKm, formatPrice, openStatus } from './geo'

const serviceLabel = Object.fromEntries(services.map((s) => [s.id, s.label]))

function StatusBadge({ hours }) {
  const { open, label } = openStatus(hours)
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${open ? 'text-emerald-600' : 'text-muted'}`}>
      <span className={`size-1.5 rounded-full ${open ? 'bg-emerald-500' : 'bg-muted/50'}`} />
      {label}
    </span>
  )
}

function PriceTag({ station, product }) {
  const available = product.id in station.products
  return (
    <span className={`shrink-0 rounded-xl px-3 py-1.5 text-center ${available ? 'bg-navy-600 text-white' : 'bg-surface text-muted'}`}>
      <span className="block text-sm font-bold leading-tight">{available ? formatPrice(station.products[product.id]) : '—'}</span>
      <span className="block text-[10px] leading-tight opacity-80">{product.label}</span>
    </span>
  )
}

export function StationList({ stations, product, distances, hoveredId, onSelect, onHover, onShowAll, searching }) {
  if (stations.length === 0) {
    return (
      <div className="px-2 py-10 text-center">
        <MapPin className="mx-auto size-10 text-navy-200" />
        <p className="mt-3 font-semibold">{searching ? 'Sin resultados' : 'No hay estaciones en esta zona'}</p>
        <p className="mt-1 text-sm text-muted">{searching ? 'Prueba con otra dirección o nombre.' : 'Mueve o aleja el mapa para ver más estaciones.'}</p>
        <button type="button" onClick={onShowAll} className="mt-4 font-semibold text-navy-600 hover:underline">
          Ver todas las estaciones
        </button>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence initial={false}>
        {stations.map((s) => (
          <motion.li
            key={s.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={() => onSelect(s.id)}
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
              className={`flex w-full items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all ${
                s.id === hoveredId ? 'border-navy-300 shadow-card' : 'border-navy-100'
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{s.name}</span>
                <span className="mt-0.5 block truncate text-sm text-muted">{s.address}</span>
                <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <StatusBadge hours={s.hours} />
                  {distances[s.id] != null && <span className="text-xs font-medium text-navy-600">{formatKm(distances[s.id])}</span>}
                </span>
              </span>
              <PriceTag station={s} product={product} />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

export function StationDetail({ station, product, distance, onBack }) {
  const links = directionsLinks(station)
  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:underline">
        <ArrowLeft className="size-4" /> Volver
      </button>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{station.name}</h2>
          {distance != null && <p className="mt-1 text-sm font-medium text-navy-600">{formatKm(distance)} de distancia</p>}
          <p className="mt-2 text-muted">
            {station.address}, {station.city}
          </p>
          <p className="mt-1 text-xs text-muted">Código de estación: {station.code}</p>
        </div>
        <PriceTag station={station} product={product} />
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm">
        <Clock className="size-4 text-navy-500" /> <StatusBadge hours={station.hours} />
      </p>

      <h3 className="mt-7 text-sm font-semibold uppercase tracking-wide text-muted">Productos</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {products
          .filter((p) => p.id in station.products)
          .map((p) => (
            <span
              key={p.id}
              className={`rounded-xl border px-3 py-1.5 text-sm ${p.id === product.id ? 'border-navy-600 bg-navy-50 font-semibold text-navy-700' : 'border-navy-100 text-ink'}`}
            >
              {p.label} · {formatPrice(station.products[p.id])}
            </span>
          ))}
      </div>

      <h3 className="mt-7 text-sm font-semibold uppercase tracking-wide text-muted">Servicios</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {station.services.map((id) => (
          <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm">
            <Check className="size-3.5 text-emerald-600" /> {serviceLabel[id]}
          </span>
        ))}
      </div>

      <h3 className="mt-7 text-sm font-semibold uppercase tracking-wide text-muted">Cómo llegar</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy-600 font-semibold text-white transition hover:bg-navy-700"
          >
            <Navigation className="size-4" /> {l.label}
          </a>
        ))}
      </div>
      {station.phone && (
        <a
          href={`tel:${station.phone.replace(/\s/g, '')}`}
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-navy-600 font-semibold text-navy-600 transition hover:bg-navy-50"
        >
          <Phone className="size-4" /> Llamar {station.phone}
        </a>
      )}
    </motion.div>
  )
}

export function FiltersButton({ open, count, onToggle }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label="Filtros de servicios"
      onClick={onToggle}
      className={`relative grid size-11 shrink-0 place-items-center rounded-xl transition ${open ? 'bg-navy-600 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}`}
    >
      <SlidersHorizontal className="size-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">{count}</span>
      )}
    </button>
  )
}

export function FiltersPanel({ open, selected, onToggle, onClear }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="mt-4 rounded-2xl bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Servicios</p>
              {selected.length > 0 && (
                <button type="button" onClick={onClear} className="text-sm font-semibold text-navy-600 hover:underline">
                  Limpiar
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {services.map((s) => {
                const on = selected.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onToggle(s.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${on ? 'border-navy-600 bg-navy-600 text-white' : 'border-navy-100 bg-white text-ink hover:border-navy-300'}`}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
