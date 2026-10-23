import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

const panels = {
  center: {
    wrapper: 'grid place-items-center p-4',
    panel: 'max-h-[85vh] w-full max-w-2xl rounded-3xl',
    motion: { initial: { y: 24, scale: 0.97 }, animate: { y: 0, scale: 1 }, exit: { y: 12, opacity: 0 } },
  },
  drawer: {
    wrapper: 'flex justify-end',
    panel: 'h-full w-full max-w-xl',
    motion: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  },
}

// Modal accesible con cierre por Escape, clic fuera y botón. variant: 'center' | 'drawer'.
export default function Modal({ open, onClose, labelledBy, variant = 'center', children }) {
  const v = panels[variant]

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm ${v.wrapper}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className={`relative overflow-y-auto bg-white p-8 text-ink shadow-2xl sm:p-10 dark:bg-navy-900 dark:text-white ${v.panel}`}
            {...v.motion}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-surface transition hover:bg-navy-50 dark:bg-white/10 dark:hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
