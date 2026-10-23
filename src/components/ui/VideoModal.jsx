import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Play, X } from 'lucide-react'

// Modal de video. Si no hay embedUrl muestra un aviso de "próximamente".
export default function VideoModal({ open, onClose, title, embedUrl }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 grid place-items-center bg-navy-950/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-3xl bg-navy-900 shadow-2xl"
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={title}
                className="size-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="grid size-full place-items-center p-8 text-center text-white/80">
                <div>
                  <Play className="mx-auto size-12 text-white/40" />
                  <p className="mt-4 text-lg">Muy pronto podrás ver este video aquí.</p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar video"
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-navy-900 hover:bg-white"
            >
              <X className="size-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
