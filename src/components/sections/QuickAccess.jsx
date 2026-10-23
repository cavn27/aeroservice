import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function QuickAccess({ items }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, align: 'start', containScroll: 'trimSnaps' })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback((api) => {
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    update(emblaApi)
    emblaApi.on('select', update).on('reInit', update).on('scroll', update)
  }, [emblaApi, update])

  return (
    <div className="container-page relative z-10 -mt-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl bg-white p-3 shadow-[0_24px_60px_-20px_rgb(16_24_64/0.35)] sm:p-4"
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <ul className="flex">
            {items.map(({ label, icon: Icon, href }) => (
              <li key={label} style={{ '--lg-basis': `${100 / Math.min(items.length, 8)}%` }} className="min-w-0 shrink-0 basis-[30%] sm:basis-[20%] lg:basis-(--lg-basis)">
                <a
                  href={href}
                  className="group flex h-full flex-col items-center gap-3 rounded-2xl px-2 py-4 text-center transition-colors hover:bg-surface"
                >
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-navy-50 to-navy-100 text-navy-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white group-hover:shadow-[0_10px_20px_-8px_rgb(227_6_19/0.6)]">
                    <Icon className="size-6" strokeWidth={1.8} />
                  </span>
                  <span className="text-sm font-medium leading-tight text-ink">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {canPrev && (
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-600 shadow-card ring-1 ring-navy-100"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        {canNext && (
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-600 shadow-card ring-1 ring-navy-100"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </motion.div>
    </div>
  )
}
