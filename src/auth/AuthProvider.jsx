import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './context'
import { setRememberSession, supabase, supabaseConfigured } from '../lib/supabase'

// Login del portal de reportes con Supabase Auth (mismas cuentas que la app Aeroservice).
// Igual que la app: un DNI de 8 dígitos se convierte en <dni>@aeroservice.app; un correo se usa tal cual.
// Solo entran perfiles activos con rol permitido (VITE_PORTAL_ROLES). El portal es de solo lectura.

const AUTH_EMAIL_DOMAIN = 'aeroservice.app'
const ALLOWED_ROLES = (import.meta.env.VITE_PORTAL_ROLES || 'administrador,administrador_visualizador')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean)

const ROLE_LABELS = {
  administrador: 'Administrador',
  administrador_visualizador: 'Administrador (visualizador)',
  superadmin: 'Superadministrador',
}

const toEmail = (identifier) => (identifier.includes('@') ? identifier : `${identifier}@${AUTH_EMAIL_DOMAIN}`)

// Lee el perfil y valida que pueda usar el portal. Si no puede, cierra la sesión de Supabase.
async function loadPortalUser(authUser) {
  const { data, error } = await supabase.from('profiles').select('nombres, apellidos, rol, activo').eq('id', authUser.id).single()
  let problem = null
  if (error || !data) problem = 'No se encontró un perfil para este usuario.'
  else if (!data.activo) problem = 'Esta cuenta fue desactivada. Contacta al administrador.'
  else if (!ALLOWED_ROLES.includes(data.rol)) problem = 'Tu cuenta no tiene acceso al portal de reportes.'
  if (problem) {
    await supabase.auth.signOut()
    throw new Error(problem)
  }
  return {
    id: authUser.id,
    email: authUser.email,
    name: `${data.nombres} ${data.apellidos}`.trim(),
    role: data.rol,
    roleLabel: ROLE_LABELS[data.rol] ?? data.rol,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(supabaseConfigured)

  // Restaura la sesión guardada y sigue los cambios (cierre en otra pestaña, expiración, etc.).
  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let restored = null
      if (session?.user) {
        try {
          restored = await loadPortalUser(session.user)
        } catch {
          restored = null
        }
      }
      if (active) {
        setUser(restored)
        setLoading(false)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setUser(null)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (identifier, password, remember) => {
    if (!supabase) throw new Error('El acceso no está configurado (faltan las variables de Supabase en .env.local).')
    setRememberSession(remember)
    const { data, error } = await supabase.auth.signInWithPassword({ email: toEmail(identifier.trim()), password })
    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) throw new Error('Demasiados intentos. Espera unos minutos e intenta de nuevo.')
      if (error.name === 'AuthRetryableFetchError') throw new Error('Sin conexión. Verifica tu red e intenta de nuevo.')
      throw new Error('DNI/correo o contraseña incorrectos.')
    }
    setUser(await loadPortalUser(data.user))
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
    await supabase?.auth.signOut()
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
