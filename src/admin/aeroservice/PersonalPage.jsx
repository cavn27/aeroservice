import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Eye, Pencil, Search, UserPlus, Users } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../auth/useAuth'
import { card, Skeleton } from '../ui'
import { fmtNumber } from '../format'
import { rolLabel } from './labels'
import { filterInput, useUrlFilters } from './filters'
import { fetchCupo, fetchStaff, nombreEstacion, PUNTOS, puntoDeLocal } from './staff'
import StaffForm from './StaffForm'

const ESTADOS = [
  ['', 'Activos'],
  ['desactivados', 'Desactivados'],
  ['todos', 'Todos'],
]

const normalize = (s) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

const fecha = new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: 'short', year: 'numeric' })

function CupoBar({ cupo }) {
  if (!cupo) return null
  const pct = Math.min((cupo.total / cupo.maximo) * 100, 100)
  return (
    <div className={`${card} min-w-64 p-4`} title="Límite de cuentas activas (lo fija el superadmin)">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted dark:text-white/60">Usuarios activos</span>
        <span className="font-semibold tabular-nums">
          {fmtNumber(cupo.total)} de {fmtNumber(cupo.maximo)}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--grid,#e8ebf3)] dark:bg-white/10">
        <div className={`h-full rounded-full ${cupo.lleno ? 'bg-brand-600' : 'bg-navy-600 dark:bg-navy-400'}`} style={{ width: `${pct}%` }} />
      </div>
      {cupo.lleno && <p className="mt-2 text-xs font-medium text-brand-600">Límite alcanzado: pide al superadmin que lo aumente.</p>}
    </div>
  )
}

export default function PersonalPage() {
  const { user } = useAuth()
  const canEdit = user?.role === 'administrador'
  const [f, update] = useUrlFilters(['estado', 'punto', 'q', 'persona'])
  const [state, setState] = useState({ staff: [], cupo: null, loading: true, error: null })
  const [text, setText] = useState(f.q)

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    Promise.all([fetchStaff(), canEdit ? fetchCupo() : null])
      .then(([staff, cupo]) => setState({ staff, cupo, loading: false, error: null }))
      .catch((e) => setState((s) => ({ ...s, loading: false, error: e.message })))
  }, [canEdit])

  useEffect(() => {
    load()
  }, [load])

  // Búsqueda con espera, guardada en la URL.
  useEffect(() => {
    const t = setTimeout(() => text !== f.q && update({ q: text }), 300)
    return () => clearTimeout(t)
  }, [text, f.q, update])

  const counts = useMemo(
    () => ({ '': state.staff.filter((p) => p.activo).length, desactivados: state.staff.filter((p) => !p.activo).length, todos: state.staff.length }),
    [state.staff],
  )

  const visible = useMemo(() => {
    const q = normalize(f.q)
    return state.staff.filter((p) => {
      if (f.estado === '' && !p.activo) return false
      if (f.estado === 'desactivados' && p.activo) return false
      if (f.punto && puntoDeLocal(p.local).id !== f.punto) return false
      if (!q) return true
      return normalize(`${p.nombres} ${p.apellidos} ${p.dni} ${p.telefono ?? ''}`).includes(q)
    })
  }, [state.staff, f.estado, f.punto, f.q])

  const editing = f.persona && f.persona !== 'nueva' ? state.staff.find((p) => p.id === f.persona) : null
  const drawerOpen = f.persona === 'nueva' || !!editing

  return (
    <div className="space-y-6">
      <title>Aeroservice | Personal</title>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-500 dark:text-navy-300">Aeroservice</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Personal</h1>
          <p className="mt-1 text-muted dark:text-white/60">
            {canEdit ? 'Crea cuentas, edita puestos, restablece contraseñas y desactiva accesos.' : 'Consulta del personal (tu cuenta es de solo lectura).'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CupoBar cupo={state.cupo} />
          {canEdit && (
            <button
              type="button"
              onClick={() => update({ persona: 'nueva' })}
              disabled={state.cupo?.lleno}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy-600 px-4 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60"
            >
              <UserPlus className="size-4" /> Nueva cuenta
            </button>
          )}
        </div>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-center gap-3 border-b border-navy-100 p-4 dark:border-white/10">
          <div role="tablist" aria-label="Estado de la cuenta" className="flex gap-1 rounded-xl bg-surface p-1 dark:bg-white/5">
            {ESTADOS.map(([v, l]) => (
              <button
                key={v}
                role="tab"
                type="button"
                aria-selected={f.estado === v}
                onClick={() => update({ estado: v })}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  f.estado === v ? 'bg-white text-ink shadow-sm dark:bg-navy-800 dark:text-white' : 'text-muted hover:text-ink dark:text-white/60 dark:hover:text-white'
                }`}
              >
                {l}
                <span className="rounded-full bg-navy-50 px-1.5 text-xs tabular-nums text-navy-600 dark:bg-white/10 dark:text-white/80">{fmtNumber(counts[v])}</span>
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="pers-punto">Punto de venta</label>
          <select id="pers-punto" value={f.punto} onChange={(e) => update({ punto: e.target.value })} className={filterInput}>
            <option value="">Todos los puntos de venta</option>
            {PUNTOS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <label className="relative block min-w-64 flex-1">
            <span className="sr-only">Buscar personal</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted dark:text-white/50" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Buscar por nombre, DNI o teléfono" className={`${filterInput} w-full pl-9`} />
          </label>
        </div>

        {state.error ? (
          <div role="alert" className="flex items-start gap-3 p-6 text-muted dark:text-white/60">
            <AlertTriangle className="size-5 shrink-0 text-amber-500" /> {state.error}
          </div>
        ) : state.loading && !state.staff.length ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-14 text-center text-muted dark:text-white/50">
            <Users className="mx-auto size-10 text-navy-200 dark:text-white/20" />
            <p className="mt-3">No hay personal con estos filtros.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-surface text-muted dark:bg-white/5 dark:text-white/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium">Puesto</th>
                  <th className="px-4 py-3 font-medium">Teléfono</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Alta</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 dark:divide-white/10">
                {visible.map((p) => {
                  const punto = puntoDeLocal(p.local)
                  return (
                    <tr key={p.id} className={`hover:bg-surface/60 dark:hover:bg-white/5 ${p.activo ? '' : 'opacity-60'}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium">
                          {p.nombres} {p.apellidos}
                        </p>
                        <p className="text-xs text-muted dark:text-white/50">DNI {p.dni}</p>
                      </td>
                      <td className="px-4 py-3">{rolLabel(p.rol)}</td>
                      <td className="px-4 py-3">
                        {punto.label}
                        {!punto.sinEstacion && p.local && <span className="text-muted dark:text-white/60"> · {nombreEstacion(p.local)}</span>}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{p.telefono}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            p.activo ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-navy-50 text-muted dark:bg-white/10 dark:text-white/60'
                          }`}
                        >
                          {p.activo ? 'Activo' : 'Desactivado'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted dark:text-white/60">{fecha.format(new Date(p.created_at))}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => update({ persona: p.id })}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-navy-100 px-2.5 py-1.5 text-xs font-semibold hover:bg-surface dark:border-white/10 dark:hover:bg-white/5"
                        >
                          {canEdit ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />} {canEdit ? 'Editar' : 'Ver'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={drawerOpen} onClose={() => update({ persona: '' })} variant="drawer" labelledBy="staff-title">
        {drawerOpen && (
          <div className="space-y-6">
            <div className="pr-12">
              <h2 id="staff-title" className="text-2xl font-bold tracking-tight">
                {editing ? `${editing.nombres} ${editing.apellidos}` : 'Nueva cuenta'}
              </h2>
              {editing && (
                <p className="mt-1 text-sm text-muted dark:text-white/60">
                  {rolLabel(editing.rol)} · DNI {editing.dni}
                </p>
              )}
            </div>
            <StaffForm key={f.persona} mode={editing ? 'edit' : 'create'} person={editing} canEdit={canEdit} onSaved={load} />
          </div>
        )}
      </Modal>
    </div>
  )
}
