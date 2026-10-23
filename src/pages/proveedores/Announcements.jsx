import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, X } from 'lucide-react'
import SectionHeading from '../../components/ui/SectionHeading'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import { announcements } from '../../data/proveedores'

const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' })
const formatDate = (iso) => dateFormat.format(new Date(`${iso}T12:00:00`))

function Meta({ item }) {
  const alert = item.category === 'Alerta'
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={`rounded-lg px-2.5 py-1 font-medium ${alert ? 'bg-brand-50 text-brand-600' : 'bg-navy-50 text-navy-600'}`}>{item.category}</span>
      <time dateTime={item.date} className="text-muted">
        {formatDate(item.date)}
      </time>
    </div>
  )
}

function AnnouncementModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-navy-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-title"
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl sm:p-10"
            initial={{ y: 24, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar comunicado"
              className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-surface hover:bg-navy-50"
            >
              <X className="size-5" />
            </button>
            <div className="pr-12">
              <Meta item={item} />
            </div>
            <h3 id="announcement-title" className="mt-5 text-balance text-2xl font-bold leading-snug sm:text-3xl">
              {item.title}
            </h3>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              {item.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Announcements() {
  const [open, setOpen] = useState(null)

  return (
    <section id="comunicados" className="scroll-mt-24 bg-surface pb-24 pt-20 lg:pb-32">
      <div className="container-page">
        <SectionHeading eyebrow="Comunicados" title="Comunicados importantes" align="center" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {announcements.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <article className="group flex h-full flex-col rounded-3xl bg-white p-7 shadow-card ring-1 ring-navy-100/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <Meta item={a} />
                <h3 className="mt-5 text-xl font-semibold leading-snug">{a.title}</h3>
                <p className="mt-4 line-clamp-5 flex-1 leading-relaxed text-muted">{a.body.join(' ')}</p>
                <button
                  type="button"
                  onClick={() => setOpen(a)}
                  className="mt-6 inline-flex items-center gap-1.5 self-start font-semibold text-navy-600"
                >
                  Ver comunicado <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button variant="outline" href="#">
            Ir a todos los comunicados
          </Button>
        </div>
      </div>
      <AnnouncementModal item={open} onClose={() => setOpen(null)} />
    </section>
  )
}
