import { ArrowUp } from 'lucide-react'
import Logo from '../ui/Logo'
import SocialIcon from '../ui/SocialIcon'
import { contact, footerColumns, socials } from '../../data/site'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white [--icon-bg:var(--color-navy-950)]">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[480px] rounded-full bg-navy-600/30 blur-3xl" />
      <div className="container-page relative grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <Logo variant="white" />
          <address className="mt-8 space-y-2 text-[15px] not-italic leading-relaxed text-white/75">
            <p>Oficinas generales: {contact.address}</p>
            <p>
              Central de pedidos <strong className="font-semibold text-white">{contact.phone}</strong>
              <span className="mx-2 text-white/30">·</span>
              Empresas <strong className="font-semibold text-white">{contact.businessPhone}</strong>
            </p>
            <p>
              WhatsApp <strong className="font-semibold text-white">{contact.whatsapp}</strong>
            </p>
          </address>
          <div className="mt-8 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="grid size-11 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 transition hover:bg-white hover:text-navy-950 hover:[--icon-bg:#fff]"
              >
                <SocialIcon name={s.name} />
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => {
                  const { label, href } = typeof l === 'string' ? { label: l, href: '#' } : l
                  return (
                    <li key={label}>
                      <a href={href} className="text-[15px] text-white/70 transition hover:text-white">
                        {label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} Aerogas. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Política de privacidad</a>
            <a href="#" className="hover:text-white">Términos y condiciones</a>
            <a href="#top" aria-label="Volver arriba" className="grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
