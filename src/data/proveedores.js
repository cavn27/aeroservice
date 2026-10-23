import { BookOpenCheck, FileCheck2, Gavel, Headset, Mail, MessagesSquare, ShieldAlert, ShieldCheck } from 'lucide-react'
import { contact } from './site'

// Contenido de la sección Proveedores.
// TODO: reemplazar enlaces (href: '#') por los PDF y sitios reales, y validar los textos con el área de abastecimiento.

export const hero = {
  breadcrumb: 'Proveedores',
  title: 'Portal de Proveedores de Aerogas',
  description: 'Bienvenido al portal de proveedores, donde podrás revisar tus órdenes de compra en línea, números de confirmación y pagos.',
  image: '/images/proveedores/hero.jpg',
  actions: [
    { label: 'Ingresar al portal', href: '/ingresar', variant: 'brand' },
    { label: 'Quiero ser proveedor', href: '#postulaciones', variant: 'ghostWhite' },
  ],
}

export const quickAccess = [
  { label: 'Política QHSE', icon: ShieldCheck, href: '#archivos' },
  { label: 'Código de ética', icon: BookOpenCheck, href: '#archivos' },
  { label: 'Reporte ético', icon: Gavel, href: '#' },
  { label: 'Prevención de delitos', icon: ShieldAlert, href: '#archivos' },
  { label: 'Requisitos de entrega', icon: FileCheck2, href: '#archivos' },
]

// body: párrafos del comunicado completo. Las tarjetas muestran un extracto y el modal el texto completo.
export const announcements = [
  {
    category: 'Comunicados',
    date: '2026-07-23',
    title: 'Autoagendamiento de entregas para proveedores Aerogas',
    body: [
      'Estimados proveedores:',
      'A partir del 1 de octubre, todos los agendamientos para realizar entregas en nuestra planta de envasado y centros de distribución deberán realizarse a través de la plataforma de autoagendamiento.',
      'Esta herramienta nos permitirá ordenar los horarios de recepción, reducir los tiempos de espera y mejorar la seguridad en los patios de carga.',
      'Puedes revisar el instructivo en la sección de descarga de archivos.',
    ],
  },
  {
    category: 'Comunicados',
    date: '2026-07-23',
    title: 'Actualización de datos de proveedores',
    body: [
      'Informamos que todos los proveedores deben mantener actualizados sus datos tributarios, bancarios y de contacto en el portal.',
      'Los pagos solo se realizarán a cuentas bancarias registradas y validadas a nombre del proveedor.',
      'Descarga el manual de actualización de datos en la sección de archivos.',
    ],
  },
  {
    category: 'Alerta',
    date: '2026-07-23',
    title: 'Alerta a proveedores: evita órdenes de compra falsas',
    body: [
      'Estimados:',
      'Se ha detectado una campaña fraudulenta que utiliza indebidamente nuestra imagen para generar y distribuir órdenes de compra falsas. ¡No te dejes engañar!',
      'Verifica el correo electrónico: los correos oficiales de Aerogas utilizan únicamente nuestro dominio corporativo.',
      'Confirma la orden: ante cualquier duda, valida la orden de compra en el portal de proveedores o con tu contacto habitual de abastecimiento antes de despachar.',
    ],
  },
]

export const signup = {
  title: 'Si quieres postular a ser proveedor completa el formulario',
  description: 'Regístrate en nuestro portal y forma parte de la cadena de abastecimiento de Aerogas.',
  image: '/images/distribuidores/hero.jpg',
  action: { label: 'Formulario de auto-registro', href: '#' },
}

// TODO: reemplazar embedUrl por los videos reales (YouTube/Vimeo embed).
export const videos = [
  { title: 'Bienvenida al portal de proveedores', image: '/images/proveedores/alianza.jpg', embedUrl: '' },
  { title: 'Cómo registrarte en el portal', image: '/images/empresas/sol-portal.jpg', embedUrl: '' },
  { title: 'Emisión de facturas electrónicas', image: '/images/empresas/sol-tarjeta.jpg', embedUrl: '' },
  { title: 'Seguimiento de órdenes de compra', image: '/images/empresas/sol-telemetria.jpg', embedUrl: '' },
  { title: 'Agendamiento de entregas en planta', image: '/images/hero-reparto.jpg', embedUrl: '' },
  { title: 'Consulta de pagos y estados de cuenta', image: '/images/empresas/sol-app.jpg', embedUrl: '' },
]

export const files = [
  { title: 'Manual de actualización de datos de proveedor', href: '#' },
  { title: 'Carta de transferencia bancaria', href: '#' },
  { title: 'Carta notarial para transferencia bancaria', href: '#' },
  { title: 'Declaración de cumplimiento para proveedores extranjeros', href: '#' },
  { title: 'Anexo de cumplimiento, código de ética y libre competencia', href: '#' },
  { title: 'Declaración de vínculo para proveedores persona jurídica', href: '#' },
  { title: 'Declaración de vínculo para proveedores persona natural', href: '#' },
  { title: 'Procedimiento para enviar documentos tributarios electrónicos', href: '#' },
  { title: 'Política QHSE', href: '#' },
  { title: 'Política de prevención de delitos', href: '#' },
  { title: 'Instructivo de autoagendamiento de entregas', href: '#' },
  { title: 'Requisitos de seguridad para entregas en planta', href: '#' },
]

export const digital = {
  title: 'Compras digitales Aerogas',
  description:
    'Aerogas impulsa un proceso de transformación digital, no solo desde el punto de vista de sistemas sino de eficiencia y de relaciones comerciales transparentes, confiables y sostenibles con nuestros proveedores.',
  points: ['Licitaciones y cotizaciones en línea', 'Órdenes de compra y facturación electrónica', 'Seguimiento de pagos en tiempo real'],
  image: '/images/proveedores/compras-digitales.jpg',
  action: { label: 'Conocer más', href: '#' },
}

export const links = [
  { title: 'Administración tributaria', href: '#' },
  { title: 'Indicadores económicos del Banco Central', href: '#' },
  { title: 'Tesorería General', href: '#' },
]

export const faqs = [
  {
    q: '¿Cómo me registro como proveedor de Aerogas?',
    a: 'Completa el formulario de auto-registro con los datos de tu empresa y la documentación solicitada. El área de abastecimiento revisará tu información y te informará el resultado.',
  },
  {
    q: '¿Cómo envío mis facturas?',
    a: 'Las facturas deben emitirse electrónicamente haciendo referencia a la orden de compra correspondiente. Revisa el procedimiento en la sección de descarga de archivos.',
  },
  {
    q: '¿Dónde puedo revisar el estado de mis pagos?',
    a: 'Ingresa al portal de proveedores para consultar el estado de tus facturas, fechas de pago y estados de cuenta.',
  },
  {
    q: '¿Cómo actualizo mis datos bancarios?',
    a: 'Solicita el cambio desde el portal adjuntando la carta de transferencia bancaria firmada. Por seguridad, nunca procesamos cambios de cuenta solicitados solo por correo.',
  },
  {
    q: '¿Cómo agendo una entrega en planta?',
    a: 'Usa la plataforma de autoagendamiento indicando tu número de orden de compra. Revisa los requisitos de seguridad antes de presentarte.',
  },
]

export const contactChannels = [
  {
    title: 'Contáctanos',
    text: 'Escríbenos a',
    highlight: contact.email,
    icon: Mail,
    link: { label: 'Ir al contacto', href: `mailto:${contact.email}` },
  },
  { title: 'Mesa de ayuda a proveedores', text: 'Atención telefónica al', highlight: contact.businessPhone, icon: Headset },
  {
    title: 'Preguntas frecuentes',
    text: 'Encuentra lo que necesitas en nuestro centro de ayuda.',
    icon: MessagesSquare,
    link: { label: 'Ir al centro de ayuda', href: '/ayuda' },
  },
]
