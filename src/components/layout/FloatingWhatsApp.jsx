import { motion } from 'motion/react'
import SocialIcon from '../ui/SocialIcon'
import { contact } from '../../data/site'

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={contact.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Pide tu gas por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-5 right-5 z-30 flex items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.7)] sm:bottom-7 sm:right-7"
    >
      <SocialIcon name="WhatsApp" className="size-7" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap font-semibold transition-all duration-300 group-hover:max-w-44 group-hover:pl-2 group-hover:pr-1 sm:inline">
        Pide por WhatsApp
      </span>
    </motion.a>
  )
}
