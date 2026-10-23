import {
  BadgeDollarSign,
  Building2,
  Car,
  CircleHelp,
  Container,
  FileText,
  Gift,
  Handshake,
  Headset,
  MessageSquareWarning,
  MessagesSquare,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Truck,
  Users,
} from 'lucide-react'
import { WhatsAppIcon } from '../components/ui/SocialIcon'
import { contact } from './site'
import { faqs as personasFaqs } from './personas'
import { faqs as empresasFaqs } from './empresas'
import { faqs as distribuidoresFaqs } from './distribuidores'
import { faqs as proveedoresFaqs } from './proveedores'

// Centro de ayuda: temas agrupados por pestaña. Cada tema tiene sus preguntas (q/a).
// TODO: validar respuestas con atención al cliente de Aerogas.

const pick = (list, ...indexes) => indexes.map((i) => list[i])

export const helpTabs = [
  {
    id: 'personas',
    label: 'Personas',
    topics: [
      {
        id: 'pedidos',
        title: 'Pedidos a domicilio',
        description: 'Cómo pedir tu balón, tiempos de entrega y seguimiento.',
        icon: Truck,
        faqs: [
          personasFaqs[0],
          {
            q: '¿Cuánto demora en llegar mi pedido?',
            a: 'Depende de tu zona y de la demanda del momento. Al confirmar tu pedido te indicaremos el tiempo estimado y podrás seguirlo desde la App Aerogas.',
          },
          {
            q: '¿Puedo programar un pedido para otro día?',
            a: 'Sí, desde la App Aerogas puedes elegir el día y el rango horario en que prefieres recibir tu balón.',
          },
        ],
      },
      {
        id: 'app',
        title: 'App Aerogas',
        description: 'Más información sobre la app para pedir y pagar tu gas.',
        icon: Smartphone,
        faqs: [
          {
            q: '¿Cómo descargo la App Aerogas?',
            a: 'Búscala como “Aerogas” en Google Play o App Store, regístrate con tu correo o número de celular y agrega tu dirección.',
          },
          {
            q: '¿Qué medios de pago existen en la app?',
            a: 'Puedes pagar con tarjetas de débito y crédito, billeteras digitales o en efectivo al recibir tu pedido, según disponibilidad en tu zona.',
          },
          {
            q: '¿Dónde veo mi historial de compras?',
            a: 'En la App Aerogas, entra a “Mi cuenta” › “Historial de compras” para revisar tus pedidos y descargar tus comprobantes.',
          },
        ],
      },
      {
        id: 'club',
        title: 'Club Aerogas',
        description: 'Resuelve tus dudas sobre el programa de beneficios.',
        icon: Gift,
        faqs: [
          {
            q: '¿Cómo acumulo puntos en el Club Aerogas?',
            a: 'Cada compra registrada con tu cuenta suma puntos automáticamente. Revisa tu saldo en la App Aerogas.',
          },
          {
            q: '¿Los puntos vencen?',
            a: 'Sí, los puntos tienen una vigencia definida en las bases del programa. Te avisaremos antes de que venzan.',
          },
        ],
      },
      {
        id: 'seguridad',
        title: 'Seguridad con el gas',
        description: 'Qué hacer ante una fuga y cómo usar tu balón de forma segura.',
        icon: ShieldCheck,
        faqs: [personasFaqs[1], personasFaqs[2], personasFaqs[3]],
      },
      {
        id: 'vehicular',
        title: 'GLP vehicular',
        description: 'Conversión de vehículos y carga de autogás.',
        icon: Car,
        faqs: [
          {
            q: '¿Qué es el GLP vehicular?',
            a: 'Es gas licuado de petróleo usado como combustible en vehículos con un sistema de conversión certificado. Suele ser más económico que la gasolina y produce menos emisiones.',
          },
          {
            q: '¿Dónde puedo convertir mi vehículo?',
            a: 'Solo en talleres de conversión autorizados y certificados. Consulta el listado de talleres asociados en nuestros puntos de venta.',
          },
        ],
      },
      {
        id: 'pagos',
        title: 'Pagos y comprobantes',
        description: 'Medios de pago, boletas y facturas.',
        icon: BadgeDollarSign,
        faqs: [
          personasFaqs[4],
          {
            q: '¿Cómo solicito factura por mi compra?',
            a: 'Indícalo al hacer tu pedido en la app o al distribuidor, entregando los datos tributarios de tu empresa.',
          },
        ],
      },
      {
        id: 'reclamos',
        title: 'Reclamos y sugerencias',
        description: 'Cuéntanos si algo no salió bien.',
        icon: MessageSquareWarning,
        faqs: [
          {
            q: '¿Cómo ingreso un reclamo?',
            a: 'Escríbenos por WhatsApp o completa el formulario de contacto indicando tu número de pedido. Te responderemos a la brevedad.',
          },
          {
            q: '¿Qué hago si mi balón llegó con menos peso?',
            a: 'Solicita al repartidor pesarlo en tu presencia o contáctanos indicando tu número de pedido para revisar el caso.',
          },
        ],
      },
      {
        id: 'general',
        title: 'Preguntas generales',
        description: 'Temas generales sobre Aerogas.',
        icon: CircleHelp,
        faqs: [
          {
            q: '¿Dónde encuentro el punto de venta más cercano?',
            a: 'Usa el buscador de puntos de venta en nuestro sitio o en la App Aerogas para ver distribuidores cercanos y sus horarios.',
          },
          {
            q: '¿Qué tamaños de balón ofrecen?',
            a: 'Contamos con balones de distintos tamaños para uso doméstico y comercial. Consulta disponibilidad con tu distribuidor.',
          },
        ],
      },
    ],
  },
  {
    id: 'empresas',
    label: 'Empresas',
    topics: [
      { id: 'cliente', title: 'Hazte cliente', description: 'Requisitos y pasos para ser cliente empresarial.', icon: Building2, faqs: pick(empresasFaqs, 0) },
      { id: 'granel', title: 'Gas a granel', description: 'Instalación de tanques y abastecimiento.', icon: Container, faqs: pick(empresasFaqs, 1, 2) },
      { id: 'gestion', title: 'Portal y gestión', description: 'Control de consumo por sede o vehículo.', icon: FileText, faqs: pick(empresasFaqs, 3) },
      { id: 'credito', title: 'Pagos y crédito', description: 'Medios de pago y líneas de crédito.', icon: BadgeDollarSign, faqs: pick(empresasFaqs, 4) },
    ],
  },
  {
    id: 'distribuidores',
    label: 'Distribuidores',
    topics: [
      { id: 'postulacion', title: 'Postulación', description: 'Requisitos, capital y experiencia.', icon: Handshake, faqs: pick(distribuidoresFaqs, 1, 2, 3, 4) },
      { id: 'proceso', title: 'Proceso', description: 'Etapas y duración del proceso.', icon: Users, faqs: pick(distribuidoresFaqs, 5, 6, 7) },
      { id: 'operacion', title: 'Operación', description: 'Horarios y funcionamiento de la red.', icon: Truck, faqs: pick(distribuidoresFaqs, 0) },
    ],
  },
  {
    id: 'proveedores',
    label: 'Proveedores',
    topics: [
      { id: 'registro', title: 'Registro', description: 'Cómo ser proveedor de Aerogas.', icon: Handshake, faqs: pick(proveedoresFaqs, 0) },
      { id: 'facturacion', title: 'Facturación y pagos', description: 'Facturas, pagos y datos bancarios.', icon: FileText, faqs: pick(proveedoresFaqs, 1, 2, 3) },
      { id: 'entregas', title: 'Entregas', description: 'Agendamiento y requisitos en planta.', icon: PackageCheck, faqs: pick(proveedoresFaqs, 4) },
    ],
  },
]

// Preguntas destacadas junto al buscador: [tabId, topicId, índice de pregunta].
export const popular = [
  ['personas', 'pedidos', 0],
  ['personas', 'app', 1],
  ['personas', 'seguridad', 0],
  ['personas', 'app', 2],
  ['personas', 'vehicular', 0],
]

export const helpContacts = [
  {
    title: 'WhatsApp Personas',
    text: 'Escríbenos al',
    highlight: contact.whatsapp,
    icon: WhatsAppIcon,
    link: { label: 'Iniciar chat', href: contact.whatsappUrl, external: true },
  },
  {
    title: 'Formulario de contacto',
    text: 'Escríbenos y te contactaremos.',
    icon: MessagesSquare,
    link: { label: 'Ir al formulario', href: '#' },
  },
  {
    title: 'WhatsApp Empresas',
    text: 'Escríbenos al',
    highlight: contact.whatsappBusiness,
    icon: Users,
    link: { label: 'Iniciar chat', href: contact.whatsappUrl, external: true },
  },
  {
    title: 'Servicio al cliente',
    text: 'Ponte en contacto con uno de nuestros ejecutivos al',
    highlight: contact.phone,
    icon: Headset,
  },
]
