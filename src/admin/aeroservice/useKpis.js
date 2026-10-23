import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

// Mensajes claros para los errores esperables de la RPC portal_kpis.
function describeError(error) {
  if (error.code === 'PGRST202' || /could not find the function/i.test(error.message)) {
    return 'Falta instalar los KPIs en Supabase: ejecuta aeroservice/supabase/portal_kpis.sql en el SQL Editor.'
  }
  if (error.code === '42501') return 'Tu cuenta no tiene permiso para ver los KPIs.'
  if (error.code === '22023') return 'El rango de fechas no es válido (máximo 400 días).'
  return 'No se pudieron cargar los KPIs. Revisa tu conexión e intenta de nuevo.'
}

// Llama a la función portal_kpis(desde, hasta, local) de Supabase.
export function useKpis({ desde, hasta, local }) {
  const [state, setState] = useState({ data: null, error: null, loading: true, updatedAt: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true, error: null }))
    supabase
      .rpc('portal_kpis', { p_desde: desde, p_hasta: hasta, p_local: local || null })
      .then(({ data, error }) => {
        if (!active) return
        if (error) setState({ data: null, error: describeError(error), loading: false, updatedAt: null })
        else setState({ data, error: null, loading: false, updatedAt: new Date() })
      })
    return () => {
      active = false
    }
  }, [desde, hasta, local, reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])
  return { ...state, reload }
}
