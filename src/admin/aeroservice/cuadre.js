import { localLabel, rolLabel } from './labels'

const round2 = (n) => Math.round(n * 100) / 100

// Quién responde por el dinero de cada pedido:
//   · venta directa (mostrador): quien la registró;
//   · delivery: el repartidor que lo entregó.
export const responsableId = (p) => (p.es_venta_estacion ? p.creado_por : p.motorizado_id)

// Agrupa los pedidos entregados del día por trabajador y calcula lo que debe rendir.
export function buildCuadre(rows, perfiles) {
  const byWorker = new Map()
  for (const r of rows) {
    const id = responsableId(r.raw) ?? 'sin-asignar'
    if (!byWorker.has(id)) {
      const perfil = perfiles[id]
      byWorker.set(id, {
        id,
        nombre: perfil?.nombre ?? r.raw.motorizado_nombre ?? 'Sin trabajador asignado',
        dni: perfil?.dni ?? '',
        rol: rolLabel(perfil?.rol),
        sede: perfil?.local ? localLabel(perfil.local) : '',
        pedidos: [],
        canjes: [],
      })
    }
    const w = byWorker.get(id)
    ;(r.raw.es_canje ? w.canjes : w.pedidos).push(r)
  }

  return [...byWorker.values()]
    .map((w) => {
      const sum = (fn) => round2(w.pedidos.reduce((s, r) => s + fn(r), 0))
      const conVale = w.pedidos.filter((r) => r.raw.con_vale)
      return {
        ...w,
        entregas: w.pedidos.length,
        unidades: w.pedidos.reduce((s, r) => s + r.unidades, 0),
        total: sum((r) => r.total),
        efectivo: sum((r) => r.montos.efectivo),
        yape: sum((r) => r.montos.yape),
        tarjeta: sum((r) => r.montos.tarjeta),
        vales: conVale.length,
        valesMonto: round2(conVale.reduce((s, r) => s + r.descuentoVale, 0)),
        valesCodigos: conVale.map((r) => r.codigoVale).filter(Boolean),
      }
    })
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre))
}

// Totales de todos los trabajadores.
export const cuadreTotales = (workers) =>
  workers.reduce(
    (t, w) => ({
      entregas: t.entregas + w.entregas,
      total: round2(t.total + w.total),
      efectivo: round2(t.efectivo + w.efectivo),
      yape: round2(t.yape + w.yape),
      tarjeta: round2(t.tarjeta + w.tarjeta),
      vales: t.vales + w.vales,
      valesMonto: round2(t.valesMonto + w.valesMonto),
      canjes: t.canjes + w.canjes.length,
    }),
    { entregas: 0, total: 0, efectivo: 0, yape: 0, tarjeta: 0, vales: 0, valesMonto: 0, canjes: 0 },
  )
