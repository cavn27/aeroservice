import Hero from '../../components/sections/Hero'
import QuickAccess from '../../components/sections/QuickAccess'
import News from '../../components/sections/News'
import Faq from '../../components/sections/Faq'
import Contact from '../../components/sections/Contact'
import Sectors from './Sectors'
import VideoBanner from './VideoBanner'
import Solutions from './Solutions'
import Newsletter from './Newsletter'
import ClubBanner from './ClubBanner'
import DocumentGrid from '../../components/sections/DocumentGrid'
import { contactChannels, faqs, heroSlides, news, newsCategories, quickAccess, resources } from '../../data/empresas'

export default function EmpresasPage() {
  return (
    <>
      <title>Aerogas | Empresas</title>
      <Hero slides={heroSlides} secondaryCta={{ label: 'Ver soluciones', href: '#soluciones' }} />
      <QuickAccess items={quickAccess} />
      <Sectors />
      <VideoBanner />
      <Solutions />
      <Newsletter />
      <News items={news} categories={newsCategories} />
      <ClubBanner />
      <Faq items={faqs} />
      <DocumentGrid
        eyebrow="Documentos"
        title="Links de interés"
        description="Nos interesa que siempre estés informado y tengas lo que necesitas a mano."
        items={resources}
      />
      <Contact
        channels={contactChannels}
        image="/images/empresas/contacto.jpg"
        description="Si no encuentras lo que buscas, contáctanos a través de nuestros canales empresariales."
      />
    </>
  )
}
