import { ArrowRight, Check } from 'lucide-react'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import { digital } from '../../data/proveedores'

export default function DigitalProcurement() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-16 top-0 h-56 w-40 -skew-x-[38deg] bg-gradient-to-br from-navy-500 to-navy-500/0" />
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">{digital.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{digital.description}</p>
          <ul className="mt-8 space-y-3">
            {digital.points.map((p) => (
              <li key={p} className="flex items-center gap-3 font-medium">
                <span className="grid size-6 place-items-center rounded-full bg-navy-600 text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Button variant="outline" size="lg" href={digital.action.href} className="mt-10">
            {digital.action.label} <ArrowRight className="size-5" />
          </Button>
        </Reveal>
        <Reveal delay={0.15} className="relative">
          {/* Marcos diagonales decorativos */}
          <div className="pointer-events-none absolute -left-4 -top-4 size-32 border-l-4 border-t-4 border-navy-300 [clip-path:polygon(0_0,100%_0,0_100%)]" />
          <div className="pointer-events-none absolute -bottom-4 -right-4 size-32 border-b-4 border-r-4 border-navy-300 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
          <div className="overflow-hidden rounded-[2rem] shadow-card-hover [clip-path:polygon(18%_0,100%_0,100%_82%,82%_100%,0_100%,0_18%)]">
            <img src={digital.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
