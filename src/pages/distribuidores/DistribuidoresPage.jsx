import PageHero from '../../components/sections/PageHero'
import DiagonalBanner from '../../components/sections/DiagonalBanner'
import News from '../../components/sections/News'
import Faq from '../../components/sections/Faq'
import Contact from '../../components/sections/Contact'
import Application from './Application'
import Perks from './Perks'
import ApplyForm from './ApplyForm'
import { contactChannels, faqs, hero, network, news, newsCategories } from '../../data/distribuidores'

export default function DistribuidoresPage() {
  return (
    <>
      <title>Aerogas | Distribuidores</title>
      <PageHero {...hero} />
      <Application />
      <Perks />
      <ApplyForm />
      <DiagonalBanner id="red" {...network} />
      <Faq items={faqs} />
      <News items={news} categories={newsCategories} />
      <Contact channels={contactChannels} image="/images/contacto.jpg" />
    </>
  )
}
