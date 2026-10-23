import SectionHeading from '../../components/ui/SectionHeading'
import Reveal from '../../components/ui/Reveal'
import { perks, steps } from '../../data/distribuidores'

export default function Perks() {
  return (
    <section className="relative overflow-hidden bg-surface py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="¿Por qué Aerogas?"
          title="Crece con nosotros"
          description="Te damos las herramientas y el respaldo para que tu negocio funcione desde el primer día."
          align="center"
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ title, description, icon: Icon }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="group h-full rounded-3xl bg-white p-7 shadow-card ring-1 ring-navy-100/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-navy-50 to-navy-100 text-navy-600 transition-colors duration-300 group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white">
                  <Icon className="size-7" strokeWidth={1.7} />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24">
          <h3 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Así es el proceso</h3>
        </Reveal>
        <div className="relative mt-14">
          {/* Línea que une los pasos en escritorio */}
          <div className="absolute left-[10%] right-[10%] top-7 hidden h-0.5 bg-gradient-to-r from-navy-200 via-navy-400 to-brand-500 lg:block" />
          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.1} className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span className="relative grid size-14 shrink-0 place-items-center rounded-full bg-white text-xl font-bold text-navy-600 shadow-card ring-4 ring-surface">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-lg font-semibold lg:mt-5">{s.title}</h4>
                  <p className="mt-1.5 leading-relaxed text-muted">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
