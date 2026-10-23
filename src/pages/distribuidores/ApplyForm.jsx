import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Send } from 'lucide-react'
import Reveal from '../../components/ui/Reveal'

const fieldClass =
  'h-13 w-full rounded-2xl border border-navy-100 bg-white px-5 text-ink outline-none transition placeholder:text-muted/60 focus:border-navy-500 focus:ring-4 focus:ring-navy-500/15'

function Field({ label, id, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  )
}

export default function ApplyForm() {
  const [sent, setSent] = useState(false)

  // TODO: enviar los datos a un backend o CRM. Hoy solo muestra la confirmación en pantalla.
  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="postula" className="scroll-mt-24 py-24 lg:py-32">
      <div className="container-page">
        <Reveal className="grid overflow-hidden rounded-[2rem] bg-white shadow-card-hover ring-1 ring-navy-100/60 lg:grid-cols-5">
          <div className="relative min-h-64 lg:col-span-2">
            <img src="/images/distribuidores/postula.jpg" alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/50 to-navy-900/10" />
            <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
              <h2 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">Postula y sé parte de la red Aerogas</h2>
              <p className="mt-3 text-white/85">Déjanos tus datos y un ejecutivo se pondrá en contacto contigo.</p>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:col-span-3 lg:p-12">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid h-full place-items-center py-10 text-center"
                >
                  <div>
                    <CheckCircle2 className="mx-auto size-16 text-emerald-500" />
                    <h3 className="mt-5 text-2xl font-bold">¡Recibimos tu postulación!</h3>
                    <p className="mt-2 text-muted">Te contactaremos dentro de los próximos días hábiles.</p>
                    <button type="button" onClick={() => setSent(false)} className="mt-6 font-semibold text-navy-600 hover:underline">
                      Enviar otra postulación
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0, y: -8 }} className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nombre completo" id="ap-nombre">
                    <input id="ap-nombre" name="nombre" required autoComplete="name" className={fieldClass} />
                  </Field>
                  <Field label="Correo electrónico" id="ap-email">
                    <input id="ap-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
                  </Field>
                  <Field label="Teléfono" id="ap-telefono">
                    <input id="ap-telefono" name="telefono" type="tel" required autoComplete="tel" className={fieldClass} />
                  </Field>
                  <Field label="Ciudad o zona de interés" id="ap-ciudad">
                    <input id="ap-ciudad" name="ciudad" required className={fieldClass} />
                  </Field>
                  <Field label="¿Cuentas con local o terreno?" id="ap-local">
                    <select id="ap-local" name="local" required defaultValue="" className={fieldClass}>
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      <option>Sí, propio</option>
                      <option>Sí, arrendado</option>
                      <option>Aún no</option>
                    </select>
                  </Field>
                  <Field label="Años de experiencia laboral" id="ap-exp">
                    <input id="ap-exp" name="experiencia" type="number" min="0" className={fieldClass} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Cuéntanos sobre ti (opcional)" id="ap-msg">
                      <textarea id="ap-msg" name="mensaje" rows={3} className={`${fieldClass} h-auto py-4`} />
                    </Field>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-muted sm:col-span-2">
                    <input type="checkbox" required className="mt-0.5 size-4 accent-navy-600" />
                    Acepto la política de privacidad y el tratamiento de mis datos para este proceso.
                  </label>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex h-14 items-center gap-2 rounded-full bg-brand-600 px-8 font-semibold text-white shadow-[0_8px_20px_-8px_rgb(227_6_19/0.6)] transition hover:bg-brand-700 active:scale-[0.97]"
                    >
                      Enviar postulación <Send className="size-4" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
