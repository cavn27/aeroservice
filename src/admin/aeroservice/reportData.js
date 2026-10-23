import { supabase } from '../../lib/supabase'
import { addDays } from './periods'
import { estadoLabel, itemNombre, localLabel, pagoLabel, puntoVentaLabel } from './labels'

// Supabase devuelve como máximo 1000 filas por consulta: se pide en páginas hasta traer todo.
const PAGE = 1000

async function fetchAll(buildQuery) {
  const rows = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await buildQuery().range(from, from + PAGE - 1)
    if (error) throw error
    rows.push(...data)
    if (data.length < PAGE) return rows
  }
}

export const COLUMNS = [
  'id', 'local', 'es_venta_estacion', 'created_at', 'cliente_nombre', 'cliente_dni', 'cliente_telefono', 'direccion',
  'distrito', 'tipo_negocio', 'items', 'tipo_pago', 'desglose_pago', 'vuelto', 'comentario', 'estado', 'creado_por',
  'motorizado_id', 'motorizado_nombre', 'aceptado_at', 'entregado_at', 'con_vale', 'descuento_vale', 'codigo_vale',
  'motivo_rechazo', 'rechazado_at', 'es_canje', 'motivo_canje', 'pedido_origen_id',
].join(',')

// Perú no tiene horario de verano: UTC−5 todo el año.
const limaStart = (isoDate) => `${isoDate}T00:00:00-05:00`

// Filtros comunes (Reportes y Pedidos) sobre una consulta de pedidos: periodo por fecha de REGISTRO
// (created_at, como el export de la app), sede, estado, canal y canjes.
export function applyFilters(q, { desde, hasta, local, estado, canal, canjes }) {
  q = q.gte('created_at', limaStart(desde)).lt('created_at', limaStart(addDays(hasta, 1)))
  if (local) q = q.eq('local', local)
  if (estado === 'en_curso') q = q.in('estado', ['pendiente', 'aceptado'])
  else if (estado) q = q.eq('estado', estado)
  if (canal === 'domicilio') q = q.eq('es_venta_estacion', false)
  if (canal === 'directa') q = q.eq('es_venta_estacion', true)
  if (!canjes) q = q.eq('es_canje', false)
  return q
}

// Perfiles del personal (nombre, DNI, rol, sede). Se cargan una vez por sesión.
let perfilesPromise = null
export function fetchPerfiles() {
  perfilesPromise ??= fetchAll(() => supabase.from('profiles').select('id,nombres,apellidos,dni,rol,local').order('id'))
    .then((perfiles) =>
      Object.fromEntries(perfiles.map((p) => [p.id, { id: p.id, nombre: `${p.nombres} ${p.apellidos}`.trim(), dni: p.dni, rol: p.rol, local: p.local }])),
    )
    .catch((e) => {
      perfilesPromise = null
      throw e
    })
  return perfilesPromise
}

// Tras crear o editar personal, los nombres se vuelven a cargar.
export const resetPerfilesCache = () => {
  perfilesPromise = null
}

// Solo nombres (columna "Registrado por").
export const fetchNombres = () =>
  fetchPerfiles().then((perfiles) => Object.fromEntries(Object.values(perfiles).map((p) => [p.id, p.nombre])))

// Pedidos ENTREGADOS en un día (hora de Perú), para el cuadre diario. Incluye canjes (se listan aparte, sin dinero).
export async function fetchCuadre({ fecha, local }) {
  const [pedidos, perfiles] = await Promise.all([
    fetchAll(() => {
      let q = supabase
        .from('pedidos')
        .select(COLUMNS)
        .eq('estado', 'entregado')
        .gte('entregado_at', limaStart(fecha))
        .lt('entregado_at', limaStart(addDays(fecha, 1)))
        .order('entregado_at', { ascending: true })
        .order('id', { ascending: true })
      if (local) q = q.eq('local', local)
      return q
    }),
    fetchPerfiles(),
  ])
  const nombres = Object.fromEntries(Object.values(perfiles).map((p) => [p.id, p.nombre]))
  return { rows: pedidos.map((p) => toRow(p, nombres)), perfiles }
}

// Todos los pedidos que cumplen los filtros (para Reportes), paginando de 1000 en 1000.
export async function fetchReport(filters) {
  const [pedidos, nombres] = await Promise.all([
    fetchAll(() =>
      applyFilters(supabase.from('pedidos').select(COLUMNS), filters)
        .order('created_at', { ascending: true })
        .order('id', { ascending: true }),
    ),
    fetchNombres(),
  ])
  return pedidos.map((p) => toRow(p, nombres))
}

// Los 6 totales del reporte, calculados en el servidor (portal_reporte_resumen): así no hace falta
// descargar todos los pedidos del periodo solo para sumarlos. Lanza el error de Supabase tal cual
// (PGRST202 = la función todavía no está instalada; ver portal_reporte_resumen.sql).
export async function fetchResumenReporte({ desde, hasta, local, estado, canal, canjes }) {
  const { data, error } = await supabase.rpc('portal_reporte_resumen', {
    p_desde: desde,
    p_hasta: hasta,
    p_local: local || null,
    p_estado: estado || null,
    p_canal: canal || null,
    p_canjes: Boolean(canjes),
  })
  if (error) throw error
  return {
    registrados: data.registrados,
    entregados: data.entregados,
    rechazados: data.rechazados,
    enCurso: data.en_curso,
    ingresos: Number(data.ingresos),
    ticket: Number(data.ticket),
  }
}

// Los primeros `limit` pedidos del reporte (vista previa) y cuántos hay en total, sin traer el resto.
export async function fetchVistaPrevia(filters, limit) {
  const [{ data, error, count }, nombres] = await Promise.all([
    applyFilters(supabase.from('pedidos').select(COLUMNS, { count: 'exact' }), filters)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .range(0, limit - 1),
    fetchNombres(),
  ])
  if (error) throw error
  return { rows: data.map((p) => toRow(p, nombres)), total: count ?? data.length }
}

const fechaHora = new Intl.DateTimeFormat('es-PE', {
  timeZone: 'America/Lima',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
export const formatFechaHora = (iso) => (iso ? fechaHora.format(new Date(iso)).replace(',', '') : '')

const round2 = (n) => Math.round(n * 100) / 100

// Fila del reporte con los mismos campos y reglas que pedido_excel_export.dart.
export function toRow(p, nombres) {
  const items = Array.isArray(p.items) ? p.items : []
  const subtotal = items.reduce((s, i) => s + Number(i.precio_unidad) * Number(i.cantidad), 0)
  const total = round2(Math.max(subtotal - Number(p.descuento_vale ?? 0), 0))
  const d = p.desglose_pago ?? {}
  const montos =
    p.tipo_pago === 'mixto'
      ? { efectivo: Number(d.efectivo ?? 0), tarjeta: Number(d.tarjeta ?? 0), yape: Number(d.yape ?? 0) }
      : {
          efectivo: p.tipo_pago === 'efectivo' ? total : 0,
          tarjeta: p.tipo_pago === 'tarjeta' ? total : 0,
          yape: p.tipo_pago === 'yape' ? total : 0,
        }
  return {
    raw: p,
    items,
    total,
    montos,
    unidades: items.reduce((s, i) => s + Number(i.cantidad), 0),
    id: p.id,
    puntoVenta: puntoVentaLabel(p.local),
    estacion: localLabel(p.local),
    tipoVenta: p.es_venta_estacion ? 'Venta directa' : 'A domicilio',
    fechaRegistro: formatFechaHora(p.created_at),
    cliente: p.cliente_nombre,
    dni: p.cliente_dni ?? '',
    telefono: p.cliente_telefono ?? '',
    direccion: p.direccion ?? '',
    distrito: p.distrito ?? '',
    tipoNegocio: p.tipo_negocio ?? '',
    productos: items.map((i) => `${i.cantidad} ${itemNombre(i)} (S/ ${Number(i.precio_unidad).toFixed(2)})`).join(' + '),
    tipoPago: pagoLabel(p.tipo_pago),
    vuelto: Number(p.vuelto ?? 0),
    comentario: p.comentario ?? '',
    estado: estadoLabel(p.estado),
    registradoPor: nombres[p.creado_por] ?? p.creado_por,
    repartidor: p.motorizado_nombre ?? '',
    fechaAceptado: formatFechaHora(p.aceptado_at),
    fechaEntregado: formatFechaHora(p.entregado_at),
    conVale: p.con_vale ? 'Sí' : 'No',
    descuentoVale: Number(p.descuento_vale ?? 0),
    codigoVale: p.codigo_vale ?? '',
    motivoRechazo: p.motivo_rechazo ?? '',
    canje: p.es_canje ? 'Sí' : 'No',
    motivoCanje: p.motivo_canje ?? '',
  }
}

// Columnas del Excel: mismas que la app, en el mismo orden.
export const EXCEL_COLUMNS = [
  { header: 'ID', key: 'id', width: 38 },
  { header: 'Punto de venta', key: 'puntoVenta', width: 14 },
  { header: 'Estación', key: 'estacion', width: 22 },
  { header: 'Tipo de venta', key: 'tipoVenta', width: 14 },
  { header: 'Fecha de registro', key: 'fechaRegistro', width: 17 },
  { header: 'Cliente', key: 'cliente', width: 26 },
  { header: 'DNI cliente', key: 'dni', width: 12 },
  { header: 'Teléfono cliente', key: 'telefono', width: 14 },
  { header: 'Dirección', key: 'direccion', width: 32 },
  { header: 'Distrito', key: 'distrito', width: 18 },
  { header: 'Tipo de negocio', key: 'tipoNegocio', width: 16 },
  { header: 'Productos', key: 'productos', width: 40 },
  { header: 'Cantidad', key: 'unidades', width: 10, money: false, number: true },
  { header: 'Total (S/)', key: 'total', width: 12, money: true },
  { header: 'Tipo de pago', key: 'tipoPago', width: 12 },
  { header: 'Pago efectivo (S/)', key: 'pagoEfectivo', width: 14, money: true },
  { header: 'Pago tarjeta (S/)', key: 'pagoTarjeta', width: 14, money: true },
  { header: 'Pago yape (S/)', key: 'pagoYape', width: 14, money: true },
  { header: 'Vuelto (S/)', key: 'vuelto', width: 11, money: true },
  { header: 'Comentario', key: 'comentario', width: 28 },
  { header: 'Estado', key: 'estado', width: 11 },
  { header: 'Registrado por', key: 'registradoPor', width: 24 },
  { header: 'Repartidor', key: 'repartidor', width: 22 },
  { header: 'Fecha aceptado', key: 'fechaAceptado', width: 17 },
  { header: 'Fecha entregado', key: 'fechaEntregado', width: 17 },
  { header: 'Con vale FISE', key: 'conVale', width: 12 },
  { header: 'Descuento vale FISE (S/)', key: 'descuentoVale', width: 14, money: true },
  { header: 'Código vale', key: 'codigoVale', width: 14 },
  { header: 'Motivo de rechazo', key: 'motivoRechazo', width: 26 },
  { header: 'Canje', key: 'canje', width: 8 },
  { header: 'Motivo del canje', key: 'motivoCanje', width: 26 },
]

export const excelValues = (r) => ({ ...r, pagoEfectivo: r.montos.efectivo, pagoTarjeta: r.montos.tarjeta, pagoYape: r.montos.yape })

// Resumen del reporte (sobre los pedidos registrados en el periodo). Ventas = entregados sin canjes.
export function summarize(rows) {
  const ventas = rows.filter((r) => r.raw.estado === 'entregado' && !r.raw.es_canje)
  const ingresos = round2(ventas.reduce((s, r) => s + r.total, 0))
  const group = (list, keyOf) => {
    const m = new Map()
    for (const r of list) {
      for (const [key, value] of keyOf(r)) {
        const prev = m.get(key) ?? { label: key, cantidad: 0, monto: 0 }
        prev.cantidad += value.cantidad
        prev.monto = round2(prev.monto + value.monto)
        m.set(key, prev)
      }
    }
    return [...m.values()].sort((a, b) => b.monto - a.monto || b.cantidad - a.cantidad)
  }
  return {
    registrados: rows.length,
    entregados: ventas.length,
    rechazados: rows.filter((r) => r.raw.estado === 'rechazado').length,
    enCurso: rows.filter((r) => ['pendiente', 'aceptado'].includes(r.raw.estado)).length,
    canjes: rows.filter((r) => r.raw.es_canje).length,
    ingresos,
    ticket: ventas.length ? round2(ingresos / ventas.length) : 0,
    unidades: ventas.reduce((s, r) => s + r.unidades, 0),
    vales: ventas.filter((r) => r.raw.con_vale).length,
    valesMonto: round2(ventas.reduce((s, r) => s + (r.raw.con_vale ? r.descuentoVale : 0), 0)),
    porSede: group(ventas, (r) => [[r.estacion, { cantidad: 1, monto: r.total }]]),
    porProducto: group(ventas, (r) =>
      r.items.map((i) => [itemNombre(i), { cantidad: Number(i.cantidad), monto: Number(i.precio_unidad) * Number(i.cantidad) }]),
    ),
    porPago: group(ventas, (r) =>
      Object.entries(r.montos)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => [pagoLabel(k), { cantidad: 1, monto: v }]),
    ),
    porRepartidor: group(
      ventas.filter((r) => r.repartidor),
      (r) => [[r.repartidor, { cantidad: 1, monto: r.total }]],
    ).sort((a, b) => b.cantidad - a.cantidad),
  }
}
