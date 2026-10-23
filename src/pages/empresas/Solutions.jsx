import { ArrowRight } from 'lucide-react'
import SectionHeading from '../../components/ui/SectionHeading'
import Reveal from '../../components/ui/Reveal'
import { solutions } from '../../data/empresas'

export default function Solutions() {
  return (
    <section id="soluciones" className="scroll-mt-24 py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Soluciones"
          title="Soluciones para tu empresa"
          description="Herramientas de gestión, pago y abastecimiento para que tu operación nunca se detenga."
          align="center"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {solutions.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <a
                href="#contacto"
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img src={s.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{s.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-navy-600">
                    Conoce más <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
