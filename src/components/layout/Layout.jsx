import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { MotionConfig } from 'motion/react'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingWhatsApp from './FloatingWhatsApp'

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Al cambiar de página: ir a la sección del ancla (#seccion) si existe, o al inicio.
  useEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) target.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" />
      <TopBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </MotionConfig>
  )
}
