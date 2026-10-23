import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, FileSignature, FileSpreadsheet, FileText, LoaderCircle } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import { card, CardHeader, Skeleton } from '../ui'
import { fmtNumber, fmtSoles } from '../format'
import { localLabel } from './labels'
import { formatRange } from './periods'
import PeriodFilters from './PeriodFilters'
import { filterInput, useUrlFilters } from './filters'
import { fetchReport, fetchResumenReporte, fetchVistaPrevia, formatFechaHora, summarize } from './reportData'
import CuadrePanel from './CuadrePanel'

const ESTADO_OPTS = [
  ['', 'Todos los estados'],
  ['entregado', 'Entregados'],
  ['en_curso', 'En curso'],
  ['rechazado', 'Rechazados'],
]
const CANAL_OPTS = [
  ['', 'Todos los canales'],
  ['domicilio', 'A domicilio'],
  ['directa', 'Venta directa'],
]
const PREVIEW = 50

// Carga lo que la pantalla muestra: los totales (calculados en el servidor) y solo la vista previa. El detalle
// completo se pide al exportar. Si la función del servidor todavía no está instalada (PGRST202), se usa la
// carga completa de antes, para que nada se rompa mientras se aplica portal_reporte_resumen.sql.
async function loadReport(consulta) {
  try {
    const [summary, vista] = await Promise.all([fetchResumenReporte(consulta), fetchVistaPrevia(consulta, PREVIEW)])
    return { rows: vista.rows, total: vista.total, summary, completo: false }
  } catch (e) {
    if (e?.code !== 'PGRST202') throw e
    const rows = await fetchReport(consulta)
    return { rows, total: rows.length, summary: summarize(rows), completo: true }
  }
}

const VISTAS = [
  ['', 'Ventas del periodo', FileSpreadsheet],
  ['cuadre', 'Cuadre diario por trabajador', FileSignature],
]

export default function ReportesPage() {
  const [filters, update] = useUrlFilters(['estado', 'canal', 'canjes', 'vista', 'dia'])
  const cuadre = filters.vista === 'cuadre'
  return (
    <div className="space-y-6">
      <title>{cuadre ? 'Aeroservice | Cuadre diario' : 'Aeroservice | Reportes'}</title>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-navy-500 dark:text-navy-300">Aeroservice</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Reportes</h1>
        <p className="mt-1 text-muted dark:text-white/60">
          {cuadre
            ? 'Lo que cada trabajador cobró en el día, con hoja de firma para el cuadre de caja.'
            : 'Descarga los pedidos registrados en el periodo, con las mismas columnas que el Excel de la app.'}
        </p>
      </div>
      <div role="tablist" aria-label="Tipo de reporte" className="flex flex-wrap gap-2">
        {VISTAS.map(([v, label, Icon]) => (
          <button
            key={v}
            role="tab"
            type="button"
            aria-selected={filters.vista === v}
            onClick={() => update({ vista: v })}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              filters.vista === v
                ? 'border-navy-600 bg-navy-600 text-white'
                : 'border-navy-100 bg-white text-ink hover:bg-surface dark:border-white/10 dark:bg-navy-900 dark:text-white dark:hover:bg-white/5'
            }`}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>
      {cuadre ? <CuadrePanel dia={filters.dia} local={filters.local} onChange={update} /> : <VentasReport filters={filters} update={update} />}
    </div>
  )
}

function VentasReport({ filters, update }) {
  const { user } = useAuth()
  const { desde, hasta, local, estado, canal, canjes } = filters
  const [state, setState] = useState({ rows: null, total: 0, summary: null, completo: false, error: null, loading: true })
  const consulta = useMemo(
    () => ({ desde, hasta, local, estado, canal, canjes: canjes === 'si' }),
    [desde, hasta, local, estado, canal, canjes],
  )
  const [exporting, setExporting] = useState(null)

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))
    loadReport(consulta)
      .then((data) => active && setState({ ...data, error: null, loading: false }))
      .catch(() => active && setState({ rows: null, total: 0, summary: null, completo: false, error: 'No se pudieron cargar los pedidos. Revisa tu conexión e intenta de nuevo.', loading: false }))
    return () => {
      active = false
    }
  }, [consulta])

  const { summary } = state

  const filtrosTexto = [
    ESTADO_OPTS.find(([v]) => v === estado)?.[1],
    CANAL_OPTS.find(([v]) => v === canal)?.[1],
    canjes === 'si' ? 'Con canjes' : 'Sin canjes',
  ].join(' · ')

  const exportar = async (tipo) => {
    setExporting(tipo)
    try {
      const meta = {
        periodo: formatRange(desde, hasta),
        sede: local ? localLabel(local) : 'Todas las sedes',
        filtros: filtrosTexto,
        usuario: user?.name ?? '',
        generado: formatFechaHora(new Date().toISOString()),
      }
      const base = `ventas_aeroservice_${desde}_al_${hasta}${local ? `_${local}` : ''}`
      // La pantalla solo tiene la vista previa: el detalle completo se pide ahora, una sola vez por descarga.
      const rows = state.completo ? state.rows : await fetchReport(consulta)
      const resumen = state.completo ? summary : summarize(rows)
      if (tipo === 'excel') {
        const { exportExcel } = await import('./exportExcel')
        await exportExcel({ rows, summary: resumen, meta, filename: `${base}.xlsx` })
      } else {
        const { exportPdf } = await import('./exportPdf')
        await exportPdf({ rows, summary: resumen, meta, filename: `${base}.pdf` })
      }
    } finally {
      setExporting(null)
    }
  }

  const ready = !state.loading && state.rows
  const hayFilas = state.total > 0
  const btn =
    'inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <div className="space-y-6">
      <PeriodFilters desde={desde} hasta={hasta} local={local} onChange={update}>
        <label className="sr-only" htmlFor="f-estado">Estado</label>
        <select id="f-estado" value={estado} onChange={(e) => update({ estado: e.target.value })} className={filterInput}>
          {ESTADO_OPTS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="f-canal">Canal</label>
        <select id="f-canal" value={canal} onChange={(e) => update({ canal: e.target.value })} className={filterInput}>
          {CANAL_OPTS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={canjes === 'si'} onChange={(e) => update({ canjes: e.target.checked ? 'si' : '' })} className="size-4 accent-navy-600" />
          Incluir canjes
        </label>
      </PeriodFilters>

      {state.error ? (
        <div role="alert" className={`${card} flex items-start gap-4 p-6`}>
          <AlertTriangle className="size-6 shrink-0 text-amber-500" />
          <p className="text-muted dark:text-white/60">{state.error}</p>
        </div>
      ) : (
        <div className={`${card} p-6`}>
          <CardHeader
            title="Vista previa"
            subtitle={`${formatRange(desde, hasta)} · ${local ? localLabel(local) : 'Todas las sedes'} · ${filtrosTexto}`}
            action={
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={!ready || !hayFilas || exporting} onClick={() => exportar('excel')} className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}>
                  {exporting === 'excel' ? <LoaderCircle className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />} Excel
                </button>
                <button type="button" disabled={!ready || !hayFilas || exporting} onClick={() => exportar('pdf')} className={`${btn} bg-brand-600 text-white hover:bg-brand-700`}>
                  {exporting === 'pdf' ? <LoaderCircle className="size-4 animate-spin" /> : <FileText className="size-4" />} PDF
                </button>
              </div>
            }
          />

          {!ready ? (
            <div className="mt-6 space-y-3">
              <p className="flex items-center gap-2 text-sm text-muted dark:text-white/60">
                <LoaderCircle className="size-4 animate-spin" /> Cargando pedidos…
              </p>
              <Skeleton className="h-20" />
              <Skeleton className="h-64" />
            </div>
          ) : (
            <>
              <dl className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  ['Pedidos', fmtNumber(summary.registrados)],
                  ['Entregados', fmtNumber(summary.entregados)],
                  ['Ingresos', fmtSoles(summary.ingresos)],
                  ['Ticket promedio', fmtSoles(summary.ticket)],
                  ['Rechazados', fmtNumber(summary.rechazados)],
                  ['En curso', fmtNumber(summary.enCurso)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-surface p-4 dark:bg-white/5">
                    <dt className="text-xs text-muted dark:text-white/60">{k}</dt>
                    <dd className="mt-1 text-lg font-bold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>

              {!hayFilas ? (
                <p className="py-12 text-center text-muted dark:text-white/50">No hay pedidos con estos filtros.</p>
              ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-navy-100 dark:border-white/10">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-surface text-muted dark:bg-white/5 dark:text-white/50">
                      <tr>
                        {['Fecha', 'Estación', 'Tipo', 'Cliente', 'Productos', 'Total', 'Pago', 'Estado', 'Repartidor'].map((h) => (
                          <th key={h} className={`px-4 py-3 font-medium ${h === 'Total' ? 'text-right' : ''}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100 dark:divide-white/10">
                      {state.rows.slice(0, PREVIEW).map((r) => (
                        <tr key={r.id} className="hover:bg-surface/60 dark:hover:bg-white/5">
                          <td className="whitespace-nowrap px-4 py-2.5 tabular-nums">{r.fechaRegistro}</td>
                          <td className="px-4 py-2.5">{r.estacion}</td>
                          <td className="px-4 py-2.5">{r.tipoVenta}</td>
                          <td className="px-4 py-2.5">{r.cliente}</td>
                          <td className="max-w-72 truncate px-4 py-2.5" title={r.productos}>
                            {r.productos}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">{fmtSoles(r.total)}</td>
                          <td className="px-4 py-2.5">{r.tipoPago}</td>
                          <td className="px-4 py-2.5">{r.estado}</td>
                          <td className="px-4 py-2.5">{r.repartidor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {state.total > PREVIEW && (
                    <p className="border-t border-navy-100 px-4 py-3 text-sm text-muted dark:border-white/10 dark:text-white/50">
                      Mostrando {PREVIEW} de {fmtNumber(state.total)} pedidos. Descarga el Excel o PDF para verlos todos.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
