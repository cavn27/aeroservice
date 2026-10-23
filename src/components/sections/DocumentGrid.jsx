import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Download, FileText, Globe, Search } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

// Grilla de documentos descargables o enlaces externos.
// items: [{ title, href }]. kind: 'file' | 'link'. searchable muestra un buscador.
export default function DocumentGrid({ id, eyebrow, title, description, items, kind = 'file', searchable = false, className = '' }) {
  const [query, setQuery] = useState('')
  const isLink = kind === 'link'
  const Icon = isLink ? Globe : FileText
  const ActionIcon = isLink ? ArrowUpRight : Download

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((i) => i.title.toLowerCase().includes(q)) : items
  }, [items, query])

  return (
    <section id={id} className={`scroll-mt-24 py-24 lg:py-28 ${className}`}>
      <div className="container-page">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" />

        {searchable && (
          <Reveal className="mx-auto mt-10 max-w-md">
            <label className="relative block">
              <span className="sr-only">Buscar documento</span>
              <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar documento…"
                className="h-13 w-full rounded-full border border-navy-100 bg-white pl-13 pr-5 shadow-card outline-none transition focus:border-navy-500 focus:ring-4 focus:ring-navy-500/15"
              />
            </label>
          </Reveal>
        )}

        <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.a
                layout
                key={item.title}
                href={item.href}
                {...(isLink ? { target: '_blank', rel: 'noreferrer' } : {})}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group flex h-full items-start gap-5 rounded-3xl bg-white p-6 ring-1 ring-navy-100 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:ring-navy-200"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-navy-50 text-navy-600 transition-colors group-hover:bg-navy-600 group-hover:text-white">
                  <Icon className="size-7" strokeWidth={1.6} />
                </span>
                <span>
                  <span className="block font-semibold leading-snug text-ink">{item.title}</span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600">
                    {isLink ? 'Ir al sitio' : 'Descargar documento'}
                    <ActionIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && <p className="mt-10 text-center text-muted">No encontramos documentos que coincidan con “{query}”.</p>}
      </div>
    </section>
  )
}
