import { createClient } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { LOCALES } from './labels'
import { resetPerfilesCache } from './reportData'

// Administración de personal: mismas operaciones y reglas que la app Aeroservice
// (features/admin/data/staff_repository.dart). Las protecciones reales están en la base
// (RLS, límite de usuarios) y en la Edge Function admin-reset-password.

const AUTH_EMAIL_DOMAIN = 'aeroservice.app'

// Puestos por punto de venta (PuntoVenta.roles / estaciones en la app).
export const PUNTOS = [
  { id: 'delivery', label: 'Delivery', roles: ['auxiliar_ventas', 'motorizado', 'mototaxi'], estaciones: ['delivery_quinones', 'chiclayo'] },
  { id: 'local', label: 'Local', roles: ['auxiliar_motorizado'], estaciones: ['tucume', 'ferrenafe', 'pomalca', 'patapo', 'cayalti', 'oyotun'] },
  {
    id: 'grifo',
    label: 'Grifo',
    roles: ['jefe_estacion', 'operario_venta'],
    estaciones: ['grifo_vela', 'grifo_quinones', 'grifo_salaverry', 'grifo_chosica_norte', 'grifo_monsefu_petroperu', 'grifo_monsefu_repsol', 'grifo_cayalti', 'grifo_jlo', 'grifo_verdum'],
  },
  { id: 'furgon', label: 'Furgón', roles: ['distribuidor'], estaciones: ['furgon'], sinEstacion: true },
  { id: 'planta', label: 'Planta', roles: ['planta'], estaciones: ['planta'], sinEstacion: true },
]

export const puntoDeLocal = (local) => PUNTOS.find((p) => p.estaciones.includes(local)) ?? PUNTOS[0]

// Nombre corto de la estación dentro de su punto de venta (Local.nombreEstacion).
const NOMBRE_ESTACION = {
  grifo_vela: 'Vela', grifo_quinones: 'Quiñones', grifo_salaverry: 'Salaverry', grifo_chosica_norte: 'Chosica del norte',
  grifo_monsefu_petroperu: 'Monsefú Petroperú', grifo_monsefu_repsol: 'Monsefú Repsol', grifo_cayalti: 'Cayaltí', grifo_jlo: 'JLO', grifo_verdum: 'Verdum',
}
export const nombreEstacion = (local) => NOMBRE_ESTACION[local] ?? LOCALES[local] ?? local

const COLUMNS = 'id,dni,nombres,apellidos,telefono,rol,local,activo,created_at'

// Personal visible para el administrador: sin cuentas administrativas ni superadmin (igual que la app).
export async function fetchStaff() {
  const rows = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('profiles')
      .select(COLUMNS)
      .not('rol', 'in', '(superadmin,administrador,administrador_visualizador)')
      .order('created_at', { ascending: false })
      .range(from, from + 999)
    if (error) throw new Error('No se pudo cargar el personal.')
    rows.push(...data)
    if (data.length < 1000) return rows
  }
}

// Cuentas activas y máximo permitido. Solo responde al administrador.
export async function fetchCupo() {
  const { data, error } = await supabase.rpc('cupo_usuarios')
  if (error || !data?.length) return null
  return { total: data[0].total, maximo: data[0].maximo, lleno: data[0].total >= data[0].maximo }
}

function mapSignUpError(message = '') {
  const m = message.toLowerCase()
  if (m.includes('already registered') || m.includes('already been registered') || m.includes('already exists')) return 'Ya existe una cuenta con ese DNI.'
  if (m.includes('rate limit')) return 'Se alcanzó el límite de cuentas creadas por hora. Intenta más tarde.'
  if (m.includes('password')) return 'La contraseña debe tener al menos 6 caracteres.'
  return 'No se pudo crear la cuenta. Intenta nuevamente.'
}

// Crea la cuenta de Auth (DNI@aeroservice.app) y su perfil.
// El signUp va en un cliente aparte y sin guardar sesión, para no reemplazar la sesión del administrador.
export async function createStaff({ dni, nombres, apellidos, telefono, rol, local, password }) {
  const cupo = await fetchCupo()
  if (cupo?.lleno) throw new Error(`Se alcanzó el límite de ${cupo.maximo} usuarios activos. Pide al superadmin que lo aumente.`)

  const temp = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'aerogas-signup-temp' },
  })
  const { data, error } = await temp.auth.signUp({ email: `${dni}@${AUTH_EMAIL_DOMAIN}`, password })
  if (error) throw new Error(mapSignUpError(error.message))
  const userId = data.user?.id
  // Con "Confirm email" activo, Supabase devuelve un usuario sin identidades si el correo ya existía.
  if (!userId || data.user?.identities?.length === 0) throw new Error('Ya existe una cuenta con ese DNI.')

  const { error: insertError } = await supabase.from('profiles').insert({ id: userId, dni, nombres, apellidos, telefono: telefono || null, rol, local })
  if (insertError) {
    throw new Error(insertError.message.includes('límite') ? insertError.message : 'La cuenta se creó pero no se pudo guardar el perfil. Contacta soporte.')
  }
  resetPerfilesCache()
}

export async function updateStaff(id, { nombres, apellidos, telefono, rol, local }) {
  const { data, error } = await supabase.from('profiles').update({ nombres, apellidos, telefono: telefono || null, rol, local }).eq('id', id).select('id')
  if (error || !data?.length) throw new Error('No se pudo guardar los cambios. Intenta nuevamente.')
  resetPerfilesCache()
}

export async function setActivo(id, activo) {
  const { data, error } = await supabase.from('profiles').update({ activo }).eq('id', id).select('id')
  if (error || !data?.length) {
    throw new Error(activo ? (error?.message?.includes('límite') ? error.message : 'No se pudo reactivar la cuenta.') : 'No se pudo desactivar la cuenta.')
  }
}

// Cambiar la contraseña de otra persona requiere el Admin API (service role): va por la Edge Function.
export async function resetPassword(userId, newPassword) {
  const { data, error } = await supabase.functions.invoke('admin-reset-password', { body: { user_id: userId, new_password: newPassword } })
  if (data?.error) throw new Error(data.error)
  if (error) {
    let message = 'No se pudo cambiar la contraseña.'
    try {
      const body = await error.context?.json?.()
      if (body?.error) message = body.error
    } catch {
      if (error.name === 'FunctionsFetchError') message = 'No se pudo contactar al servidor (revisa la conexión o la configuración CORS de la función).'
    }
    throw new Error(message)
  }
}

// Contraseña temporal legible (sin caracteres que se confunden: 0/O, 1/l/I).
export function generatePassword(length = 8) {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const values = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(values, (v) => chars[v % chars.length]).join('')
}
