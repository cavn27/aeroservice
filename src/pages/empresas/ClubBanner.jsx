import { ArrowRight } from 'lucide-react'
import Button from '../../components/ui/Button'
import Reveal from '../../components/ui/Reveal'
import { club } from '../../data/empresas'

export default function ClubBanner() {
  return (
    <section className="container-page pb-24">
      <Reveal className="relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-navy-700 p-8 sm:flex-row sm:items-center sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-navy-500/40 blur-2xl" />
        <div className="grid shrink-0 grid-cols-2 gap-1.5" aria-hidden="true">
          <span className="size-6 rounded-lg bg-[#2dd4bf]" />
          <span className="size-6 rounded-full bg-[#38bdf8]" />
          <span className="size-6 rounded-full bg-[#fb7185]" />
          <span className="size-6 rounded-lg bg-brand-600" />
        </div>
        <div className="relative flex-1">
          <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">{club.title}</h2>
          <p className="mt-1.5 text-white/80">{club.description}</p>
        </div>
        <Button variant="white" href={club.cta.href} className="relative shrink-0">
          {club.cta.label} <ArrowRight className="size-4" />
        </Button>
      </Reveal>
    </section>
  )
}
