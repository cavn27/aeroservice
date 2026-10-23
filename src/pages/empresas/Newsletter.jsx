import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Send } from 'lucide-react'
import Reveal from '../../components/ui/Reveal'
import { newsletterStrips } from '../../data/empresas'

export default function Newsletter() {
  const [sent, setSent] = useState(false)

  // TODO: conectar con el servicio de newsletter (Mailchimp, Brevo, backend propio, etc.).
  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="container-page pb-24 lg:pb-32">
      <Reveal className="grid overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-600 to-navy-800 lg:grid-cols-2">
        <div className="relative h-56 overflow-hidden sm:h-72 lg:h-auto">
          <div className="absolute inset-0 flex -skew-x-12 scale-x-125 gap-2 bg-white">
            {newsletterStrips.map((src) => (
              <div key={src} className="flex-1 overflow-hidden">
                <img src={src} alt="" loading="lazy" className="size-full skew-x-12 scale-125 object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Suscríbete a nuestro newsletter
          </h2>
          <p className="relative mt-4 text-lg leading-relaxed text-white/80">
            Entérate de las últimas noticias, productos e innovaciones en nuestro newsletter empresarial.
          </p>
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.p
                key="ok"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mt-8 flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-4 font-medium text-white ring-1 ring-white/20"
              >
                <CheckCircle2 className="size-5 text-[#4ade80]" /> ¡Listo! Te avisaremos de nuestras novedades.
              </motion.p>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0, y: -8 }} className="relative mt-8 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Correo corporativo
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="tu@empresa.com"
                  className="h-14 flex-1 rounded-full bg-white px-6 text-ink placeholder:text-muted/70 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/60 px-7 font-semibold text-white transition hover:bg-white hover:text-navy-700"
                >
                  Suscribirme <Send className="size-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  )
}
