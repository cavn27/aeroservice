import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, UserRound } from 'lucide-react'
import { useAuth } from '../../auth/useAuth'
import emblem from '../../assets/emblem.png'
import wordmark from '../../assets/wordmark.png'
import wordmarkWhite from '../../assets/wordmark-white.png'

const inputClass =
  'h-12 w-full rounded-xl border border-navy-100 bg-white pl-11 pr-4 text-ink outline-none transition placeholder:text-muted/60 focus:border-navy-500 focus:ring-4 focus:ring-navy-500/15'

export default function IngresarPage() {
  const { user, loading: restoring, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const destination = location.state?.from?.startsWith('/admin') ? location.state.from : '/admin'
  if (user) return <Navigate to={destination} replace />
  if (restoring) return null

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError('')
    setLoading(true)
    try {
      const identifier = String(form.get('identifier')).trim()
      if (!/^\d{8}$/.test(identifier) && !identifier.includes('@')) throw new Error('Ingresa tu DNI de 8 dígitos o tu correo.')
      await login(identifier, String(form.get('password')), form.get('remember') === 'on')
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-2">
      <title>Aerogas | Ingresar</title>

      {/* Formulario */}
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/personas" className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> Volver al sitio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"
        >
          <div className="flex items-center gap-2.5 lg:hidden">
            <img src={emblem} alt="" className="h-10" />
            <img src={wordmark} alt="Aerogas" className="h-7" />
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-tight lg:mt-0">Ingresar</h1>
          <p className="mt-2 text-muted">Portal de reportes y KPIs de Aeroservice. Ingresa con tu cuenta de la app.</p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">DNI o correo</span>
              <span className="relative block">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
                <input name="identifier" type="text" required autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="12345678 o tu@correo.com" className={inputClass} />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Contraseña</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2.5 text-muted">
                <input name="remember" type="checkbox" className="size-4 accent-navy-600" />
                Mantener sesión iniciada
              </label>
              <span className="text-muted">¿Olvidaste tu clave? Contacta a sistemas.</span>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-600 font-semibold text-white shadow-[0_8px_20px_-8px_rgb(31_45_132/0.6)] transition hover:bg-navy-700 disabled:opacity-70"
            >
              {loading && <LoaderCircle className="size-5 animate-spin" />}
              Ingresar
            </button>
          </form>
        </motion.div>

        <p className="text-center text-xs text-muted">Acceso exclusivo para usuarios autorizados de Aerogas.</p>
      </div>

      {/* Panel de marca */}
      <div className="relative isolate hidden overflow-hidden bg-navy-900 lg:grid lg:place-items-center">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-navy-500/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 -z-10 size-96 rounded-full bg-brand-600/25 blur-3xl" />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="max-w-sm text-center">
          <div className="flex items-center justify-center gap-3">
            <img src={emblem} alt="" className="h-16" />
            <img src={wordmarkWhite} alt="Aerogas" className="h-11" />
          </div>
          <p className="mt-6 text-lg text-white/70">Portal administrativo</p>
        </motion.div>
      </div>
    </div>
  )
}
