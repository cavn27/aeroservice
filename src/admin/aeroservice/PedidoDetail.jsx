import { useEffect, useState } from 'react'
import { Check, Copy, LoaderCircle, MapPin, MessageCircle, Phone, RefreshCw } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { EstadoBadge } from '../ui'
import { fmtMinutes, fmtSoles } from '../format'
import { itemNombre } from './labels'
import { fetchPedido } from './usePedidos'
import { formatFechaHora } from './reportData'

const minutesBetween = (a, b) => (a && b ? (new Date(b) - new Date(a)) / 60000 : null)

// Teléfono peruano para WhatsApp: 9 dígitos de celular → 51 + número.
const waNumber = (tel) => {
  const digits = (tel ?? '').replace(/\D/g, '')
  if (digits.length === 9) return `51${digits}`
  return digits.length >= 11 ? digits : null
}

function Section({ title, children }) {
  return (
    <section className="border-t border-navy-100 pt-5 dark:border-white/10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted dark:text-white/50">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Field({ label, children }) {
  if (children == null || children === '') return null
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <dt className="text-muted dark:text-white/60">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  )
}

function Timeline({ r }) {
  const p = r.raw
  const steps = [
    { label: 'Registrado', when: r.fechaRegistro, who: r.registradoPor, done: true },
    !p.es_venta_estacion && !(p.estado === 'rechazado' && !p.aceptado_at) && { label: 'Aceptado', when: r.fechaAceptado, who: r.repartidor, done: !!p.aceptado_at },
    p.estado === 'rechazado'
      ? { label: 'Rechazado', when: formatFechaHora(p.rechazado_at), who: p.motivo_rechazo, done: true, bad: true }
      : { label: p.es_venta_estacion ? 'Venta en mostrador' : 'Entregado', when: r.fechaEntregado, who: p.codigo_vale ? `Vale ${p.codigo_vale}` : '', done: !!p.entregado_at },
  ].filter(Boolean)
  return (
    <ol className="space-y-4">
      {steps.map((s) => (
        <li key={s.label} className="flex gap-3">
          <span
            className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white ${
              !s.done ? 'bg-navy-100 dark:bg-white/10' : s.bad ? 'bg-brand-600' : 'bg-emerald-500'
            }`}
          >
            {s.done && <Check className="size-3.5" strokeWidth={3} />}
          </span>
          <div className="text-sm">
            <p className={`font-semibold ${s.done ? '' : 'text-muted dark:text-white/50'}`}>{s.label}</p>
            <p className="text-muted dark:text-white/60">{s.done ? [s.when, s.who].filter(Boolean).join(' · ') : 'Pendiente'}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function PedidoDetail({ id, initial, onClose, onOpen }) {
  const [state, setState] = useState({ row: initial ?? null, loading: !initial, error: null })
  const [copied, setCopied] = useState(false)

  // Si el pedido no está en la página visible (enlace directo o canje), se busca por ID.
  useEffect(() => {
    if (!id || initial) return
    let active = true
    fetchPedido(id)
      .then((row) => active && setState({ row, loading: false, error: row ? null : 'No se encontró el pedido.' }))
      .catch(() => active && setState({ row: null, loading: false, error: 'No se pudo cargar el pedido.' }))
    return () => {
      active = false
    }
  }, [id, initial])

  const r = state.row
  const p = r?.raw
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(r.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* el portapapeles puede no estar disponible */
    }
  }
  const wa = r && waNumber(r.telefono)

  return (
    <Modal open={!!id} onClose={onClose} variant="drawer" labelledBy="pedido-title">
      {state.loading ? (
        <div className="grid h-64 place-items-center text-muted">
          <LoaderCircle className="size-8 animate-spin" />
        </div>
      ) : !r ? (
        <p className="pt-10 text-muted">{state.error}</p>
      ) : (
        <div className="space-y-6">
          <div className="pr-12">
            <div className="flex flex-wrap items-center gap-2">
              <EstadoBadge estado={p.estado} />
              <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium dark:bg-white/10">{r.tipoVenta}</span>
              {p.es_canje && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <RefreshCw className="size-3.5" /> Canje
                </span>
              )}
            </div>
            <h2 id="pedido-title" className="mt-4 text-2xl font-bold tracking-tight">
              {r.cliente}
            </h2>
            <p className="mt-1 text-sm text-muted dark:text-white/60">
              {r.estacion} · {r.fechaRegistro}
            </p>
            <button type="button" onClick={copyId} className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink dark:text-white/50 dark:hover:text-white" title="Copiar ID">
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              <span className="font-mono">{r.id}</span>
            </button>
          </div>

          <Section title="Cliente">
            <dl>
              <Field label="DNI">{r.dni}</Field>
              <Field label="Teléfono">{r.telefono}</Field>
              <Field label="Dirección">{r.direccion}</Field>
              <Field label="Distrito">{r.distrito}</Field>
              <Field label="Tipo de negocio">{r.tipoNegocio}</Field>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.telefono && (
                <a href={`tel:${r.telefono.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 rounded-full border border-navy-100 px-3 py-1.5 text-sm font-medium hover:bg-surface dark:border-white/10 dark:hover:bg-white/5">
                  <Phone className="size-4" /> Llamar
                </a>
              )}
              {wa && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-navy-100 px-3 py-1.5 text-sm font-medium hover:bg-surface dark:border-white/10 dark:hover:bg-white/5">
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              )}
              {r.direccion && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.direccion}, ${r.distrito}, Lambayeque, Perú`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-navy-100 px-3 py-1.5 text-sm font-medium hover:bg-surface dark:border-white/10 dark:hover:bg-white/5"
                >
                  <MapPin className="size-4" /> Ver en el mapa
                </a>
              )}
            </div>
          </Section>

          <Section title="Productos">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-navy-100 dark:divide-white/10">
                {r.items.map((i, idx) => (
                  <tr key={idx}>
                    <td className="py-2 pr-3 tabular-nums">{i.cantidad} ×</td>
                    <td className="py-2">
                      {itemNombre(i)}
                      {i.tipo_producto === 'combo' && i.precio_balon != null && (
                        <span className="block text-xs text-muted dark:text-white/50">
                          Balón {fmtSoles(i.precio_balon)} + Agua {fmtSoles(i.precio_bidon)}
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-right text-muted tabular-nums dark:text-white/60">{fmtSoles(i.precio_unidad)}</td>
                    <td className="py-2 pl-3 text-right font-medium tabular-nums">{fmtSoles(Number(i.precio_unidad) * Number(i.cantidad))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-3 border-t border-navy-100 pt-3 dark:border-white/10">
              {p.con_vale && <Field label={`Vale FISE${p.codigo_vale ? ` (${p.codigo_vale})` : ''}`}>− {fmtSoles(r.descuentoVale)}</Field>}
              <div className="flex justify-between pt-1 text-base font-bold">
                <span>Total</span>
                <span className="tabular-nums">{fmtSoles(r.total)}</span>
              </div>
            </dl>
          </Section>

          <Section title="Pago">
            <dl>
              <Field label="Método">{r.tipoPago}</Field>
              {p.tipo_pago === 'mixto' &&
                Object.entries(r.montos)
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => (
                    <Field key={k} label={`  ${k[0].toUpperCase()}${k.slice(1)}`}>
                      {fmtSoles(v)}
                    </Field>
                  ))}
              {r.vuelto > 0 && <Field label="Vuelto">{fmtSoles(r.vuelto)}</Field>}
            </dl>
          </Section>

          <Section title="Seguimiento">
            <Timeline r={r} />
            {!p.es_venta_estacion && p.entregado_at && (
              <p className="mt-4 rounded-xl bg-surface px-3 py-2 text-sm dark:bg-white/5">
                Aceptado en {fmtMinutes(minutesBetween(p.created_at, p.aceptado_at))} · entregado en {fmtMinutes(minutesBetween(p.created_at, p.entregado_at))}
              </p>
            )}
          </Section>

          {(r.comentario || p.es_canje) && (
            <Section title="Notas">
              {r.comentario && <p className="text-sm">{r.comentario}</p>}
              {p.es_canje && (
                <p className="mt-2 text-sm">
                  Canje: {r.motivoCanje}
                  {p.pedido_origen_id && (
                    <button type="button" onClick={() => onOpen(p.pedido_origen_id)} className="ml-2 font-semibold text-navy-600 hover:underline dark:text-navy-300">
                      Ver pedido original
                    </button>
                  )}
                </p>
              )}
            </Section>
          )}
        </div>
      )}
    </Modal>
  )
}
