import { ArrowRight } from 'lucide-react'
import Reveal from '../ui/Reveal'

const tones = {
  whatsapp: { icon: 'bg-[#25D366]/10 text-[#1ea952]', highlight: 'text-navy-600' },
  navy: { icon: 'bg-navy-50 text-navy-600', highlight: 'text-ink' },
  brand: { icon: 'bg-brand-50 text-brand-600', highlight: 'text-brand-600' },
}

// channels: [{ title, text, highlight?, icon, tone, link?: { label, href, external? } }]
export default function Contact({ channels, image, id = 'contacto', title = '¿No encontraste lo que buscabas?', description }) {
  return (
    <section id={id} className="relative isolate scroll-mt-24 overflow-hidden bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900">
      <div className="pointer-events-none absolute -bottom-32 -right-32 -z-10 size-[520px] rotate-45 bg-white/5" />
      <div className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[420px] rounded-full bg-brand-600/20 blur-3xl" />
      <div className="container-page grid items-end gap-10 pt-20 lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-6">
          <Reveal>
            <h2 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
              {description ?? 'Contáctanos por cualquiera de nuestros canales. Estamos para ayudarte.'}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="relative mt-10 hidden h-[380px] lg:block">
            <img
              src={image}
              alt=""
              loading="lazy"
              className="absolute bottom-0 left-0 h-full w-[85%] rounded-t-[2.5rem] object-cover object-top shadow-2xl"
            />
          </Reveal>
        </div>
        <div className="grid gap-4 pb-20 sm:grid-cols-2 lg:col-span-6 lg:self-center lg:pb-24">
          {channels.map(({ title: t, text, highlight, icon: Icon, tone = 'navy', link }, i) => (
            <Reveal key={t} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_20px_40px_-20px_rgb(7_11_36/0.5)] transition-transform duration-300 hover:-translate-y-1">
                <span className={`grid size-12 place-items-center rounded-2xl ${tones[tone].icon}`}>
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{t}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-muted">
                  {text} {highlight && <span className={`font-semibold ${tones[tone].highlight}`}>{highlight}</span>}
                </p>
                {link && (
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="group mt-4 inline-flex items-center gap-1.5 font-semibold text-navy-600"
                  >
                    {link.label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
