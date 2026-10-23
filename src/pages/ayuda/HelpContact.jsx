import { ArrowRight } from 'lucide-react'
import Reveal from '../../components/ui/Reveal'
import { helpContacts } from '../../data/ayuda'

export default function HelpContact() {
  return (
    <section id="contacto" className="relative isolate scroll-mt-24 overflow-hidden">
      {/* Imagen cortada en diagonal con línea de acento */}
      <div
        className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 lg:block"
        style={{ clipPath: 'polygon(45% 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <img src="/images/empresas/contacto.jpg" alt="" loading="lazy" className="size-full object-cover object-[15%_25%]" />
      </div>
      <div
        className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-gradient-to-t from-navy-500 via-navy-300 to-white/0 lg:block"
        style={{ clipPath: 'polygon(68% 100%, 72% 100%, 100% 30%, 100% 22%)' }}
      />

      <div className="container-page py-24 lg:py-28">
        <div className="lg:w-1/2 lg:pr-10">
          <Reveal>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">¿Tienes dudas?</h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              Si no encuentras lo que buscas puedes contactarnos a través de nuestros canales de comunicación.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {helpContacts.map(({ title, text, highlight, icon: Icon, link }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <span className="grid size-12 place-items-center rounded-2xl bg-navy-50 text-navy-600">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 flex-1 leading-relaxed text-muted">
                    {text} {highlight && <span className="font-semibold text-ink">{highlight}</span>}
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
      </div>
    </section>
  )
}
