import { ArrowRight } from 'lucide-react'
import SectionHeading from '../../components/ui/SectionHeading'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import { benefits } from '../../data/personas'

function BenefitCard({ benefit, className = '' }) {
  return (
    <a
      href={benefit.href}
      className={`group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-navy-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover ${className}`}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={benefit.image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-600 shadow-sm">
          {benefit.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-ink">{benefit.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-muted">{benefit.description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-navy-600">
          Conoce más <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  )
}

export default function Benefits() {
  return (
    <section id="beneficios" className="relative scroll-mt-24 overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-1 rotate-45 bg-gradient-to-b from-navy-500 to-transparent opacity-60" />
      <div className="container-page grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Beneficios"
            title="Gana siempre con Aerogas"
            description="Disfruta de descuentos, puntos y alianzas exclusivas al inscribirte en cualquiera de nuestros programas. ¡Aprovecha estas oportunidades!"
          />
          <Reveal delay={0.15} className="mt-8">
            <Button href="#">
              Únete al Club Aerogas <ArrowRight className="size-4" />
            </Button>
          </Reveal>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08} className={i % 2 === 1 ? 'sm:translate-y-12' : ''}>
              <BenefitCard benefit={b} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
