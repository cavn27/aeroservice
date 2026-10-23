// Etiquetas iguales a las de la app Aeroservice (lib/features/auth/domain/local.dart y orders/domain/pedido.dart).

export const LOCALES = {
  delivery_quinones: 'Delivery Quiñones',
  chiclayo: 'Delivery Vela',
  tucume: 'Túcume',
  ferrenafe: 'Ferreñafe',
  pomalca: 'Pomalca',
  patapo: 'Pátapo',
  cayalti: 'Cayaltí',
  oyotun: 'Oyotún',
  grifo_vela: 'Grifo Vela',
  grifo_quinones: 'Grifo Quiñones',
  grifo_salaverry: 'Grifo Salaverry',
  grifo_chosica_norte: 'Grifo Chosica del norte',
  grifo_monsefu_petroperu: 'Grifo Monsefú Petroperú',
  grifo_monsefu_repsol: 'Grifo Monsefú Repsol',
  grifo_cayalti: 'Grifo Cayaltí',
  grifo_jlo: 'Grifo JLO',
  grifo_verdum: 'Grifo Verdum',
  furgon: 'Furgón',
  planta: 'Planta',
}

const PRODUCTOS = {
  balon_gas: 'Gas 10kg',
  balon_gas_45: 'Gas 45kg',
  balon_gas_m15: 'Gas M15',
  bidon_agua: 'Agua',
  combo: 'Gas + agua',
  fierro: 'Fierro',
}

const VALVULAS = { premium: 'Premium', regular: 'Regular' }

export const PAGOS = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', yape: 'Yape', mixto: 'Mixto' }

export const localLabel = (id) => LOCALES[id] ?? id
export const pagoLabel = (id) => PAGOS[id] ?? id
export const productoLabel = (producto, valvula) =>
  [PRODUCTOS[producto] ?? producto, valvula ? VALVULAS[valvula] ?? valvula : null].filter(Boolean).join(' · ')

// Punto de venta de cada sede (Local.puntoVenta en la app).
const PUNTO_VENTA = { delivery_quinones: 'Delivery', chiclayo: 'Delivery', furgon: 'Furgón', planta: 'Planta' }
export const puntoVentaLabel = (local) =>
  PUNTO_VENTA[local] ?? (local.startsWith('grifo_') ? 'Grifo' : LOCALES[local] ? 'Local' : local)

export const ESTADOS = { pendiente: 'Pendiente', aceptado: 'Aceptado', entregado: 'Entregado', rechazado: 'Rechazado' }
export const estadoLabel = (id) => ESTADOS[id] ?? id

// Nombre de un producto del pedido, igual que PedidoItem.nombre en la app ("Gas 10kg Regular").
export const itemNombre = (item) =>
  [PRODUCTOS[item.tipo_producto] ?? item.tipo_producto, item.tipo_valvula ? VALVULAS[item.tipo_valvula] ?? item.tipo_valvula : null]
    .filter(Boolean)
    .join(' ')

// Roles del personal (UserRole.label en la app).
const ROLES = {
  auxiliar_ventas: 'Auxiliar de ventas',
  motorizado: 'Moto lineal',
  mototaxi: 'Mototaxi',
  auxiliar_motorizado: 'Auxiliar y repartidor',
  jefe_estacion: 'Jefe de estación',
  operario_venta: 'Operario de venta',
  distribuidor: 'Distribuidor',
  planta: 'Planta',
  administrador: 'Administrador',
  administrador_visualizador: 'Administrador (solo lectura)',
}
export const rolLabel = (id) => ROLES[id] ?? id ?? ''
