import { motion } from 'motion/react'

// Aparición suave al entrar en pantalla.
export default function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const Component = motion[as]
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}
