import { ArrowDown, ArrowUp, CircleCheck, CircleX, Clock, Minus, Truck } from 'lucide-react'

// Piezas visuales compartidas del panel administrativo.

// Colores de series: paleta categórica validada (slot 1 y 2) en claro y oscuro, más grilla y ejes.
export const vizVars =
  '[--series-1:#2a78d6] [--series-2:#eb6834] [--grid:#e8ebf3] [--axis:#5b6178] dark:[--series-1:#3987e5] dark:[--series-2:#d95926] dark:[--grid:rgb(255_255_255/0.08)] dark:[--axis:rgb(255_255_255/0.55)]'

export const card = 'rounded-3xl border border-navy-100 bg-white dark:border-white/10 dark:bg-navy-900'

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted dark:text-white/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// Variación vs. periodo anterior. inverse: cuando subir es malo (p. ej. tasa de rechazo).
export function DeltaBadge({ value, inverse = false }) {
  if (value == null || !Number.isFinite(value)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted dark:bg-white/5 dark:text-white/50" title="Sin datos del periodo anterior">
        <Minus className="size-3.5" /> s/d
      </span>
    )
  }
  const up = value >= 0
  const good = inverse ? !up : up
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        good ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-500'
      }`}
      title="Frente al periodo anterior de igual duración"
    >
      {up ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export function StatCard({ label, value, icon: Icon, delta, inverse, hint }) {
  return (
    <div className={`${card} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-surface text-ink dark:bg-white/5 dark:text-white">
          <Icon className="size-5" />
        </span>
        {delta !== undefined && <DeltaBadge value={delta} inverse={inverse} />}
      </div>
      <p className="mt-4 text-sm text-muted dark:text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted dark:text-white/50">{hint}</p>}
    </div>
  )
}

export function ChartTooltip({ active, payload, label, format = (v) => v, labelFormat = (l) => l }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-navy-100 bg-white px-3 py-2 text-sm shadow-card dark:border-white/10 dark:bg-navy-800">
      <p className="font-semibold text-ink dark:text-white">{labelFormat(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="mt-1 flex items-center gap-2 text-muted dark:text-white/70">
          <span className="size-2.5 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-ink dark:text-white">{format(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

// Lista de barras horizontales (una serie, valores rotulados directamente).
export function BarList({ items, format, emptyText = 'Sin datos en este periodo.' }) {
  if (!items.length) return <p className="py-6 text-center text-sm text-muted dark:text-white/50">{emptyText}</p>
  const max = Math.max(...items.map((i) => i.value), 0) || 1
  const total = items.reduce((s, i) => s + i.value, 0) || 1
  return (
    <ul className="space-y-4">
      {items.map((i) => (
        <li key={i.label} title={`${i.label}: ${format(i.value)}`}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium">{i.label}</span>
            <span className="shrink-0 tabular-nums text-muted dark:text-white/60">
              {format(i.value)} · <span className="font-semibold text-ink dark:text-white">{((i.value / total) * 100).toFixed(0)}%</span>
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--grid)]">
            <div className="h-full rounded-full bg-[var(--series-1)] transition-[width] duration-500" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
          {i.detail && <p className="mt-1 text-xs text-muted dark:text-white/50">{i.detail}</p>}
        </li>
      ))}
    </ul>
  )
}

// Estado del pedido: color + ícono + texto (nunca solo color).
const ESTADO_STYLES = {
  pendiente: { label: 'Pendiente', icon: Clock, className: 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
  aceptado: { label: 'Aceptado', icon: Truck, className: 'bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300' },
  entregado: { label: 'Entregado', icon: CircleCheck, className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' },
  rechazado: { label: 'Rechazado', icon: CircleX, className: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-500' },
}

export function EstadoBadge({ estado }) {
  const s = ESTADO_STYLES[estado] ?? { label: estado, icon: Clock, className: 'bg-surface text-muted' }
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}>
      <s.icon className="size-3.5" /> {s.label}
    </span>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-navy-50 dark:bg-white/5 ${className}`} />
}
