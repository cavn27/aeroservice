import { useState } from 'react'
import { Play } from 'lucide-react'
import SectionHeading from '../../components/ui/SectionHeading'
import Reveal from '../../components/ui/Reveal'
import VideoModal from '../../components/ui/VideoModal'
import { videos } from '../../data/proveedores'

export default function Videos() {
  const [current, setCurrent] = useState(null)

  return (
    <section id="videos" className="scroll-mt-24 bg-surface py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Tutoriales"
          title="Videos para proveedores"
          description="Aprende paso a paso a usar el portal y nuestros procesos."
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {videos.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 0.08}>
              <button
                type="button"
                onClick={() => setCurrent(v)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white text-left shadow-card ring-1 ring-navy-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={v.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-navy-950/25 transition-colors group-hover:bg-navy-950/40" />
                  <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy-600 text-white ring-4 ring-white/40 transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-0.5 size-7 fill-current" />
                  </span>
                </div>
                <div className="flex flex-1 items-start justify-between gap-3 p-6">
                  <h3 className="text-lg font-semibold leading-snug">{v.title}</h3>
                  <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-600">Video</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <VideoModal open={!!current} onClose={() => setCurrent(null)} title={current?.title} embedUrl={current?.embedUrl} />
    </section>
  )
}
