import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, RefreshCw, Search, X } from 'lucide-react'
import { card, EstadoBadge, Skeleton } from '../ui'
import { fmtNumber, fmtSoles } from '../format'
import PeriodFilters from './PeriodFilters'
import { filterInput, useUrlFilters } from './filters'
import { PAGE_SIZE, usePedidos } from './usePedidos'
import PedidoDetail from './PedidoDetail'

const TABS = [
  ['', 'Todos'],
  ['en_curso', 'En curso'],
  ['entregado', 'Entregados'],
  ['rechazado', 'Rechazados'],
]
const CANAL_OPTS = [
  ['', 'Todos los canales'],
  ['domicilio', 'A domicilio'],
  ['directa', 'Venta directa'],
]

// Buscador con espera (no consulta en cada tecla).
function SearchBox({ value, onChange }) {
  const [text, setText] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => text !== value && onChange(text), 400)
    return () => clearTimeout(t)
  }, [text, value, onChange])
  return (
    <label className="relative block min-w-64 flex-1">
      <span className="sr-only">Buscar pedidos</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted dark:text-white/50" />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Buscar cliente, teléfono, DNI, dirección, repartidor o ID"
        className={`${filterInput} w-full pl-9 pr-9`}
      />
      {text && (
        <button type="button" aria-label="Limpiar búsqueda" onClick={() => setText('')} className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface dark:hover:bg-white/10">
          <X className="size-4" />
        </button>
      )}
    </label>
  )
}

export default function PedidosPage() {
  const [f, update] = useUrlFilters(['estado', 'canal', 'canjes', 'q', 'page', 'orden', 'pedido'])
  const page = Math.max(1, Number(f.page) || 1)
  const ascending = f.orden === 'asc'
  // Cualquier cambio de filtro vuelve a la primera página.
  const setFilter = (patch) => update({ ...patch, page: '' })

  const { rows, total, counts, loading, error, live, reload } = usePedidos({ filters: f, search: f.q, page, ascending })
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0
  const to = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="space-y-6">
      <title>Aeroservice | Pedidos</title>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500 dark:text-navy-300">Aeroservice</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Pedidos</h1>
          <p className="mt-1 text-muted dark:text-white/60">Consulta los pedidos registrados. Solo lectura.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-muted dark:text-white/60" title={live ? 'Se actualiza solo cuando hay cambios' : 'Sin conexión en vivo'}>
            <span className={`size-2 rounded-full ${live ? 'animate-pulse bg-emerald-500' : 'bg-navy-200 dark:bg-white/20'}`} />
            {live ? 'En vivo' : 'Sin conexión en vivo'}
          </span>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-navy-100 px-3 text-sm font-medium hover:bg-surface disabled:opacity-60 dark:border-white/10 dark:hover:bg-white/5"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        </div>
      </div>

      <PeriodFilters desde={f.desde} hasta={f.hasta} local={f.local} onChange={setFilter}>
        <label className="sr-only" htmlFor="p-canal">Canal</label>
        <select id="p-canal" value={f.canal} onChange={(e) => setFilter({ canal: e.target.value })} className={filterInput}>
          {CANAL_OPTS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.canjes === 'si'} onChange={(e) => setFilter({ canjes: e.target.checked ? 'si' : '' })} className="size-4 accent-navy-600" />
          Incluir canjes
        </label>
      </PeriodFilters>

      <div className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-center gap-3 border-b border-navy-100 p-4 dark:border-white/10">
          <div role="tablist" aria-label="Estado" className="flex flex-wrap gap-1 rounded-xl bg-surface p-1 dark:bg-white/5">
            {TABS.map(([v, l]) => (
              <button
                key={v}
                role="tab"
                type="button"
                aria-selected={f.estado === v}
                onClick={() => setFilter({ estado: v })}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  f.estado === v ? 'bg-white text-ink shadow-sm dark:bg-navy-800 dark:text-white' : 'text-muted hover:text-ink dark:text-white/60 dark:hover:text-white'
                }`}
              >
                {l}
                <span className="rounded-full bg-navy-50 px-1.5 text-xs tabular-nums text-navy-600 dark:bg-white/10 dark:text-white/80">{fmtNumber(counts[v] ?? 0)}</span>
              </button>
            ))}
          </div>
          <SearchBox value={f.q} onChange={(q) => setFilter({ q })} />
        </div>

        {error ? (
          <div role="alert" className="flex items-start gap-3 p-6 text-muted dark:text-white/60">
            <AlertTriangle className="size-5 shrink-0 text-amber-500" /> {error}
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading && rows.length ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-surface text-muted dark:bg-white/5 dark:text-white/50">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    <button type="button" onClick={() => update({ orden: ascending ? '' : 'asc', page: '' })} className="inline-flex items-center gap-1 hover:text-ink dark:hover:text-white" title="Cambiar orden">
                      Fecha {ascending ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Estación</th>
                  <th className="px-4 py-3 font-medium">Productos</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Pago</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Repartidor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 dark:divide-white/10">
                {loading && !rows.length
                  ? Array.from({ length: 8 }, (_, i) => (
                      <tr key={i}>
                        <td colSpan={8} className="px-4 py-2.5">
                          <Skeleton className="h-6" />
                        </td>
                      </tr>
                    ))
                  : rows.map((r) => (
                      <tr
                        key={r.id}
                        tabIndex={0}
                        onClick={() => update({ pedido: r.id })}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), update({ pedido: r.id }))}
                        className="cursor-pointer outline-none hover:bg-surface/70 focus-visible:bg-navy-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/10"
                      >
                        <td className="whitespace-nowrap px-4 py-3 tabular-nums">{r.fechaRegistro}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{r.cliente}</p>
                          <p className="text-xs text-muted dark:text-white/50">{[r.telefono, r.distrito].filter(Boolean).join(' · ')}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>{r.estacion}</p>
                          <p className="text-xs text-muted dark:text-white/50">{r.tipoVenta}</p>
                        </td>
                        <td className="max-w-64 truncate px-4 py-3" title={r.productos}>
                          {r.productos}
                        </td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">{fmtSoles(r.total)}</td>
                        <td className="px-4 py-3">{r.tipoPago}</td>
                        <td className="px-4 py-3">
                          <EstadoBadge estado={r.raw.estado} />
                        </td>
                        <td className="px-4 py-3">{r.repartidor}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {!loading && !rows.length && <p className="py-14 text-center text-muted dark:text-white/50">No hay pedidos con estos filtros.</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 px-4 py-3 text-sm dark:border-white/10">
          <p className="text-muted dark:text-white/60">
            {total ? `${fmtNumber(from)}–${fmtNumber(to)} de ${fmtNumber(total)} pedidos` : 'Sin resultados'}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={page <= 1 || loading}
              onClick={() => update({ page: String(page - 1) })}
              className="grid size-9 place-items-center rounded-lg border border-navy-100 hover:bg-surface disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="tabular-nums text-muted dark:text-white/60">
              Página {page} de {pages}
            </span>
            <button
              type="button"
              aria-label="Página siguiente"
              disabled={page >= pages || loading}
              onClick={() => update({ page: String(page + 1) })}
              className="grid size-9 place-items-center rounded-lg border border-navy-100 hover:bg-surface disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {f.pedido && (
        <PedidoDetail
          key={f.pedido}
          id={f.pedido}
          initial={rows.find((r) => r.id === f.pedido)}
          onClose={() => update({ pedido: '' })}
          onOpen={(id) => update({ pedido: id })}
        />
      )}
    </div>
  )
}
