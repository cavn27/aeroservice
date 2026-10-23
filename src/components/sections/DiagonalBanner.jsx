import { ArrowRight, Play } from 'lucide-react'
import Reveal from '../ui/Reveal'

// Banner azul con imagen cortada en diagonal a la derecha.
// action: { label, href } o { label, onClick }. onPlay muestra un botón de reproducir sobre la imagen.
export default function DiagonalBanner({ id, title, description, image, action, onPlay }) {
  const actionClass = 'group mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-white/70 px-6 font-semibold text-white transition hover:bg-white hover:text-navy-700'
  const actionContent = (
    <>
      {action.label} <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
    </>
  )

  return (
    <section id={id} className="relative isolate scroll-mt-24 overflow-hidden bg-gradient-to-r from-navy-800 via-navy-600 to-navy-500">
      <div
        className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] md:block"
        style={{ clipPath: 'polygon(28% 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <img src={image} alt="" loading="lazy" className="size-full object-cover" />
        <div className="absolute inset-0 bg-navy-900/20" />
      </div>
      {/* Línea de acento sobre el corte diagonal */}
      <div
        className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] bg-gradient-to-b from-white/0 via-white/60 to-white/0 md:block"
        style={{ clipPath: 'polygon(27% 0, 28% 0, 1% 100%, 0 100%)' }}
      />
      <div className="container-page flex min-h-[420px] items-center py-16">
        <Reveal className="max-w-xl md:max-w-md lg:max-w-xl">
          <h2 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">{title}</h2>
          {description && <p className="mt-4 text-lg text-white/85">{description}</p>}
          {action.href ? (
            <a href={action.href} className={actionClass}>
              {actionContent}
            </a>
          ) : (
            <button type="button" onClick={action.onClick} className={actionClass}>
              {actionContent}
            </button>
          )}
        </Reveal>
        {onPlay && (
          <button
            type="button"
            onClick={onPlay}
            aria-label="Reproducir video"
            className="absolute right-[18%] top-1/2 hidden size-24 -translate-y-1/2 place-items-center rounded-full bg-brand-600 text-white shadow-[0_0_0_12px_rgb(227_6_19/0.25)] transition-transform hover:scale-110 md:grid"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-600/40" />
            <Play className="relative ml-1 size-10 fill-current" />
          </button>
        )}
      </div>
    </section>
  )
}
