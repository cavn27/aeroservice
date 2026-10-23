import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ChevronRight, House } from 'lucide-react'
import Button from '../ui/Button'

// Hero estático para páginas internas: miga de pan, título, bajada y acciones.
// overlap: deja espacio inferior para una barra superpuesta (QuickAccess).
export default function PageHero({ breadcrumb, title, description, image, actions = [], overlap = false }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <motion.img
        src={image}
        alt=""
        className="absolute inset-0 -z-10 size-full object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/75 to-navy-900/20" />

      {/* Acento diagonal con esfera, inspirado en la línea gráfica de la marca */}
      <div className="pointer-events-none absolute -bottom-10 right-0 -z-10 hidden h-[130%] w-48 origin-bottom-right rotate-[38deg] bg-gradient-to-t from-navy-500 to-navy-500/0 md:block" />
      <motion.div
        className="pointer-events-none absolute bottom-16 right-[8%] -z-10 hidden size-24 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0,#bfdbfe_25%,#3b82f6_60%,#1e3a8a_100%)] shadow-[0_0_60px_rgb(59_130_246/0.5)] md:block"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 120, damping: 14 }}
      />

      <div className={`container-page flex min-h-[460px] flex-col justify-center pt-16 sm:min-h-[540px] ${overlap ? 'pb-44' : 'pb-16'}`}>
        <motion.nav
          aria-label="Miga de pan"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-sm text-white/80"
        >
          <Link to="/personas" className="flex items-center gap-1.5 hover:text-white">
            <House className="size-4" /> Inicio
          </Link>
          <ChevronRight className="size-4 text-white/50" />
          <span className="font-medium text-white">{breadcrumb}</span>
        </motion.nav>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-2xl"
        >
          <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">{title}</h1>
          {description && <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/85 sm:text-xl">{description}</p>}
          {actions.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {actions.map((a) => (
                <Button key={a.label} variant={a.variant} size="lg" href={a.href}>
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
