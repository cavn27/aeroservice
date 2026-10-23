import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { headerBySegment, loginAction, segments } from '../../data/site'
import { useAuth } from '../../auth/useAuth'

function Dropdown({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium text-ink transition-colors hover:bg-surface"
      >
        {item.label}
        <ChevronDown className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 top-full z-50 -ml-[210px] w-[420px] pt-3"
          >
            <div className="grid gap-1 rounded-2xl border border-navy-100/60 bg-white p-2 shadow-card-hover">
              {item.items.map(({ label, description, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-surface"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{label}</span>
                    <span className="block text-sm text-muted">{description}</span>
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileMenu({ open, onClose, nav, actions, home }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-white lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex h-18 shrink-0 items-center justify-between border-b border-navy-50 px-4">
              <Logo to={home} />
              <button type="button" onClick={onClose} aria-label="Cerrar menú" className="grid size-10 place-items-center rounded-full hover:bg-surface">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto px-4 py-4 no-scrollbar">
              {segments.map((s) => (
                <NavLink
                  key={s.to}
                  to={s.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `shrink-0 rounded-full px-4 py-2 text-sm font-medium ${isActive ? 'bg-navy-600 text-white' : 'bg-surface text-muted'}`
                  }
                >
                  {s.label}
                </NavLink>
              ))}
            </div>
            <nav className="flex-1 px-4">
              {nav.map((item) =>
                item.items ? (
                  <details key={item.label} className="group border-b border-navy-50">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-medium">
                      {item.label}
                      <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="grid gap-1 pb-3">
                      {item.items.map(({ label, icon: Icon, href }) => (
                        <a key={label} href={href} onClick={onClose} className="flex items-center gap-3 rounded-xl p-2.5 text-muted hover:bg-surface">
                          <Icon className="size-5 text-navy-600" /> {label}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a key={item.label} href={item.href} onClick={onClose} className="block border-b border-navy-50 py-4 text-lg font-medium">
                    {item.label}
                  </a>
                ),
              )}
            </nav>
            <div className="grid gap-3 p-4">
              {actions.map((a) => (
                <Button key={a.label} variant={a.variant} href={a.href} onClick={onClose}>
                  {a.label}
                </Button>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const segment = useLocation().pathname.split('/')[1]
  const { nav, actions: baseActions } = headerBySegment[segment] ?? headerBySegment.personas
  // Con sesión iniciada, el botón de ingreso lleva directo al panel.
  const { user } = useAuth()
  const actions = baseActions.map((a) => (a === loginAction && user ? { ...a, label: 'Mi panel', href: '/admin' } : a))
  const home = segments.some((s) => s.to === `/${segment}`) ? `/${segment}` : '/personas'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 48))

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/85 shadow-[0_8px_30px_-12px_rgb(16_24_64/0.18)] backdrop-blur-xl' : 'bg-white'
      }`}
    >
      <div className={`container-page flex items-center justify-between gap-6 transition-all duration-300 ${scrolled ? 'h-16' : 'h-18 lg:h-22'}`}>
        <Logo to={home} />
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.items ? (
              <Dropdown key={item.label} item={item} />
            ) : (
              <a key={item.label} href={item.href} className="rounded-full px-3.5 py-2 text-[15px] font-medium text-ink transition-colors hover:bg-surface">
                {item.label}
              </a>
            ),
          )}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {actions.map((a) => (
            <Button key={a.label} variant={a.variant} size="sm" href={a.href}>
              {a.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <button type="button" aria-label="Buscar" className="grid size-10 place-items-center rounded-full hover:bg-surface">
            <Search className="size-5" />
          </button>
          <button type="button" aria-label="Abrir menú" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-full hover:bg-surface">
            <Menu className="size-6" />
          </button>
        </div>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} nav={nav} actions={actions} home={home} />
    </header>
  )
}
