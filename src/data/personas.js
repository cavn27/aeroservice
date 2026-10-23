import {
  Building2,
  Car,
  Flame,
  Gift,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Wrench,
  Leaf,
  Headset,
  MessagesSquare,
  Siren,
} from 'lucide-react'
import { WhatsAppIcon } from '../components/ui/SocialIcon'
import { contact } from './site'

// Contenido de la sección Personas.
// Las fotos están en /public/images (Unsplash); reemplázalas por fotos propias de Aerogas.

export const heroSlides = [
  {
    id: 'hogar',
    eyebrow: 'Gas doméstico',
    title: 'La energía que enciende cada momento en tu hogar',
    description: 'Pide tu balón Aerogas y recíbelo en la puerta de tu casa, con la seguridad y el peso exacto que mereces.',
    cta: { label: 'Pide tu balón', href: '#pedido' },
    image: '/images/hero-hogar.jpg',
  },
  {
    id: 'vehicular',
    eyebrow: 'GLP vehicular',
    title: 'Rinde más en cada kilómetro con autogás',
    description: 'Convierte tu vehículo a GLP y ahorra frente a la gasolina, con una combustión más limpia.',
    cta: { label: 'Conoce más', href: '#productos' },
    image: '/images/hero-vehicular.jpg',
  },
  {
    id: 'reparto',
    eyebrow: 'Cobertura',
    title: 'Llegamos a donde estés, cuando lo necesitas',
    description: 'Una red de distribuidores y camiones que recorre la región para que nunca te quedes sin gas.',
    cta: { label: 'Encuentra tu punto', href: '/estaciones' },
    image: '/images/hero-reparto.jpg',
  },
  {
    id: 'granel',
    eyebrow: 'Gas a granel',
    title: 'Gas centralizado para tu edificio o condominio',
    description: 'Tanques estacionarios con monitoreo y recarga programada. Olvídate de cambiar balones.',
    cta: { label: 'Solicita una evaluación', href: '#productos' },
    image: '/images/hero-granel.jpg',
  },
]

export const quickAccess = [
  { label: 'Pide tu balón', icon: ShoppingBag, href: '#pedido' },
  { label: 'App Aerogas', icon: Smartphone, href: '#beneficios' },
  { label: 'Club Aerogas', icon: Gift, href: '#beneficios' },
  { label: 'GLP vehicular', icon: Car, href: '#productos' },
  { label: 'Gas a granel', icon: Building2, href: '#productos' },
  { label: 'Puntos de venta', icon: MapPin, href: '/estaciones' },
  { label: 'Revisión técnica', icon: Wrench, href: '#servicios' },
  { label: 'Uso seguro', icon: ShieldCheck, href: '#ayuda' },
  { label: 'Gas doméstico', icon: Flame, href: '#productos' },
  { label: 'Sostenibilidad', icon: Leaf, href: '#sostenibilidad' },
]

export const benefits = [
  {
    tag: 'Club Aerogas',
    title: 'Club Aerogas',
    description: 'Acumula puntos con cada recarga y canjéalos por descuentos y premios.',
    image: '/images/club.jpg',
    href: '#',
  },
  {
    tag: 'App Aerogas',
    title: 'App Aerogas',
    description: 'Pide tu balón, sigue tu pedido en tiempo real y paga desde tu celular.',
    image: '/images/app.jpg',
    href: '#',
  },
  {
    tag: 'Taxistas',
    title: 'Aerogas Taxi',
    description: 'Precios preferentes en GLP vehicular para conductores de taxi y apps de movilidad.',
    image: '/images/taxistas.jpg',
    href: '#',
  },
  {
    tag: 'Transportistas',
    title: 'Aerogas Carga',
    description: 'Beneficios y crédito para flotas y transportistas que recorren el país.',
    image: '/images/transportistas.jpg',
    href: '#',
  },
]

export const promotions = [
  {
    badge: 'Todos los días',
    title: 'Pide por la App Aerogas',
    description: '5% de descuento en tu balón de 10 kg pagando con billetera digital desde la app.',
    image: '/images/promo-familia.jpg',
  },
  {
    badge: 'Lunes',
    title: 'Lunes de autogás',
    description: 'Doble puntos Club Aerogas al cargar GLP vehicular en gasocentros asociados.',
    image: '/images/promo-vehicular.jpg',
  },
  {
    badge: 'Fin de mes',
    title: 'Kit de seguridad',
    description: 'Lleva tu regulador y manguera certificados con precio especial al comprar tu balón.',
    image: '/images/promo-cocina.jpg',
  },
  {
    badge: 'Nuevos clientes',
    title: 'Tu primera recarga',
    description: 'Regístrate en el Club Aerogas y obtén un descuento en tu primera compra.',
    image: '/images/promo-hogar.jpg',
  },
]

export const distributorPerks = ['Respaldo de una marca reconocida', 'Abastecimiento continuo', 'Capacitación y soporte comercial']

export const newsCategories = ['Todas', 'Novedades', 'Sostenibilidad', 'Seguridad', 'Comunicados']

export const news = [
  {
    category: 'Novedades',
    date: '2026-09-28',
    title: 'Aerogas recibe reconocimiento por excelencia en atención al cliente',
    excerpt: 'El premio destaca la rapidez del delivery y la calidad del servicio postventa en la región.',
    image: '/images/news-premio.jpg',
  },
  {
    category: 'Novedades',
    date: '2026-10-02',
    title: 'Más de 300 emprendedores participaron en el encuentro de distribuidores Aerogas',
    excerpt: 'Una jornada de capacitación comercial, seguridad y nuevas herramientas digitales.',
    image: '/images/news-evento.jpg',
  },
  {
    category: 'Sostenibilidad',
    date: '2026-09-23',
    title: 'Nuestra planta envasadora incorpora energía solar en sus operaciones',
    excerpt: 'Paneles fotovoltaicos que reducen la huella de carbono del proceso de envasado.',
    image: '/images/news-solar.jpg',
  },
  {
    category: 'Seguridad',
    date: '2026-09-15',
    title: 'Campaña de revisión gratuita de instalaciones domésticas',
    excerpt: 'Técnicos certificados visitan hogares para revisar válvulas, reguladores y mangueras.',
    image: '/images/news-seguridad.jpg',
  },
  {
    category: 'Comunicados',
    date: '2026-09-05',
    title: 'Ampliamos nuestro centro de distribución para atender más pedidos',
    excerpt: 'La nueva capacidad logística permitirá reducir los tiempos de entrega.',
    image: '/images/news-planta.jpg',
  },
]

export const faqs = [
  {
    q: '¿Cómo pido un balón de gas a domicilio?',
    a: 'Puedes pedirlo desde la App Aerogas, por WhatsApp o llamando a nuestra central de pedidos. Indica tu dirección y el tipo de balón, y un distribuidor autorizado lo llevará a tu domicilio.',
  },
  {
    q: '¿Qué hago si siento olor a gas en casa?',
    a: 'Cierra la válvula del balón, abre puertas y ventanas para ventilar y no enciendas ni apagues interruptores, fósforos ni aparatos eléctricos. Sal del ambiente y comunícate con nuestra línea de emergencias desde fuera de la vivienda.',
  },
  {
    q: '¿Cómo reconozco un balón Aerogas original y seguro?',
    a: 'Verifica que tenga el precinto de seguridad intacto con el logo Aerogas, que el envase no presente abolladuras ni óxido y que el distribuidor te entregue comprobante de pago.',
  },
  {
    q: '¿Cada cuánto debo cambiar la manguera y el regulador?',
    a: 'Revisa la manguera periódicamente y cámbiala si está reseca, agrietada o según la fecha de vencimiento indicada por el fabricante. Usa siempre reguladores y mangueras certificados.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Aceptamos efectivo, tarjetas de débito y crédito, y billeteras digitales al pedir desde la App Aerogas. Consulta los medios disponibles con tu distribuidor.',
  },
]

export const contactChannels = [
  {
    title: 'WhatsApp',
    text: 'Escríbenos al',
    highlight: contact.whatsapp,
    icon: WhatsAppIcon,
    tone: 'whatsapp',
    link: { label: 'Escribir por WhatsApp', href: contact.whatsappUrl, external: true },
  },
  { title: 'Central de pedidos', text: 'Pide tu gas o habla con un ejecutivo al', highlight: contact.phone, icon: Headset },
  { title: 'Emergencias 24/7', text: '¿Fuga de gas? Sal del lugar y llama al', highlight: contact.emergencyPhone, icon: Siren, tone: 'brand' },
  {
    title: 'Preguntas frecuentes',
    text: 'Encuentra lo que necesitas en nuestro centro de ayuda.',
    icon: MessagesSquare,
    link: { label: 'Ir al centro de ayuda', href: '/ayuda' },
  },
]
