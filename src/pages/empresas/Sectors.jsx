import { ArrowRight } from 'lucide-react'
import SectionHeading from '../../components/ui/SectionHeading'
import Reveal from '../../components/ui/Reveal'
import { sectors } from '../../data/empresas'

function SectorCard({ sector }) {
  return (
    <a
      href="#contacto"
      className="group flex h-full flex-col rounded-3xl bg-white p-3 ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:bg-navy-50 hover:shadow-card-hover hover:ring-navy-200"
    >
      <div className="aspect-[2/1] overflow-hidden rounded-2xl">
        <img src={sector.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <h3 className="text-xl font-semibold">{sector.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-muted">{sector.description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-navy-600">
          Conoce más <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  )
}

export default function Sectors() {
  const [first, second, ...rest] = sectors
  return (
    <section id="sectores" className="scroll-mt-24 py-24 lg:py-32">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <SectionHeading
            className="lg:col-span-5"
            eyebrow="Sectores"
            title="Sé parte de Aerogas"
            description="Conoce nuestros productos y servicios para cada industria."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {[first, second].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <SectorCard sector={s} />
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:ml-[25%] lg:grid-cols-3">
          {rest.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <SectorCard sector={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
