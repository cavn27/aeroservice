// Red de estaciones y puntos de venta Aerogas.
// Ubicaciones reales entregadas por Aerogas. TODO: confirmar horarios, productos, precios y servicios de cada estación
// (los valores actuales son de ejemplo). Si un producto no tiene precio, la ficha muestra "Consultar".

export const products = [
  { id: 'glp', label: 'GLP vehicular', unit: 'litro' },
  { id: 'balon10', label: 'Balón 10 kg', unit: 'unidad' },
  { id: 'balon45', label: 'Balón 45 kg', unit: 'unidad' },
]

export const services = [
  { id: 'tienda', label: 'Tienda' },
  { id: 'delivery', label: 'Delivery de balones' },
  { id: 'aire', label: 'Aire y agua' },
  { id: 'banos', label: 'Baños' },
  { id: 'tarjetas', label: 'Pago con tarjeta' },
  { id: 'conversion', label: 'Conversión a GLP' },
]

// hours: [apertura, cierre] en formato 24 h; null = 24 horas.
export const stations = [
  {
    id: 'vela',
    code: 'AG-001',
    name: 'Estación Vela',
    address: 'Av. Víctor Raúl Haya de la Torre 539',
    city: 'Chiclayo, Lambayeque',
    lat: -6.7817602347782655,
    lng: -79.83363940916162,
    phone: '',
    hours: null,
    products: { glp: null, balon10: null, balon45: null },
    services: ['tienda', 'delivery', 'aire', 'tarjetas'],
  },
  {
    id: 'salaverry',
    code: 'AG-002',
    name: 'Estación Salaverry',
    address: 'Av. Salaverry 595',
    city: 'Chiclayo, Lambayeque',
    lat: -6.770820686564788,
    lng: -79.85101180316708,
    phone: '',
    hours: [6, 23],
    products: { glp: null, balon10: null },
    services: ['delivery', 'aire', 'banos', 'tarjetas', 'conversion'],
  },
]

// Centro inicial del mapa (Chiclayo) si el usuario no comparte su ubicación.
export const defaultCenter = [-6.7764, -79.8443]
