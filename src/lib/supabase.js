import { createClient } from '@supabase/supabase-js'

// Cliente de Supabase: mismo proyecto que la app Aeroservice.
// Se usa la clave pública (publishable/anon): la seguridad la dan las políticas RLS del proyecto.
// NUNCA poner aquí la service_role key.

const REMEMBER_KEY = 'aerogas-remember-session'

// La sesión vive en localStorage si se marcó "Mantener sesión iniciada"; si no, en sessionStorage
// (se borra al cerrar el navegador). Todo envuelto en try/catch: el almacenamiento puede no existir.
const safe = (fn, fallback = null) => {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export const setRememberSession = (remember) =>
  safe(() => (remember ? localStorage.setItem(REMEMBER_KEY, '1') : localStorage.removeItem(REMEMBER_KEY)))

const remembered = () => safe(() => localStorage.getItem(REMEMBER_KEY) === '1', false)

const sessionStore = {
  getItem: (key) => safe(() => localStorage.getItem(key) ?? sessionStorage.getItem(key)),
  setItem: (key, value) =>
    safe(() => {
      const [keep, drop] = remembered() ? [localStorage, sessionStorage] : [sessionStorage, localStorage]
      keep.setItem(key, value)
      drop.removeItem(key)
    }),
  removeItem: (key) =>
    safe(() => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    }),
}

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(url && key)

export const supabase = supabaseConfigured
  ? createClient(url, key, {
      auth: { storage: sessionStore, storageKey: 'aerogas-portal-auth', persistSession: true, autoRefreshToken: true },
    })
  : null
