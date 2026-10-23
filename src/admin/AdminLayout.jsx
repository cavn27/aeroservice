import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, ChevronDown, ExternalLink, LogOut, Menu, Moon, PanelLeftClose, Search, Sun, X } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import emblem from '../assets/emblem.png'
import wordmark from '../assets/wordmark.png'
import wordmarkWhite from '../assets/wordmark-white.png'
import { adminNav } from './adminNav'

const THEME_KEY = 'aerogas-admin-theme'
const readTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

// Cierra un menú desplegable al hacer clic fuera o presionar Escape.
function useDismiss(open, setOpen) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen])
  return ref
}

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

function Sidebar({ collapsed, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/admin" onClick={onNavigate} className={`flex h-20 shrink-0 items-center gap-2.5 px-6 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
        <img src={emblem} alt="" className="h-9" />
        <span className={collapsed ? 'lg:hidden' : ''}>
          <img src={wordmark} alt="Aerogas" className="h-6 dark:hidden" />
          <img src={wordmarkWhite} alt="Aerogas" className="hidden h-6 dark:block" />
        </span>
      </Link>
      <nav className="flex-1 space-y-8 overflow-y-auto px-4 pb-8 no-scrollbar">
        {adminNav.map((group) => (
          <div key={group.title}>
            <p className={`mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted dark:text-white/40 ${collapsed ? 'lg:text-center' : ''}`}>
              {collapsed ? <span className="hidden lg:inline">···</span> : null}
              <span className={collapsed ? 'lg:hidden' : ''}>{group.title}</span>
            </p>
            <ul className="space-y-1">
              {group.items.map(({ label, to, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${collapsed ? 'lg:justify-center' : ''} ${
                        isActive
                          ? 'bg-navy-50 text-navy-600 dark:bg-white/10 dark:text-white'
                          : 'text-ink/80 hover:bg-surface hover:text-ink dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'
                      }`
                    }
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

function Dropdown({ open, children, className = '' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className={`absolute right-0 top-full z-50 mt-3 rounded-2xl border border-navy-100 bg-white p-2 shadow-card-hover dark:border-white/10 dark:bg-navy-900 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const iconBtn =
  'relative grid size-11 place-items-center rounded-full border border-navy-100 text-muted transition hover:bg-surface hover:text-ink dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [theme, setTheme] = useState(readTheme)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const userRef = useDismiss(userOpen, setUserOpen)
  const notifRef = useDismiss(notifOpen, setNotifOpen)
  const searchRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* preferencia solo en memoria */
    }
  }, [theme])

  // Atajo Ctrl/⌘ + K para el buscador, como en TailAdmin.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const toggleSidebar = () => (window.matchMedia('(min-width: 1024px)').matches ? setCollapsed((c) => !c) : setMobileOpen(true))

  const onLogout = () => {
    logout()
    navigate('/ingresar', { replace: true })
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-dvh bg-surface text-ink dark:bg-navy-950 dark:text-white">
        {/* Barra lateral de escritorio */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 hidden border-r border-navy-100 bg-white transition-[width] duration-300 dark:border-white/10 dark:bg-navy-900 lg:block ${
            collapsed ? 'w-[88px]' : 'w-[280px]'
          }`}
        >
          <Sidebar collapsed={collapsed} />
        </aside>

        {/* Barra lateral móvil */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-navy-950/50 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-navy-900 lg:hidden"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={() => setMobileOpen(false)}
                  className="absolute right-3 top-5 grid size-10 place-items-center rounded-full hover:bg-surface dark:hover:bg-white/5"
                >
                  <X className="size-5" />
                </button>
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className={`transition-[padding] duration-300 ${collapsed ? 'lg:pl-[88px]' : 'lg:pl-[280px]'}`}>
          {/* Cabecera */}
          <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-navy-900/90">
            <div className="flex h-20 items-center gap-3 px-4 sm:px-6">
              <button type="button" onClick={toggleSidebar} aria-label="Mostrar u ocultar menú" className={`${iconBtn} rounded-xl`}>
                <Menu className="size-5 lg:hidden" />
                <PanelLeftClose className={`hidden size-5 transition-transform lg:block ${collapsed ? 'rotate-180' : ''}`} />
              </button>
              <label className="relative hidden max-w-md flex-1 md:block">
                <span className="sr-only">Buscar</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted dark:text-white/50" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Buscar o escribir un comando…"
                  className="h-11 w-full rounded-xl border border-navy-100 bg-transparent pl-12 pr-16 text-sm outline-none transition placeholder:text-muted/70 focus:border-navy-500 focus:ring-4 focus:ring-navy-500/15 dark:border-white/10 dark:placeholder:text-white/40"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-navy-100 bg-surface px-2 py-0.5 text-xs text-muted dark:border-white/10 dark:bg-white/5 dark:text-white/50">
                  Ctrl K
                </kbd>
              </label>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <a href="/personas" target="_blank" rel="noreferrer" className={`${iconBtn} hidden sm:grid`} title="Ver sitio web" aria-label="Ver sitio web">
                  <ExternalLink className="size-5" />
                </a>
                <button
                  type="button"
                  onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                  aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
                  className={iconBtn}
                >
                  {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </button>

                <div ref={notifRef} className="relative">
                  <button type="button" aria-label="Notificaciones" aria-expanded={notifOpen} onClick={() => setNotifOpen((o) => !o)} className={iconBtn}>
                    <Bell className="size-5" />
                  </button>
                  <Dropdown open={notifOpen} className="w-80">
                    <p className="px-3 py-2 text-sm font-semibold">Notificaciones</p>
                    <p className="px-3 pb-3 text-sm text-muted dark:text-white/50">No tienes notificaciones nuevas.</p>
                  </Dropdown>
                </div>

                <div ref={userRef} className="relative">
                  <button type="button" aria-expanded={userOpen} onClick={() => setUserOpen((o) => !o)} className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 hover:bg-surface dark:hover:bg-white/5">
                    <span className="grid size-11 place-items-center rounded-full bg-navy-600 text-sm font-bold text-white">{initials(user.name)}</span>
                    <span className="hidden text-sm font-medium sm:block">{user.name.split(' ')[0]}</span>
                    <ChevronDown className={`hidden size-4 transition-transform sm:block ${userOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <Dropdown open={userOpen} className="w-64">
                    <div className="px-3 py-2">
                      <p className="font-semibold">{user.name}</p>
                      <p className="truncate text-sm text-muted dark:text-white/50">{user.roleLabel}</p>
                    </div>
                    <div className="my-1 h-px bg-navy-100 dark:bg-white/10" />
                    <a href="/personas" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-surface dark:hover:bg-white/5">
                      <ExternalLink className="size-4" /> Ver sitio web
                    </a>
                    <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-brand-600 hover:bg-brand-50 dark:hover:bg-white/5">
                      <LogOut className="size-4" /> Cerrar sesión
                    </button>
                  </Dropdown>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-screen-2xl p-4 sm:p-6">
            <Suspense fallback={<div className="grid min-h-[50vh] place-items-center text-muted">Cargando…</div>}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
