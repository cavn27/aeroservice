import { BadgeCheck, GraduationCap, Headset, LayoutDashboard, MessagesSquare, Truck } from 'lucide-react'
import { WhatsAppIcon } from '../components/ui/SocialIcon'
import { contact } from './site'

// Contenido de la sección Distribuidores (equivalente a "Concesionarios" en Copec).
// Las fotos están en /public/images/distribuidores (Unsplash); reemplázalas por fotos propias de Aerogas.

const img = (name) => `/images/distribuidores/${name}.jpg`

export const hero = {
  breadcrumb: 'Distribuidores',
  title: 'Portal de Distribuidores',
  description: '¡Conoce cómo ser parte de nuestra gran red de distribuidores a lo largo de todo el país!',
  image: img('hero'),
  actions: [
    { label: 'Postula aquí', href: '#postula', variant: 'brand' },
    { label: 'Ingresar al portal', href: '/ingresar', variant: 'ghostWhite' },
  ],
}

// Requisitos visibles y requisitos adicionales (se despliegan con "Conocer todos los requisitos").
// TODO: validar con el área comercial/legal de Aerogas.
export const requirements = [
  'Empresa formalmente constituida, con giro para la venta y distribución de gas licuado u otros negocios afines. Se solicitará durante el proceso, una vez que hayas sido seleccionado.',
  'El representante legal debe contar preferentemente con formación técnica o profesional y experiencia laboral mínima de 5 años.',
  'Ni el representante legal ni los socios deben tener antecedentes legales o comerciales incompatibles al momento de postular.',
]

export const moreRequirements = [
  'Disponer de un local o terreno que cumpla con la normativa vigente para el almacenamiento de cilindros de GLP.',
  'Contar con capital de trabajo para la operación inicial (se informa según la zona y el formato del punto de venta).',
  'Disponibilidad para participar en el programa de capacitación de Aerogas antes de iniciar la operación.',
  'Compromiso con los estándares de seguridad, atención al cliente y peso exacto de la marca.',
]

export const testimonials = {
  title: 'Historias de nuestros distribuidores',
  images: [img('testimonio-1'), img('testimonio-2'), img('testimonio-3'), img('testimonio-4')],
  // TODO: reemplazar por el video de testimonios (URL de embed de YouTube o Vimeo).
  embedUrl: '',
}

export const perks = [
  { title: 'Respaldo de marca', description: 'Opera con una marca reconocida y confiable para miles de hogares.', icon: BadgeCheck },
  { title: 'Abastecimiento garantizado', description: 'Despachos programados desde nuestra planta para que no te falte stock.', icon: Truck },
  { title: 'Capacitación continua', description: 'Formación en seguridad, gestión comercial y atención al cliente.', icon: GraduationCap },
  { title: 'Herramientas digitales', description: 'Portal web para pedidos, facturación y seguimiento de tus ventas.', icon: LayoutDashboard },
]

export const steps = [
  { title: 'Envía tu postulación', description: 'Completa el formulario con tus datos y la zona donde te gustaría operar.' },
  { title: 'Evaluación de perfil', description: 'Revisamos tu experiencia, la zona y la factibilidad del punto de venta.' },
  { title: 'Entrevista y visita técnica', description: 'Conversamos contigo y visitamos el local o terreno propuesto.' },
  { title: 'Capacitación', description: 'Te preparamos en seguridad, operación y herramientas de la marca.' },
  { title: 'Inicio de operación', description: '¡Bienvenido a la red! Te acompañamos en tus primeros meses.' },
]

export const network = {
  title: 'Accede a nuestra gran red de distribuidores',
  description: 'Encuentra el punto de venta Aerogas más cercano a ti.',
  image: img('red'),
  action: { label: 'Ir al buscador', href: '/estaciones' },
}

export const faqs = [
  {
    q: '¿En qué horario atienden los distribuidores Aerogas?',
    a: 'Cada distribuidor define su horario según la zona, con un mínimo de atención establecido por Aerogas. Puedes revisarlo en el buscador de puntos de venta.',
  },
  {
    q: '¿Cuánto capital se necesita para postular?',
    a: 'Depende de la zona y del formato del punto de venta (depósito, tienda o reparto). Te lo informaremos en detalle durante la etapa de evaluación.',
  },
  {
    q: '¿Se solicita experiencia laboral previa?',
    a: 'Sí, valoramos una experiencia laboral mínima de 5 años, idealmente en gestión de negocios, ventas o logística.',
  },
  {
    q: '¿Qué tipo de sociedad se requiere?',
    a: 'Una empresa formalmente constituida con giro para la venta y distribución de gas licuado. Puedes constituirla una vez seleccionado.',
  },
  {
    q: '¿Puedo ser distribuidor y tener otro trabajo en paralelo?',
    a: 'Buscamos distribuidores comprometidos con la operación diaria. Si tienes otra actividad, deberás contar con un administrador a cargo del punto de venta.',
  },
  {
    q: '¿Puedo elegir la ciudad donde postular?',
    a: 'Sí, puedes indicar tu zona de interés. La asignación final depende de la disponibilidad y del plan de expansión de la red.',
  },
  {
    q: '¿Cuánto dura el proceso de postulación?',
    a: 'El proceso completo toma normalmente entre 2 y 4 meses, desde la postulación hasta el inicio de operación.',
  },
  {
    q: '¿En qué consiste el proceso de postulación?',
    a: 'Postulación en línea, evaluación de perfil, entrevista, visita técnica al local, capacitación e inicio de operación.',
  },
]

export const newsCategories = ['Todas', 'Concursos', 'Novedades', 'Sostenibilidad']

export const news = [
  {
    category: 'Novedades',
    date: '2026-10-02',
    title: 'Más de 300 emprendedores participaron en el encuentro anual de distribuidores',
    excerpt: 'Una jornada de capacitación comercial, seguridad y nuevas herramientas digitales.',
    image: '/images/news-evento.jpg',
  },
  {
    category: 'Concursos',
    date: '2026-09-26',
    title: 'Premiamos a los distribuidores con mejor atención al cliente del año',
    excerpt: 'Reconocimos a los puntos de venta mejor evaluados por nuestros clientes.',
    image: '/images/news-premio.jpg',
  },
  {
    category: 'Sostenibilidad',
    date: '2026-09-23',
    title: 'Distribuidores se suman al programa de reciclaje de envases y válvulas',
    excerpt: 'Una red de puntos limpios para dar una segunda vida a los materiales.',
    image: '/images/news-solar.jpg',
  },
  {
    category: 'Novedades',
    date: '2026-09-12',
    title: 'Nuevo portal web para distribuidores: pedidos y facturación en línea',
    excerpt: 'Más rapidez y control para gestionar tu negocio desde cualquier lugar.',
    image: '/images/empresas/sol-portal.jpg',
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
  { title: 'Atención a distribuidores', text: 'Ponte en contacto con uno de nuestros ejecutivos al', highlight: contact.businessPhone, icon: Headset },
  {
    title: 'Preguntas frecuentes',
    text: 'Encuentra lo que necesitas en nuestro centro de ayuda.',
    icon: MessagesSquare,
    link: { label: 'Ir al centro de ayuda', href: '/ayuda' },
  },
]
