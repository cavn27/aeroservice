import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import Button from '../ui/Button'

const DURATION = 7000

export default function Hero({ slides, secondaryCta }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const slide = slides[index]

  const go = useCallback((dir) => setIndex((i) => (i + dir + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => go(1), DURATION)
    return () => clearTimeout(id)
  }, [index, paused, go])

  return (
    <section aria-roledescription="carrusel" aria-label="Destacados" className="relative isolate overflow-hidden bg-navy-950">
      <div className="relative flex min-h-[680px] lg:min-h-[760px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={slide.image}
              alt=""
              className="size-full object-cover"
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: DURATION / 1000 + 1, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Capas de color para legibilidad y marca */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-navy-950/70 to-transparent" />

        <div className="container-page relative flex flex-col justify-center pb-40 pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="max-w-2xl"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              {[
                <span key="e" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur">
                  <span className="size-1.5 rounded-full bg-brand-500" /> {slide.eyebrow}
                </span>,
                <h1 key="t" className="mt-6 text-balance text-[2.6rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>,
                <p key="d" className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/80 sm:text-xl">
                  {slide.description}
                </p>,
                <div key="c" className="mt-10 flex flex-wrap gap-3">
                  <Button variant="brand" size="lg" href={slide.cta.href}>
                    {slide.cta.label} <ArrowRight className="size-5" />
                  </Button>
                  {secondaryCta && (
                    <Button variant="ghostWhite" size="lg" href={secondaryCta.href} className="backdrop-blur">
                      {secondaryCta.label}
                    </Button>
                  )}
                </div>,
              ].map((el) => (
                <motion.div
                  key={el.key}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                    exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
                  }}
                >
                  {el}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Controles */}
          <div className="mt-12 flex items-center gap-3">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => go(-1)}
              className="grid size-11 place-items-center rounded-full bg-white text-navy-700 transition hover:scale-105"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => go(1)}
              className="grid size-11 place-items-center rounded-full bg-white text-navy-700 transition hover:scale-105"
            >
              <ArrowRight className="size-5" />
            </button>
            <div className="ml-3 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Ir a ${s.eyebrow}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`relative h-2 overflow-hidden rounded-full bg-white/35 transition-all duration-500 ${i === index ? 'w-12' : 'w-2 hover:bg-white/60'}`}
                >
                  {i === index && (
                    <motion.span
                      key={`${s.id}-${paused}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-white"
                      initial={{ width: paused ? '100%' : '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: paused ? 0 : DURATION / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label={paused ? 'Reanudar' : 'Pausar'}
              onClick={() => setPaused((p) => !p)}
              className="ml-1 grid size-8 place-items-center rounded-full text-white/70 hover:text-white"
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
