import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' })
const formatDate = (iso) => dateFormat.format(new Date(`${iso}T12:00:00`))

function Meta({ item }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="rounded-lg bg-navy-50 px-2.5 py-1 font-medium text-navy-600">{item.category}</span>
      <time dateTime={item.date} className="text-muted">{formatDate(item.date)}</time>
    </div>
  )
}

const cardMotion = {
  layout: true,
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

export default function News({ items: news, categories: newsCategories, title = 'Lo último en Aerogas', id = 'noticias' }) {
  const [category, setCategory] = useState('Todas')

  const items = useMemo(() => {
    const list = category === 'Todas' ? news : news.filter((n) => n.category === category)
    return [...list].sort((a, b) => b.date.localeCompare(a.date))
  }, [category, news])

  const [featured, ...rest] = items

  return (
    <section id={id} className="scroll-mt-24 py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading eyebrow="Noticias" title={title} align="center" />

        <div role="tablist" aria-label="Categorías de noticias" className="mx-auto mt-10 flex max-w-full justify-start gap-1 overflow-x-auto no-scrollbar sm:justify-center">
          {newsCategories.map((c) => (
            <button
              key={c}
              role="tab"
              type="button"
              aria-selected={c === category}
              onClick={() => setCategory(c)}
              className={`relative shrink-0 px-4 py-3 text-[15px] transition-colors ${c === category ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}
            >
              {c}
              {c === category && (
                <motion.span layoutId="news-tab" className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-navy-600" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {featured && (
              <motion.a
                key={featured.title}
                href="#"
                {...cardMotion}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-100/60 transition-shadow hover:shadow-card-hover"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={featured.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <Meta item={featured} />
                  <h3 className="mt-4 text-balance text-2xl font-semibold leading-snug">{featured.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{featured.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-navy-600">
                    Leer noticia <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {rest.slice(0, 3).map((n) => (
                <motion.a
                  key={n.title}
                  href="#"
                  {...cardMotion}
                  className="group grid overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-100/60 transition-shadow hover:shadow-card-hover sm:grid-cols-[220px_1fr]"
                >
                  <div className="aspect-[16/9] overflow-hidden sm:aspect-auto">
                    <img src={n.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col p-6">
                    <Meta item={n} />
                    <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug">{n.title}</h3>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-navy-600">
                      Conoce más <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
            {rest.length === 0 && featured && (
              <div className="grid flex-1 place-items-center rounded-3xl border border-dashed border-navy-200 p-10 text-center text-muted">
                Pronto más noticias en esta categoría.
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" href="#">
            Ver todas las noticias
          </Button>
        </div>
      </div>
    </section>
  )
}
