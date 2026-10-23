import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, Ban, Banknote, Clock, Package, Receipt, RefreshCw, ShoppingBag, Store, Ticket, Truck } from 'lucide-react'
import { BarList, card, CardHeader, ChartTooltip, Skeleton, StatCard, vizVars } from '../ui'
import { fmtMinutes, fmtNumber, fmtPercent, fmtSoles, fmtSolesCompact, fmtSolesRound, pctChange } from '../format'
import { localLabel, pagoLabel, productoLabel } from './labels'
import { formatDay, formatRange } from './periods'
import PeriodFilters from './PeriodFilters'
import { useUrlFilters } from './filters'
import { useKpis } from './useKpis'

const monthFmt = new Intl.DateTimeFormat('es-PE', { month: 'short', year: '2-digit', timeZone: 'UTC' })

// Con rangos largos, los ingresos diarios se agrupan por mes para que el gráfico se pueda leer.
function groupSeries(porDia) {
  if (porDia.length <= 62) return porDia.map((d) => ({ label: d.fecha, ingresos: Number(d.ingresos), entregados: d.entregados }))
  const byMonth = new Map()
  for (const d of porDia) {
    const key = d.fecha.slice(0, 7)
    const prev = byMonth.get(key) ?? { label: `${key}-01`, ingresos: 0, entregados: 0, month: true }
    prev.ingresos += Number(d.ingresos)
    prev.entregados += d.entregados
    byMonth.set(key, prev)
  }
  return [...byMonth.values()]
}

const seriesLabel = (row) => (row?.month ? monthFmt.format(new Date(`${row.label}T00:00:00Z`)) : formatDay(row?.label ?? ''))

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <Skeleton className="h-80" />
    </div>
  )
}

export default function ResumenPage() {
  const [{ desde, hasta, local }, update] = useUrlFilters()
  const { data, error, loading, updatedAt, reload } = useKpis({ desde, hasta, local })

  const series = useMemo(() => (data ? groupSeries(data.por_dia) : []), [data])

  const r = data?.resumen
  const reg = data?.registro
  const prev = data?.previo
  const tasaRechazo = reg?.registrados ? (reg.rechazados / reg.registrados) * 100 : 0
  const tasaRechazoPrev = prev?.registrados ? (prev.rechazados / prev.registrados) * 100 : null

  return (
    <div className={`space-y-6 ${vizVars}`}>
      <title>Aeroservice | Resumen</title>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500 dark:text-navy-300">Aeroservice</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Resumen de ventas</h1>
          <p className="mt-1 text-muted dark:text-white/60">
            {formatRange(desde, hasta)} · {local ? localLabel(local) : 'Todas las sedes'}
          </p>
        </div>
      </div>

      <PeriodFilters
        desde={desde}
        hasta={hasta}
        local={local}
        onChange={update}
        actions={
          <>
            {updatedAt && (
              <span className="hidden text-xs text-muted sm:inline dark:text-white/50">
                Actualizado {updatedAt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              type="button"
              onClick={reload}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-navy-100 px-3 text-sm font-medium hover:bg-surface disabled:opacity-60 dark:border-white/10 dark:hover:bg-white/5"
            >
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
            </button>
          </>
        }
      />

      {error ? (
        <div role="alert" className={`${card} flex items-start gap-4 p-6`}>
          <AlertTriangle className="size-6 shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold">No se pudieron mostrar los KPIs</p>
            <p className="mt-1 text-muted dark:text-white/60">{error}</p>
          </div>
        </div>
      ) : !data ? (
        <LoadingState />
      ) : (
        <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Ingresos" value={fmtSoles(r.ingresos)} icon={Banknote} delta={pctChange(r.ingresos, prev.ingresos)} hint="Pedidos entregados, después del vale FISE" />
            <StatCard label="Pedidos entregados" value={fmtNumber(r.entregados)} icon={Package} delta={pctChange(r.entregados, prev.entregados)} />
            <StatCard label="Ticket promedio" value={fmtSoles(r.ticket_promedio)} icon={Receipt} delta={pctChange(r.ticket_promedio, prev.ticket_promedio)} />
            <StatCard label="Unidades vendidas" value={fmtNumber(r.unidades)} icon={ShoppingBag} delta={pctChange(r.unidades, prev.unidades)} />
            <StatCard
              label="Tiempo promedio de entrega"
              value={fmtMinutes(r.tiempo_entrega_min)}
              icon={Clock}
              hint={r.tiempo_aceptacion_min != null ? `Aceptación promedio: ${fmtMinutes(r.tiempo_aceptacion_min)} · solo delivery` : 'Solo pedidos delivery'}
            />
            <StatCard
              label="Tasa de rechazo"
              value={fmtPercent(tasaRechazo)}
              icon={Ban}
              delta={tasaRechazoPrev == null ? null : pctChange(tasaRechazo, tasaRechazoPrev)}
              inverse
              hint={`${fmtNumber(reg.rechazados)} de ${fmtNumber(reg.registrados)} registrados · ${fmtNumber(reg.en_curso)} en curso`}
            />
          </div>

          <div className={`${card} p-6`}>
            <CardHeader title="Ingresos por día" subtitle={series[0]?.month ? 'Agrupado por mes' : 'Pedidos entregados cada día'} />
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <BarChart data={series} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--grid)" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--axis)', fontSize: 12 }}
                    tickFormatter={(l) => seriesLabel(series.find((s) => s.label === l))}
                    minTickGap={16}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--axis)', fontSize: 12 }} tickFormatter={fmtSolesCompact} width={70} />
                  <Tooltip
                    cursor={{ fill: 'var(--grid)', radius: 6 }}
                    content={<ChartTooltip format={fmtSoles} labelFormat={(l) => seriesLabel(series.find((s) => s.label === l))} />}
                  />
                  <Bar dataKey="ingresos" name="Ingresos" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className={`${card} p-6`}>
              <CardHeader title="Ventas por sede" subtitle="Ingresos de pedidos entregados" />
              <div className="mt-6">
                <BarList
                  items={data.por_local.map((l) => ({ label: localLabel(l.local), value: Number(l.ingresos), detail: `${fmtNumber(l.entregados)} pedidos` }))}
                  format={fmtSolesRound}
                />
              </div>
            </div>
            <div className={`${card} p-6`}>
              <CardHeader title="Productos" subtitle="Unidades vendidas" />
              <div className="mt-6">
                <BarList
                  items={data.por_producto.map((p) => ({
                    label: productoLabel(p.producto, p.valvula),
                    value: Number(p.unidades),
                    detail: `${fmtSolesRound(p.ingresos)} antes del vale`,
                  }))}
                  format={(v) => `${fmtNumber(v)} u.`}
                />
              </div>
            </div>
            <div className={`${card} p-6`}>
              <CardHeader title="Medios de pago" subtitle="Pagos mixtos repartidos en su método real" />
              <div className="mt-6">
                <BarList items={data.por_pago.map((p) => ({ label: pagoLabel(p.metodo), value: Number(p.monto) }))} format={fmtSolesRound} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-12">
            <div className={`${card} p-6 xl:col-span-8`}>
              <CardHeader title="Pedidos por hora" subtitle="Pedidos registrados según la hora (Perú)" />
              <div className="mt-4 h-60">
                <ResponsiveContainer>
                  <BarChart data={data.por_hora} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--grid)" />
                    <XAxis dataKey="hora" tickLine={false} axisLine={false} tick={{ fill: 'var(--axis)', fontSize: 12 }} tickFormatter={(h) => `${h}h`} interval={1} />
                    <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: 'var(--axis)', fontSize: 12 }} width={48} />
                    <Tooltip cursor={{ fill: 'var(--grid)', radius: 6 }} content={<ChartTooltip format={fmtNumber} labelFormat={(h) => `${h}:00 – ${h}:59`} />} />
                    <Bar dataKey="pedidos" name="Pedidos" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={`${card} space-y-5 p-6 xl:col-span-4`}>
              <CardHeader title="Canales y subsidios" />
              <dl className="grid grid-cols-2 gap-4">
                {[
                  { icon: Truck, label: 'Delivery', value: fmtSolesRound(r.delivery_ingresos), sub: `${fmtNumber(r.delivery_cantidad)} pedidos` },
                  { icon: Store, label: 'Mostrador', value: fmtSolesRound(r.mostrador_ingresos), sub: `${fmtNumber(r.mostrador_cantidad)} ventas` },
                  { icon: Ticket, label: 'Vale FISE', value: fmtSolesRound(r.vales_monto), sub: `${fmtNumber(r.vales_cantidad)} vales` },
                  { icon: RefreshCw, label: 'Canjes', value: fmtNumber(data.canjes), sub: 'No suman a ingresos' },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="rounded-2xl bg-surface p-4 dark:bg-white/5">
                    <dt className="flex items-center gap-2 text-sm text-muted dark:text-white/60">
                      <Icon className="size-4" /> {label}
                    </dt>
                    <dd className="mt-2 text-lg font-bold tabular-nums">{value}</dd>
                    <dd className="text-xs text-muted dark:text-white/50">{sub}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-12">
            <div className={`${card} overflow-hidden xl:col-span-8`}>
              <div className="p-6 pb-4">
                <CardHeader title="Repartidores" subtitle="Top 10 por entregas en el periodo" />
              </div>
              {data.repartidores.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="border-y border-navy-100 text-muted dark:border-white/10 dark:text-white/50">
                      <tr>
                        <th className="px-6 py-3 font-medium">#</th>
                        <th className="px-6 py-3 font-medium">Repartidor</th>
                        <th className="px-6 py-3 text-right font-medium">Entregas</th>
                        <th className="px-6 py-3 text-right font-medium">Ingresos</th>
                        <th className="px-6 py-3 text-right font-medium">Tiempo prom.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100 dark:divide-white/10">
                      {data.repartidores.map((m, i) => (
                        <tr key={`${m.nombre}-${i}`} className="hover:bg-surface/60 dark:hover:bg-white/5">
                          <td className="px-6 py-3 text-muted dark:text-white/50">{i + 1}</td>
                          <td className="px-6 py-3 font-medium">{m.nombre}</td>
                          <td className="px-6 py-3 text-right tabular-nums">{fmtNumber(m.entregas)}</td>
                          <td className="px-6 py-3 text-right tabular-nums">{fmtSolesRound(m.ingresos)}</td>
                          <td className="px-6 py-3 text-right tabular-nums">{fmtMinutes(m.tiempo_entrega_min)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-6 pb-6 text-sm text-muted dark:text-white/50">Sin entregas de repartidores en este periodo.</p>
              )}
            </div>
            <div className={`${card} p-6 xl:col-span-4`}>
              <CardHeader title="Distritos con más pedidos" subtitle="Delivery entregado" />
              <div className="mt-6">
                <BarList
                  items={data.top_distritos.map((d) => ({ label: d.distrito, value: Number(d.entregados), detail: fmtSolesRound(d.ingresos) }))}
                  format={(v) => `${fmtNumber(v)} pedidos`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
