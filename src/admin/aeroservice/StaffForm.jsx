import { useState } from 'react'
import { Check, Copy, Eye, EyeOff, KeyRound, LoaderCircle, Power, Sparkles } from 'lucide-react'
import { rolLabel } from './labels'
import { createStaff, generatePassword, nombreEstacion, PUNTOS, puntoDeLocal, resetPassword, setActivo, updateStaff } from './staff'

const input =
  'h-11 w-full rounded-xl border border-navy-100 bg-white px-3.5 text-sm outline-none transition focus:border-navy-500 focus:ring-4 focus:ring-navy-500/15 disabled:bg-surface disabled:text-muted dark:border-white/10 dark:bg-navy-950 dark:disabled:bg-white/5'
const primaryBtn =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy-600 px-5 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-60'
const ghostBtn =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-navy-100 px-3.5 text-sm font-semibold transition hover:bg-surface disabled:opacity-60 dark:border-white/10 dark:hover:bg-white/5'

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-brand-600">{error}</span> : hint && <span className="mt-1 block text-xs text-muted dark:text-white/50">{hint}</span>}
    </label>
  )
}

function Alert({ tone = 'error', children }) {
  const tones = {
    error: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-500',
    ok: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  }
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${tones[tone]}`}>
      {children}
    </p>
  )
}

function CopyButton({ text, label = 'Copiar' }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className={ghostBtn}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          setTimeout(() => setDone(false), 1500)
        } catch {
          /* sin portapapeles */
        }
      }}
    >
      {done ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />} {done ? 'Copiado' : label}
    </button>
  )
}

// Selector en cascada: punto de venta → rol → estación (como PuestoSelector en la app).
function PuestoFields({ rol, local, onChange, disabled }) {
  const punto = puntoDeLocal(local)
  // Un rol antiguo que ya no corresponde al punto se conserva para no romper el campo.
  const roles = [...new Set([...punto.roles, rol])]
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="Punto de venta">
        <select
          className={input}
          disabled={disabled}
          value={punto.id}
          onChange={(e) => {
            const p = PUNTOS.find((x) => x.id === e.target.value)
            onChange({ rol: p.roles[0], local: p.estaciones[0] })
          }}
        >
          {PUNTOS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Rol">
        <select className={input} disabled={disabled} value={rol} onChange={(e) => onChange({ rol: e.target.value, local })}>
          {roles.map((r) => (
            <option key={r} value={r}>
              {rolLabel(r)}
            </option>
          ))}
        </select>
      </Field>
      {!punto.sinEstacion && (
        <Field label="Estación">
          <select className={input} disabled={disabled} value={local} onChange={(e) => onChange({ rol, local: e.target.value })}>
            {punto.estaciones.map((e) => (
              <option key={e} value={e}>
                {nombreEstacion(e)}
              </option>
            ))}
          </select>
        </Field>
      )}
    </div>
  )
}

function PasswordInput({ value, onChange, show, onToggle, id }) {
  return (
    <span className="relative block">
      <input id={id} type={show ? 'text' : 'password'} autoComplete="new-password" className={`${input} pr-11`} value={value} onChange={(e) => onChange(e.target.value)} />
      <button type="button" onClick={onToggle} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface dark:hover:bg-white/10">
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </span>
  )
}

// Formulario de alta (mode="create") o edición (mode="edit"). canEdit=false lo muestra solo para lectura.
export default function StaffForm({ mode, person, canEdit, onSaved }) {
  const creating = mode === 'create'
  const [form, setForm] = useState(() => ({
    nombres: person?.nombres ?? '',
    apellidos: person?.apellidos ?? '',
    dni: person?.dni ?? '',
    telefono: person?.telefono ?? '',
    rol: person?.rol ?? PUNTOS[0].roles[0],
    local: person?.local ?? PUNTOS[0].estaciones[0],
    password: '',
    confirm: '',
  }))
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [busy, setBusy] = useState(null)
  const [message, setMessage] = useState(null)
  const [created, setCreated] = useState(null)
  const [newPwd, setNewPwd] = useState('')
  const [confirmToggle, setConfirmToggle] = useState(false)
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const disabled = !canEdit || !!busy

  const validate = () => {
    const e = {}
    if (!form.nombres.trim()) e.nombres = 'Ingresa los nombres'
    if (!form.apellidos.trim()) e.apellidos = 'Ingresa los apellidos'
    if (creating && !/^\d{8}$/.test(form.dni)) e.dni = 'Ingresa un DNI válido de 8 dígitos'
    if (form.telefono && !/^\d{6,15}$/.test(form.telefono)) e.telefono = 'Solo números'
    if (creating && form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (creating && form.confirm !== form.password) e.confirm = 'Las contraseñas no coinciden'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const run = async (key, fn, ok) => {
    setBusy(key)
    setMessage(null)
    try {
      await fn()
      if (ok) setMessage({ tone: 'ok', text: ok })
      return true
    } catch (err) {
      setMessage({ tone: 'error', text: err.message })
      return false
    } finally {
      setBusy(null)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = { nombres: form.nombres.trim(), apellidos: form.apellidos.trim(), telefono: form.telefono.trim(), rol: form.rol, local: form.local }
    if (creating) {
      const ok = await run('save', () => createStaff({ ...data, dni: form.dni, password: form.password }))
      if (ok) {
        setCreated({ dni: form.dni, password: form.password, nombre: `${data.nombres} ${data.apellidos}` })
        onSaved?.()
      }
    } else {
      const ok = await run('save', () => updateStaff(person.id, data), 'Cambios guardados.')
      if (ok) onSaved?.()
    }
  }

  // Cuenta creada: se muestran los datos de acceso para compartirlos con la persona.
  if (created) {
    const credenciales = `Usuario (DNI): ${created.dni}\nContraseña temporal: ${created.password}`
    return (
      <div className="space-y-5">
        <span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15">
          <Check className="size-7" strokeWidth={2.5} />
        </span>
        <div>
          <h3 className="text-2xl font-bold">Cuenta creada</h3>
          <p className="mt-1 text-muted dark:text-white/60">{created.nombre} ya puede ingresar a la app con estos datos. Compártelos de forma privada.</p>
        </div>
        <dl className="space-y-2 rounded-2xl bg-surface p-4 font-mono text-sm dark:bg-white/5">
          <div className="flex justify-between gap-4">
            <dt className="text-muted dark:text-white/60">Usuario (DNI)</dt>
            <dd className="font-semibold">{created.dni}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted dark:text-white/60">Contraseña temporal</dt>
            <dd className="font-semibold">{created.password}</dd>
          </div>
        </dl>
        <CopyButton text={credenciales} label="Copiar datos de acceso" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-5" noValidate>
        {creating && <p className="text-sm text-muted dark:text-white/60">La persona ingresará a la app con su DNI y esta contraseña temporal.</p>}
        {!creating && !person.activo && <Alert>Esta cuenta está desactivada: no puede ingresar a la app.</Alert>}
        <PuestoFields rol={form.rol} local={form.local} onChange={set} disabled={disabled} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombres" error={errors.nombres}>
            <input className={input} disabled={disabled} value={form.nombres} onChange={(e) => set({ nombres: e.target.value })} autoComplete="off" />
          </Field>
          <Field label="Apellidos" error={errors.apellidos}>
            <input className={input} disabled={disabled} value={form.apellidos} onChange={(e) => set({ apellidos: e.target.value })} autoComplete="off" />
          </Field>
          <Field label="DNI" error={errors.dni} hint={creating ? 'Será su usuario para ingresar' : 'El DNI no se puede cambiar'}>
            <input
              className={input}
              disabled={!creating || disabled}
              inputMode="numeric"
              maxLength={8}
              value={form.dni}
              onChange={(e) => set({ dni: e.target.value.replace(/\D/g, '').slice(0, 8) })}
              autoComplete="off"
            />
          </Field>
          <Field label="Teléfono (opcional)" error={errors.telefono}>
            <input className={input} disabled={disabled} inputMode="tel" value={form.telefono} onChange={(e) => set({ telefono: e.target.value.replace(/\D/g, '') })} autoComplete="off" />
          </Field>
          {creating && (
            <>
              <Field label="Contraseña temporal" error={errors.password}>
                <PasswordInput id="pwd" value={form.password} onChange={(password) => set({ password })} show={showPwd} onToggle={() => setShowPwd((s) => !s)} />
              </Field>
              <Field label="Confirmar contraseña" error={errors.confirm}>
                <PasswordInput id="pwd2" value={form.confirm} onChange={(confirm) => set({ confirm })} show={showPwd} onToggle={() => setShowPwd((s) => !s)} />
              </Field>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  className={ghostBtn}
                  disabled={disabled}
                  onClick={() => {
                    const p = generatePassword()
                    set({ password: p, confirm: p })
                    setShowPwd(true)
                  }}
                >
                  <Sparkles className="size-4" /> Generar contraseña
                </button>
              </div>
            </>
          )}
        </div>
        {message && <Alert tone={message.tone}>{message.text}</Alert>}
        {canEdit && (
          <button type="submit" className={primaryBtn} disabled={!!busy}>
            {busy === 'save' && <LoaderCircle className="size-4 animate-spin" />}
            {creating ? 'Crear cuenta' : 'Guardar cambios'}
          </button>
        )}
      </form>

      {!creating && canEdit && (
        <>
          <section className="space-y-3 border-t border-navy-100 pt-6 dark:border-white/10">
            <h3 className="flex items-center gap-2 font-semibold">
              <KeyRound className="size-4" /> Restablecer contraseña
            </h3>
            <p className="text-sm text-muted dark:text-white/60">Define una nueva contraseña temporal y compártela con la persona. No necesitas la anterior.</p>
            <div className="flex flex-wrap gap-2">
              <span className="min-w-56 flex-1">
                <PasswordInput id="newpwd" value={newPwd} onChange={setNewPwd} show={showPwd} onToggle={() => setShowPwd((s) => !s)} />
              </span>
              <button
                type="button"
                className={ghostBtn}
                disabled={!!busy}
                onClick={() => {
                  setNewPwd(generatePassword())
                  setShowPwd(true)
                }}
              >
                <Sparkles className="size-4" /> Generar
              </button>
              {newPwd && <CopyButton text={newPwd} />}
            </div>
            <button
              type="button"
              className={ghostBtn}
              disabled={!!busy || newPwd.length < 6}
              onClick={() => run('pwd', () => resetPassword(person.id, newPwd), 'Contraseña actualizada. Compártela con la persona.')}
            >
              {busy === 'pwd' && <LoaderCircle className="size-4 animate-spin" />} Restablecer contraseña
            </button>
            {newPwd && newPwd.length < 6 && <p className="text-xs text-muted">Mínimo 6 caracteres.</p>}
          </section>

          <section className="space-y-3 border-t border-navy-100 pt-6 dark:border-white/10">
            <h3 className="flex items-center gap-2 font-semibold">
              <Power className="size-4" /> {person.activo ? 'Desactivar cuenta' : 'Reactivar cuenta'}
            </h3>
            <p className="text-sm text-muted dark:text-white/60">
              {person.activo
                ? 'La persona ya no podrá ingresar a la app. Sus pedidos e historial se conservan.'
                : 'La persona podrá volver a ingresar con su DNI y contraseña. Cuenta dentro del límite de usuarios activos.'}
            </p>
            {confirmToggle ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">¿Confirmas?</span>
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={async () => {
                    const ok = await run('toggle', () => setActivo(person.id, !person.activo), person.activo ? 'Cuenta desactivada.' : 'Cuenta reactivada.')
                    setConfirmToggle(false)
                    if (ok) onSaved?.()
                  }}
                  className={`${primaryBtn} ${person.activo ? 'bg-brand-600 hover:bg-brand-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {busy === 'toggle' && <LoaderCircle className="size-4 animate-spin" />}
                  Sí, {person.activo ? 'desactivar' : 'reactivar'}
                </button>
                <button type="button" className={ghostBtn} onClick={() => setConfirmToggle(false)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={!!busy}
                onClick={() => setConfirmToggle(true)}
                className={`${ghostBtn} ${person.activo ? 'border-brand-200 text-brand-600 hover:bg-brand-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
              >
                {person.activo ? 'Desactivar cuenta' : 'Reactivar cuenta'}
              </button>
            )}
          </section>
        </>
      )}
    </div>
  )
}
