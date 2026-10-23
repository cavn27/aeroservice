import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { applyFilters, COLUMNS, fetchNombres, toRow } from './reportData'

export const PAGE_SIZE = 25
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Búsqueda por cliente, teléfono, DNI, dirección o distrito; un UUID completo busca el pedido exacto.
// Se quitan los caracteres con significado especial en los filtros de PostgREST.
function applySearch(q, search) {
  const term = search.trim()
  if (!term) return q
  if (UUID.test(term)) return q.eq('id', term)
  const s = term.replace(/[,()*%\\:"']/g, ' ').replace(/\s+/g, ' ').trim()
  if (!s) return q
  const like = `*${s}*`
  return q.or(
    ['cliente_nombre', 'cliente_telefono', 'cliente_dni', 'direccion', 'distrito', 'motorizado_nombre'].map((c) => `${c}.ilike.${like}`).join(','),
  )
}

const TABS = ['', 'en_curso', 'entregado', 'rechazado']

// Lista paginada en el servidor (solo trae la página visible) + contadores por estado + Realtime.
export function usePedidos({ filters, search, page, ascending }) {
  const [state, setState] = useState({ rows: [], total: 0, counts: {}, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)
  const [live, setLive] = useState(false)
  const timer = useRef(null)

  const { desde, hasta, local, estado, canal, canjes } = filters

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))
    const base = { desde, hasta, local, canal, canjes: canjes === 'si' }
    const from = (page - 1) * PAGE_SIZE

    const list = applySearch(applyFilters(supabase.from('pedidos').select(COLUMNS, { count: 'exact' }), { ...base, estado }), search)
      .order('created_at', { ascending })
      .order('id', { ascending })
      .range(from, from + PAGE_SIZE - 1)

    // Contadores de cada pestaña con los mismos filtros (solo cuenta, sin traer filas).
    const counts = TABS.map((tab) =>
      applySearch(applyFilters(supabase.from('pedidos').select('id', { count: 'exact', head: true }), { ...base, estado: tab }), search),
    )

    Promise.all([list, fetchNombres(), ...counts])
      .then(([res, nombres, ...countRes]) => {
        if (!active) return
        const failed = [res, ...countRes].find((r) => r.error)
        if (failed) throw failed.error
        setState({
          rows: res.data.map((p) => toRow(p, nombres)),
          total: res.count ?? 0,
          counts: Object.fromEntries(TABS.map((t, i) => [t, countRes[i].count ?? 0])),
          loading: false,
          error: null,
        })
      })
      .catch(() => active && setState((s) => ({ ...s, loading: false, error: 'No se pudieron cargar los pedidos. Revisa tu conexión e intenta de nuevo.' })))
    return () => {
      active = false
    }
  }, [desde, hasta, local, estado, canal, canjes, search, page, ascending, reloadKey])

  // En vivo: un cambio en pedidos (que la RLS deje ver) recarga la página actual. Para no gastar datos de
  // más: (1) solo se escucha mientras la pestaña está visible (al volver, se recarga si pasó más de un
  // minuto), y (2) las recargas se espacian al menos 10 s, aunque lleguen muchos cambios seguidos.
  useEffect(() => {
    const MIN_ENTRE_RECARGAS = 10_000
    const VIEJO = 60_000
    let channel = null
    let ultima = Date.now()

    const recargar = () => {
      timer.current = null
      ultima = Date.now()
      setReloadKey((k) => k + 1)
    }
    const programar = () => {
      if (timer.current) return
      timer.current = setTimeout(recargar, Math.max(MIN_ENTRE_RECARGAS - (Date.now() - ultima), 1500))
    }
    const escuchar = () => {
      if (channel) return
      channel = supabase
        .channel('portal-pedidos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, programar)
        .subscribe((status) => setLive(status === 'SUBSCRIBED'))
    }
    const dejarDeEscuchar = () => {
      clearTimeout(timer.current)
      timer.current = null
      if (channel) supabase.removeChannel(channel)
      channel = null
      setLive(false)
    }
    const alCambiarVisibilidad = () => {
      if (document.visibilityState === 'visible') {
        escuchar()
        if (Date.now() - ultima > VIEJO) recargar()
      } else {
        dejarDeEscuchar()
      }
    }

    if (document.visibilityState === 'visible') escuchar()
    document.addEventListener('visibilitychange', alCambiarVisibilidad)
    return () => {
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
      dejarDeEscuchar()
    }
  }, [])

  return { ...state, live, reload: () => setReloadKey((k) => k + 1) }
}

// Un pedido suelto por ID (para abrir la ficha desde un enlace o desde un canje).
export async function fetchPedido(id) {
  const [{ data, error }, nombres] = await Promise.all([supabase.from('pedidos').select(COLUMNS).eq('id', id).maybeSingle(), fetchNombres()])
  if (error) throw error
  return data ? toRow(data, nombres) : null
}
