import PageHero from '../../components/sections/PageHero'
import QuickAccess from '../../components/sections/QuickAccess'
import DiagonalBanner from '../../components/sections/DiagonalBanner'
import DocumentGrid from '../../components/sections/DocumentGrid'
import Faq from '../../components/sections/Faq'
import Contact from '../../components/sections/Contact'
import Announcements from './Announcements'
import Videos from './Videos'
import DigitalProcurement from './DigitalProcurement'
import { contactChannels, faqs, files, hero, links, quickAccess, signup } from '../../data/proveedores'

export default function ProveedoresPage() {
  return (
    <>
      <title>Aerogas | Proveedores</title>
      <PageHero {...hero} overlap />
      <div className="bg-surface">
        <QuickAccess items={quickAccess} />
      </div>
      <Announcements />
      <DiagonalBanner id="postulaciones" {...signup} />
      <Videos />
      <DocumentGrid
        id="archivos"
        eyebrow="Archivos"
        title="Descarga de archivos"
        description="Formularios, políticas e instructivos para trabajar con Aerogas."
        items={files}
        searchable
      />
      <DigitalProcurement />
      <Faq items={faqs} />
      <DocumentGrid
        id="links"
        eyebrow="Enlaces"
        title="Links de interés"
        description="Nos interesa que siempre estés informado y tengas lo que necesitas a mano."
        items={links}
        kind="link"
      />
      <Contact channels={contactChannels} image="/images/contacto.jpg" />
    </>
  )
}
