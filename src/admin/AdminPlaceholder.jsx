import { useLocation } from 'react-router'
import { Construction } from 'lucide-react'
import { findNavItem } from './adminNav'

// Módulos del portal aún no construidos.
export default function AdminPlaceholder() {
  const { pathname } = useLocation()
  const item = findNavItem(pathname)
  const title = item?.label ?? 'Módulo'
  return (
    <div className="grid min-h-[60vh] place-items-center rounded-3xl border border-dashed border-navy-200 bg-white p-10 text-center dark:border-white/15 dark:bg-navy-900">
      <title>{`Aerogas | ${title}`}</title>
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-navy-50 text-navy-600 dark:bg-white/10 dark:text-white">
          <Construction className="size-8" />
        </span>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-muted dark:text-white/60">Este módulo está en construcción.</p>
      </div>
    </div>
  )
}
