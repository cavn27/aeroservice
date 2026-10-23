import Hero from '../../components/sections/Hero'
import QuickAccess from '../../components/sections/QuickAccess'
import News from '../../components/sections/News'
import Faq from '../../components/sections/Faq'
import Contact from '../../components/sections/Contact'
import Benefits from './Benefits'
import Promotions from './Promotions'
import DistributorCta from './DistributorCta'
import { contactChannels, faqs, heroSlides, news, newsCategories, quickAccess } from '../../data/personas'

export default function PersonasPage() {
  return (
    <>
      <title>Aerogas | Personas</title>
      <Hero slides={heroSlides} secondaryCta={{ label: 'Ver promociones', href: '#promociones' }} />
      <QuickAccess items={quickAccess} />
      <Benefits />
      <Promotions />
      <DistributorCta />
      <News items={news} categories={newsCategories} />
      <Faq items={faqs} />
      <Contact id="pedido" channels={contactChannels} image="/images/contacto.jpg" />
    </>
  )
}
