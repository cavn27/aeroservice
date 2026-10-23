import { Building2, Car, Container, Factory, Flame, Forklift, Gift, MapPin, ShieldCheck, Truck, Wrench } from 'lucide-react'

// Datos generales del sitio (compartidos entre secciones).
// TODO: reemplazar los datos de contacto marcados como placeholder por los reales de Aerogas.

export const contact = {
  whatsapp: '+00 000 000 000', // placeholder
  whatsappUrl: 'https://wa.me/00000000000', // placeholder
  whatsappBusiness: '+00 000 000 001', // placeholder: WhatsApp empresas
  phone: '000 000 000', // placeholder: central de pedidos
  businessPhone: '000 000 001', // placeholder: empresas
  emergencyPhone: '000 000 002', // placeholder: emergencias 24/7
  address: 'Av. Principal 123, Ciudad', // placeholder
  email: 'contacto@aerogas.com', // placeholder
}

export const segments = [
  { label: 'Personas', to: '/personas' },
  { label: 'Empresas', to: '/empresas' },
  { label: 'Distribuidores', to: '/distribuidores' },
  { label: 'Proveedores', to: '/proveedores' },
]

export const utilityLinks = [
  { label: 'Centro de ayuda', to: '/ayuda' },
  { label: 'Estaciones', to: '/estaciones' },
]

// Menú principal de la sección Personas.
export const mainNav = [
  {
    label: 'Productos',
    items: [
      { label: 'Gas doméstico', description: 'Balones de 10 kg y 15 kg para tu cocina', icon: Flame, href: '#productos' },
      { label: 'Gas a granel', description: 'Tanques estacionarios para edificios y condominios', icon: Building2, href: '#productos' },
      { label: 'GLP vehicular', description: 'Ahorra combustible con autogás', icon: Car, href: '#productos' },
      { label: 'Accesorios', description: 'Válvulas, reguladores y mangueras certificadas', icon: Wrench, href: '#productos' },
    ],
  },
  { label: 'Promociones', href: '#promociones' },
  {
    label: 'Servicios',
    items: [
      { label: 'Pide tu gas', description: 'Delivery a domicilio en minutos', icon: Truck, href: '#pedido' },
      { label: 'Revisión de instalaciones', description: 'Técnicos certificados en tu hogar', icon: ShieldCheck, href: '#servicios' },
      { label: 'Puntos de venta', description: 'Encuentra el más cercano a ti', icon: MapPin, href: '/estaciones' },
      { label: 'Club Aerogas', description: 'Acumula puntos y canjea beneficios', icon: Gift, href: '#beneficios' },
    ],
  },
  { label: 'Noticias', href: '#noticias' },
  { label: 'Sostenibilidad', href: '#sostenibilidad' },
]

// Menú principal de la sección Empresas.
export const empresasNav = [
  {
    label: 'Productos',
    items: [
      { label: 'Gas a granel', description: 'Tanques estacionarios con recarga programada', icon: Container, href: '#soluciones' },
      { label: 'GLP industrial', description: 'Energía para hornos, calderas y procesos', icon: Factory, href: '#sectores' },
      { label: 'GLP para flotas', description: 'Autogás para montacargas y vehículos', icon: Forklift, href: '#soluciones' },
      { label: 'Redes e instalaciones', description: 'Diseño, montaje y mantenimiento', icon: Wrench, href: '#soluciones' },
    ],
  },
  { label: 'Soluciones', href: '#soluciones' },
  { label: 'Noticias', href: '#noticias' },
  { label: 'Sostenibilidad', href: '#sostenibilidad' },
]

// Antepone una ruta a los enlaces de ancla (#seccion) para usarlos desde otra página.
const withBase = (items, base) =>
  items.map((item) => ({
    ...item,
    href: item.href?.startsWith('#') ? base + item.href : item.href,
    items: item.items && withBase(item.items, base),
  }))

// Acceso al portal administrativo (login pendiente de implementar).
export const loginAction = { label: 'Ingresar', href: '/ingresar', variant: 'primary' }

// Configuración del encabezado por segmento (menú + botones de acción).
export const headerBySegment = {
  personas: {
    nav: mainNav,
    actions: [loginAction],
  },
  empresas: {
    nav: empresasNav,
    actions: [
      { label: 'Hazte cliente', href: '#contacto', variant: 'outline' },
      loginAction,
    ],
  },
  distribuidores: {
    nav: [
      { label: 'Postulación', href: '#postulacion' },
      { label: 'Red de distribuidores', href: '#red' },
      { label: 'Noticias', href: '#noticias' },
      { label: 'Preguntas frecuentes', href: '#ayuda' },
      { label: 'Sostenibilidad', href: '#sostenibilidad' },
    ],
    actions: [
      { label: 'Postula aquí', href: '#postula', variant: 'outline' },
      loginAction,
    ],
  },
  proveedores: {
    nav: [
      { label: 'Comunicados', href: '#comunicados' },
      { label: 'Videos', href: '#videos' },
      { label: 'Archivos', href: '#archivos' },
      { label: 'Ayuda', href: '#ayuda' },
      { label: 'Links de interés', href: '#links' },
      { label: 'Postulaciones', href: '#postulaciones' },
    ],
    actions: [loginAction],
  },
}

// Páginas generales (centro de ayuda, estaciones) usan el menú de Personas apuntando a sus secciones.
const generalHeader = {
  nav: withBase(mainNav, '/personas'),
  actions: headerBySegment.personas.actions,
}
headerBySegment.ayuda = generalHeader
headerBySegment.estaciones = generalHeader

export const footerColumns = [
  {
    title: 'Nosotros',
    links: ['Historia', 'Quiénes somos', 'Políticas corporativas', 'Memorias', 'Directorio'],
  },
  {
    title: 'Enlaces de interés',
    links: ['Trabaja con nosotros', 'Canal de reporte ético', 'Protección de datos', 'Seguridad con el gas', 'Información oficial'],
  },
  {
    title: 'Ayuda',
    links: ['Contáctanos', { label: 'Centro de ayuda', href: '/ayuda' }, { label: 'Estaciones', href: '/estaciones' }, 'Libro de reclamaciones'],
  },
]

export const socials = [
  { name: 'Facebook', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'YouTube', href: '#' },
  { name: 'TikTok', href: '#' },
]
