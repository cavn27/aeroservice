import { Fragment, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CalendarDays, ChevronDown, FileSignature, FileSpreadsheet, LoaderCircle, Printer } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { card, Skeleton } from '../ui'
import { fmtNumber, fmtSoles } from '../format'
import { LOCALES, localLabel } from './labels'
import { addDays, formatRange, todayLima } from './periods'
import { filterInput } from './filters'
import { fetchCuadre, formatFechaHora } from './reportData'
import { buildCuadre, cuadreTotales } from './cuadre'

// Cuadre diario: lo que cada trabajador cobró en un día y debe rendir, con hoja de firma en PDF.
export default function CuadrePanel({ dia, local, onChange }) {
  const { user } = useAuth()
  const fecha = dia || todayLima()
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [open, setOpen] = useState(null)
  const [exporting, setExporting] = useState(null)

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))
    fetchCuadre({ fecha, local })
      .then((data) => active && setState({ data, error: null, loading: false }))
      .catch(() => active && setState({ data: null, error: 'No se pudo cargar el cuadre. Revisa tu conexión e intenta de nuevo.', loading: false }))
    return () => {
      active = false
    }
  }, [fecha, local])

  const workers = useMemo(() => (state.data ? buildCuadre(state.data.rows, state.data.perfiles) : []), [state.data])
  const totales = useMemo(() => cuadreTotales(workers), [workers])

  const meta = () => ({
    fecha: formatRange(fecha, fecha),
    sede: local ? localLabel(local) : 'Todas las sedes',
    usuario: user?.name ?? '',
    generado: formatFechaHora(new Date().toISOString()),
  })
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '_').toLowerCase()

  const pdf = async (list, key, name) => {
    setExporting(key)
    try {
      const { exportCuadrePdf } = await import('./exportCuadrePdf')
      await exportCuadrePdf({ workers: list, meta: meta(), filename: `cuadre_${fecha}_${name}.pdf` })
    } finally {
      setExporting(null)
    }
  }
  const excel = async () => {
    setExporting('excel')
    try {
      const { exportCuadreExcel } = await import('./exportExcel')
      await exportCuadreExcel({ workers, totales, meta: meta(), filename: `cuadre_${fecha}${local ? `_${local}` : ''}.xlsx` })
    } finally {
      setExporting(null)
    }
  }

  const today = todayLima()
  const quick = [
    ['Hoy', today],
    ['Ayer', addDays(today, -1)],
  ]
  const ready = !state.loading && state.data
  const btn = 'inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <div className="space-y-6">
      <div className={`${card} flex flex-wrap items-center gap-3 p-3`}>
        <div className="flex gap-1 rounded-xl bg-surface p-1 dark:bg-white/5">
          {quick.map(([label, value]) => (
            <button
              key={label}
              type="button"
              aria-pressed={fecha === value}
              onClick={() => onChange({ dia: value === today ? '' : value })}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                fecha === value ? 'bg-white text-ink shadow-sm dark:bg-navy-800 dark:text-white' : 'text-muted hover:text-ink dark:text-white/60 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted dark:text-white/50" />
          <span className="sr-only">Día del cuadre</span>
          <input type="date" value={fecha} max={today} onChange={(e) => e.target.value && onChange({ dia: e.target.value })} className={filterInput} />
        </label>
        <label className="sr-only" htmlFor="c-local">Sede</label>
        <select id="c-local" value={local} onChange={(e) => onChange({ local: e.target.value })} className={`${filterInput} min-w-48`}>
          <option value="">Todas las sedes</option>
          {Object.entries(LOCALES).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" disabled={!ready || !workers.length || !!exporting} onClick={excel} className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}>
            {exporting === 'excel' ? <LoaderCircle className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />} Excel
          </button>
          <button type="button" disabled={!ready || !workers.length || !!exporting} onClick={() => pdf(workers, 'all', 'todos')} className={`${btn} bg-navy-600 text-white hover:bg-navy-700`}>
            {exporting === 'all' ? <LoaderCircle className="size-4 animate-spin" /> : <Printer className="size-4" />} Hojas de firma (todos)
          </button>
        </div>
      </div>

      <p className="text-sm text-muted dark:text-white/60">
        Pedidos <strong className="font-semibold text-ink dark:text-white">entregados</strong> el {formatRange(fecha, fecha)} (hora de Perú). En delivery rinde el
        repartidor; en venta directa, quien la registró. Los canjes se listan aparte y no suman dinero.
      </p>

      {state.error ? (
        <div role="alert" className={`${card} flex items-start gap-4 p-6`}>
          <AlertTriangle className="size-6 shrink-0 text-amber-500" />
          <p className="text-muted dark:text-white/60">{state.error}</p>
        </div>
      ) : !ready ? (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <>
          <dl className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              ['Entregas', fmtNumber(totales.entregas)],
              ['Total vendido', fmtSoles(totales.total)],
              ['Efectivo a rendir', fmtSoles(totales.efectivo), true],
              ['Yape', fmtSoles(totales.yape)],
              ['Tarjeta', fmtSoles(totales.tarjeta)],
              ['Vales FISE', `${fmtNumber(totales.vales)} · ${fmtSoles(totales.valesMonto)}`],
            ].map(([k, v, strong]) => (
              <div key={k} className={`rounded-2xl p-4 ${strong ? 'bg-navy-600 text-white' : `${card}`}`}>
                <dt className={`text-xs ${strong ? 'text-white/80' : 'text-muted dark:text-white/60'}`}>{k}</dt>
                <dd className="mt-1 text-lg font-bold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          <div className={`${card} overflow-hidden`}>
            {workers.length === 0 ? (
              <p className="py-14 text-center text-muted dark:text-white/50">No hay pedidos entregados este día.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <thead className="bg-surface text-muted dark:bg-white/5 dark:text-white/50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Trabajador</th>
                      <th className="px-4 py-3 text-right font-medium">Entregas</th>
                      <th className="px-4 py-3 text-right font-medium">Total</th>
                      <th className="px-4 py-3 text-right font-medium">Efectivo</th>
                      <th className="px-4 py-3 text-right font-medium">Yape</th>
                      <th className="px-4 py-3 text-right font-medium">Tarjeta</th>
                      <th className="px-4 py-3 text-right font-medium">Vales</th>
                      <th className="px-4 py-3 text-right font-medium">Canjes</th>
                      <th className="px-4 py-3 font-medium">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100 dark:divide-white/10">
                    {workers.map((w) => (
                      <Fragment key={w.id}>
                        <tr className="hover:bg-surface/60 dark:hover:bg-white/5">
                          <td className="px-4 py-3">
                            <button type="button" aria-expanded={open === w.id} onClick={() => setOpen(open === w.id ? null : w.id)} className="flex items-center gap-2 text-left">
                              <ChevronDown className={`size-4 shrink-0 text-muted transition-transform ${open === w.id ? 'rotate-180' : ''}`} />
                              <span>
                                <span className="block font-medium">{w.nombre}</span>
                                <span className="block text-xs text-muted dark:text-white/50">{[w.rol, w.dni && `DNI ${w.dni}`].filter(Boolean).join(' · ')}</span>
                              </span>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmtNumber(w.entregas)}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmtSoles(w.total)}</td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmtSoles(w.efectivo)}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmtSoles(w.yape)}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmtSoles(w.tarjeta)}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmtNumber(w.vales)}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{fmtNumber(w.canjes.length)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              disabled={!!exporting}
                              onClick={() => pdf([w], w.id, slug(w.nombre))}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-100 px-2.5 py-1.5 text-xs font-semibold hover:bg-surface disabled:opacity-60 dark:border-white/10 dark:hover:bg-white/5"
                            >
                              {exporting === w.id ? <LoaderCircle className="size-3.5 animate-spin" /> : <FileSignature className="size-3.5" />} Hoja de firma
                            </button>
                          </td>
                        </tr>
                        {open === w.id && (
                          <tr className="bg-surface/50 dark:bg-white/[0.03]">
                            <td colSpan={9} className="px-4 py-3">
                              <table className="w-full text-xs">
                                <thead className="text-muted dark:text-white/50">
                                  <tr>
                                    <th className="py-1.5 text-left font-medium">Hora</th>
                                    <th className="py-1.5 text-left font-medium">Cliente</th>
                                    <th className="py-1.5 text-left font-medium">Productos</th>
                                    <th className="py-1.5 text-left font-medium">Pago</th>
                                    <th className="py-1.5 text-right font-medium">Total</th>
                                    <th className="py-1.5 text-right font-medium">Vale</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[...w.pedidos, ...w.canjes].map((r) => (
                                    <tr key={r.id} className="border-t border-navy-100 dark:border-white/10">
                                      <td className="py-1.5 tabular-nums">{r.fechaEntregado.slice(11)}</td>
                                      <td className="py-1.5">{r.cliente}</td>
                                      <td className="py-1.5">
                                        {r.productos}
                                        {r.raw.es_canje && <span className="ml-2 rounded-full bg-violet-50 px-1.5 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">Canje</span>}
                                      </td>
                                      <td className="py-1.5">{r.tipoPago}</td>
                                      <td className="py-1.5 text-right tabular-nums">{r.raw.es_canje ? '—' : fmtSoles(r.total)}</td>
                                      <td className="py-1.5 text-right">{r.raw.con_vale ? r.codigoVale || 'Sí' : ''}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-navy-200 font-semibold dark:border-white/20">
                    <tr>
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtNumber(totales.entregas)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtSoles(totales.total)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtSoles(totales.efectivo)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtSoles(totales.yape)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtSoles(totales.tarjeta)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtNumber(totales.vales)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtNumber(totales.canjes)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
