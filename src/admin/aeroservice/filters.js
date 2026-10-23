import { useSearchParams } from 'react-router'
import { presetRange } from './periods'

export const filterInput =
  'h-10 rounded-xl border border-navy-100 bg-white px-3 text-sm outline-none focus:border-navy-500 focus:ring-4 focus:ring-navy-500/15 dark:border-white/10 dark:bg-navy-900 dark:[color-scheme:dark]'

// Filtros guardados en la URL (?desde=&hasta=&local=…), así un enlace conserva la vista.
// extra: nombres de parámetros adicionales que la página quiera mantener.
export function useUrlFilters(extra = []) {
  const [params, setParams] = useSearchParams()
  const fallback = presetRange('mes')
  const values = {
    desde: params.get('desde') ?? fallback.desde,
    hasta: params.get('hasta') ?? fallback.hasta,
    local: params.get('local') ?? '',
    ...Object.fromEntries(extra.map((k) => [k, params.get(k) ?? ''])),
  }
  const update = (patch) => {
    const next = { ...values, ...patch }
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(next)) if (v) sp.set(k, v)
    setParams(sp, { replace: true })
  }
  return [values, update]
}
