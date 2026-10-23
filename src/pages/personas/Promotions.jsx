import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react'
import SectionHeading from '../../components/ui/SectionHeading'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import { promotions } from '../../data/personas'

export default function Promotions() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])
  const [selected, setSelected] = useState(0)
  const [snaps, setSnaps] = useState([])

  const onSelect = useCallback((api) => setSelected(api.selectedScrollSnap()), [])

  useEffect(() => {
    if (!emblaApi) return
    setSnaps(emblaApi.scrollSnapList())
    onSelect(emblaApi)
    emblaApi.on('select', onSelect).on('reInit', (api) => {
      setSnaps(api.scrollSnapList())
      onSelect(api)
    })
  }, [emblaApi, onSelect])

  return (
    <section id="promociones" className="scroll-mt-24 bg-surface py-24 lg:py-28">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Promociones"
            title="Ahorra en cada recarga"
            description="Conoce las novedades y sorpresas que Aerogas tiene para ti."
          />
          <Reveal>
            <Button variant="outline" href="#" className="shrink-0">
              Ver todas
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <div className="-mx-3 overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {promotions.map((p) => (
                <div key={p.title} className="min-w-0 shrink-0 basis-[88%] px-3 sm:basis-1/2 lg:basis-1/3">
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-100/60 transition-shadow duration-300 hover:shadow-card-hover">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
                      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm">
                        <CalendarDays className="size-4 text-brand-600" /> {p.badge}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-semibold">{p.title}</h3>
                      <p className="mt-3 flex-1 leading-relaxed text-muted">{p.description}</p>
                      <a href="#" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-navy-600">
                        Conocer más <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Promoción anterior"
              onClick={() => emblaApi?.scrollPrev()}
              className="grid size-12 place-items-center rounded-full border border-navy-600 text-navy-600 transition hover:bg-navy-600 hover:text-white"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Promoción siguiente"
              onClick={() => emblaApi?.scrollNext()}
              className="grid size-12 place-items-center rounded-full border border-navy-600 text-navy-600 transition hover:bg-navy-600 hover:text-white"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
          <div className="flex gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir a la promoción ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === selected ? 'w-8 bg-navy-600' : 'w-2 bg-navy-200 hover:bg-navy-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
