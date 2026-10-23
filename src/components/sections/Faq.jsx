import * as Accordion from '@radix-ui/react-accordion'
import { Link } from 'react-router'
import { ArrowRight, Plus } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

export default function Faq({ items: faqs }) {
  return (
    <section id="ayuda" className="relative scroll-mt-24 overflow-hidden bg-surface py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-20 top-40 h-80 w-1.5 rotate-45 bg-gradient-to-b from-navy-500 to-transparent opacity-50" />
      <div className="container-page">
        <SectionHeading eyebrow="Centro de ayuda" title="Resolvamos tus dudas juntos" align="center" />
        <Reveal delay={0.1} className="mx-auto mt-14 max-w-4xl">
          <Accordion.Root type="single" collapsible defaultValue="item-0" className="divide-y divide-navy-100/70 rounded-3xl bg-white px-2 shadow-card sm:px-4">
            {faqs.map((f, i) => (
              <Accordion.Item key={f.q} value={`item-${i}`} className="group">
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between gap-6 px-4 py-6 text-left text-lg font-semibold text-ink transition-colors hover:text-navy-600 data-[state=open]:text-navy-600">
                    {f.q}
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-600 transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-navy-600 group-data-[state=open]:text-white">
                      <Plus className="size-5" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="max-w-3xl px-4 pb-6 leading-relaxed text-muted">{f.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
          <p className="mt-8 text-center text-muted">
            ¿Tienes más dudas?{' '}
            <Link to="/ayuda" className="group inline-flex items-center gap-1 font-semibold text-navy-600">
              Visita el Centro de ayuda <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
