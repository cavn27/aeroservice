import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, Play } from 'lucide-react'
import Reveal from '../../components/ui/Reveal'
import VideoModal from '../../components/ui/VideoModal'
import { moreRequirements, requirements, testimonials } from '../../data/distribuidores'

function Requirement({ text }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_6px_14px_-4px_rgb(16_185_129/0.6)]">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <span className="leading-relaxed text-muted">{text}</span>
    </li>
  )
}

export default function Application() {
  const [showAll, setShowAll] = useState(false)
  const [video, setVideo] = useState(false)

  return (
    <section id="postulacion" className="relative scroll-mt-24 overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-16 top-0 h-56 w-40 -skew-x-[38deg] bg-gradient-to-br from-navy-500 to-navy-500/0" />
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <h2 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">Postulación de distribuidores</h2>
            <p className="mt-8 text-lg font-semibold text-ink/80">Estos son algunos de los requisitos que se piden:</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-6 space-y-6">
              {requirements.map((r) => (
                <Requirement key={r} text={r} />
              ))}
            </ul>
            <AnimatePresence initial={false}>
              {showAll && (
                <motion.ul
                  key="more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6 overflow-hidden pt-6"
                >
                  {moreRequirements.map((r) => (
                    <Requirement key={r} text={r} />
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
            <button
              type="button"
              aria-expanded={showAll}
              onClick={() => setShowAll((s) => !s)}
              className="mt-10 inline-flex h-14 items-center gap-2 rounded-full border border-navy-600 px-8 font-semibold text-navy-600 transition hover:bg-navy-50"
            >
              {showAll ? 'Ver menos requisitos' : 'Conocer todos los requisitos'}
              <ChevronDown className={`size-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <button
            type="button"
            onClick={() => setVideo(true)}
            aria-label={`Reproducir: ${testimonials.title}`}
            className="group relative mx-auto block w-full max-w-xl"
          >
            <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-[2rem] shadow-card-hover">
              {testimonials.images.map((src, i) => (
                <div key={src} className="aspect-[4/3] overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  />
                </div>
              ))}
            </div>
            <span className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy-600 text-white ring-8 ring-white/70 transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 size-10 fill-current" />
            </span>
            <span className="mt-4 block text-center text-sm font-medium text-muted">{testimonials.title}</span>
          </button>
        </Reveal>
      </div>
      <VideoModal open={video} onClose={() => setVideo(false)} title={testimonials.title} embedUrl={testimonials.embedUrl} />
    </section>
  )
}
