import {
  BarChart3,
  Container,
  CreditCard,
  Factory,
  Forklift,
  Headset,
  Leaf,
  Siren,
  Truck,
  MessagesSquare,
} from 'lucide-react'
import { WhatsAppIcon } from '../components/ui/SocialIcon'
import { contact } from './site'

// Contenido de la sección Empresas.
// Las fotos están en /public/images/empresas (Unsplash); reemplázalas por fotos propias de Aerogas.

const img = (name) => `/images/empresas/${name}.jpg`

export const heroSlides = [
  {
    id: 'empresa',
    eyebrow: 'Aerogas Empresas',
    title: 'Soluciones energéticas para tu empresa',
    description: 'Optimiza la operación de tu negocio con GLP a granel, abastecimiento programado y asesoría técnica especializada.',
    cta: { label: 'Quiero ser cliente', href: '#contacto' },
    image: img('hero-industria'),
  },
  {
    id: 'flotas',
    eyebrow: 'Flotas y logística',
    title: 'Controla el consumo de toda tu flota',
    description: 'Tarjetas empresariales, crédito y reportes en línea para montacargas y vehículos a GLP.',
    cta: { label: 'Conoce las soluciones', href: '#soluciones' },
    image: img('hero-flotas'),
  },
  {
    id: 'obras',
    eyebrow: 'Proyectos',
    title: 'Diseñamos e instalamos tu red de gas',
    description: 'Ingeniería, montaje de tanques y mantenimiento preventivo con técnicos certificados.',
    cta: { label: 'Solicita una visita técnica', href: '#contacto' },
    image: img('hero-obras'),
  },
]

export const quickAccess = [
  { label: 'Gas a granel', icon: Container, href: '#soluciones' },
  { label: 'GLP industrial', icon: Factory, href: '#sectores' },
  { label: 'Flotas', icon: Forklift, href: '#soluciones' },
  { label: 'Medios de pago', icon: CreditCard, href: '#soluciones' },
  { label: 'Gestión en línea', icon: BarChart3, href: '#soluciones' },
  { label: 'Abastecimiento', icon: Truck, href: '#soluciones' },
  { label: 'Sostenibilidad', icon: Leaf, href: '#sostenibilidad' },
]

export const sectors = [
  {
    title: 'Industria',
    description: 'GLP para hornos, calderas y procesos térmicos con suministro continuo y seguro.',
    image: img('sector-industria'),
  },
  {
    title: 'Restaurantes y comercios',
    description: 'Gas a granel para cocinas profesionales: sin cortes ni cambios de balón en plena hora punta.',
    image: img('sector-restaurantes'),
  },
  {
    title: 'Agroindustria',
    description: 'Energía para secado de granos, invernaderos y riego en zonas sin red de gas natural.',
    image: img('sector-agro'),
  },
  {
    title: 'Construcción y minería',
    description: 'Abastecimiento en campamentos y obras, incluso en zonas remotas.',
    image: img('sector-construccion'),
  },
  {
    title: 'Hotelería',
    description: 'Agua caliente, calefacción y cocina para hoteles, clínicas y condominios.',
    image: img('sector-hoteleria'),
  },
]

export const video = {
  title: '¡Descubre los beneficios de ser parte de Aerogas!',
  image: img('video'),
  // TODO: reemplazar por el video corporativo (URL de embed de YouTube o Vimeo).
  embedUrl: '',
}

export const solutions = [
  {
    title: 'App Aerogas Empresa',
    description: 'Programa pedidos, revisa el nivel de tus tanques y descarga facturas desde tu celular.',
    image: img('sol-app'),
  },
  {
    title: 'Tarjeta empresarial',
    description: 'Línea de crédito para tus compras de GLP con control de consumo por sede o vehículo.',
    image: img('sol-tarjeta'),
  },
  {
    title: 'Telemetría de tanques',
    description: 'Sensores que miden el nivel en tiempo real y activan la recarga antes de que te quedes sin gas.',
    image: img('sol-telemetria'),
  },
  {
    title: 'Portal de clientes',
    description: 'Estados de cuenta, reportes de consumo y solicitudes de servicio técnico en un solo lugar.',
    image: img('sol-portal'),
  },
  {
    title: 'Abastecimiento programado',
    description: 'Rutas de reparto planificadas según tu consumo histórico para operar sin interrupciones.',
    image: '/images/hero-reparto.jpg',
  },
  {
    title: 'Almacenamiento y logística',
    description: 'Asesoría para el almacenamiento seguro de cilindros y tanques según la normativa vigente.',
    image: img('sol-almacen'),
  },
]

export const newsletterStrips = [img('hero-obras'), '/images/hero-reparto.jpg', img('strip-puerto'), img('strip-eolica')]

export const newsCategories = ['Todas', 'Comunicados', 'Novedades', 'Nuevas energías']

export const news = [
  {
    category: 'Comunicados',
    date: '2026-09-28',
    title: 'Aerogas impulsa campaña de prevención de riesgos en plantas industriales',
    excerpt: 'Capacitaciones en manejo seguro de GLP para equipos de operación y mantenimiento.',
    image: img('hero-obras'),
  },
  {
    category: 'Novedades',
    date: '2026-09-25',
    title: 'Nueva app Aerogas Empresa: pedidos y facturas en un solo lugar',
    excerpt: 'Los clientes empresariales ya pueden gestionar sus pedidos y consumo desde el celular.',
    image: img('sol-app'),
  },
  {
    category: 'Nuevas energías',
    date: '2026-09-22',
    title: 'Firmamos acuerdo de suministro con energía renovable para nuestras plantas',
    excerpt: 'Un paso más en nuestra hoja de ruta de reducción de emisiones.',
    image: img('strip-eolica'),
  },
  {
    category: 'Novedades',
    date: '2026-09-18',
    title: 'La telemetría de tanques llega a más clientes empresariales',
    excerpt: 'El monitoreo remoto reduce los quiebres de stock y optimiza las rutas de reparto.',
    image: img('sol-telemetria'),
  },
  {
    category: 'Comunicados',
    date: '2026-09-10',
    title: 'Ampliamos la cobertura de gas a granel para el sector agroindustrial',
    excerpt: 'Nuevas rutas de abastecimiento para fundos y plantas de procesamiento.',
    image: img('sector-agro'),
  },
]

export const club = {
  title: '¡Tu empresa también suma en el Club Aerogas!',
  description: 'Acumula puntos con cada compra y canjéalos por servicios técnicos y beneficios exclusivos.',
  cta: { label: 'Ver más', href: '#' },
}

export const faqs = [
  {
    q: '¿Cómo me hago cliente empresarial de Aerogas?',
    a: 'Completa el formulario de contacto o escríbenos por WhatsApp empresarial. Un ejecutivo comercial evaluará tu consumo y te propondrá la solución más adecuada.',
  },
  {
    q: '¿Qué necesito para instalar un tanque de gas a granel?',
    a: 'Realizamos una visita técnica para evaluar el espacio, las distancias de seguridad y el consumo estimado. Nuestro equipo se encarga del diseño, la instalación y las certificaciones requeridas.',
  },
  {
    q: '¿Cómo funciona la telemetría de tanques?',
    a: 'Un sensor instalado en el tanque informa el nivel de gas en tiempo real. Cuando baja de un umbral definido, se programa automáticamente la recarga.',
  },
  {
    q: '¿Puedo asignar límites de consumo por sede o vehículo?',
    a: 'Sí. Desde el portal de clientes o la app Aerogas Empresa puedes definir límites, centros de costo y recibir reportes de consumo.',
  },
  {
    q: '¿Qué medios de pago y crédito ofrecen a empresas?',
    a: 'Ofrecemos pago contado, transferencia y líneas de crédito sujetas a evaluación comercial. Consulta con tu ejecutivo las condiciones disponibles.',
  },
]

export const resources = [
  { title: 'Hoja de datos de seguridad del GLP', href: '#' },
  { title: 'Manual de instalación de tanques estacionarios', href: '#' },
  { title: 'Procedimiento de carga y descarga en planta', href: '#' },
]

export const contactChannels = [
  {
    title: 'WhatsApp empresarial',
    text: 'Escríbenos al',
    highlight: contact.whatsapp,
    icon: WhatsAppIcon,
    tone: 'whatsapp',
    link: { label: 'Escribir por WhatsApp', href: contact.whatsappUrl, external: true },
  },
  { title: 'Contacto comercial', text: 'Habla con un ejecutivo al', highlight: contact.businessPhone, icon: Headset },
  {
    title: 'Formulario de contacto',
    text: 'Déjanos tus datos y te contactaremos a la brevedad.',
    icon: MessagesSquare,
    link: { label: 'Ir al formulario', href: '#' },
  },
  { title: 'Emergencias 24/7', text: 'Atención de emergencias en planta al', highlight: contact.emergencyPhone, icon: Siren, tone: 'brand' },
]

