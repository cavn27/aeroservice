import { EXCEL_COLUMNS, excelValues } from './reportData'

const NAVY = 'FF1F2D84'
const MONEY = '"S/" #,##0.00'

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function styleHeader(row) {
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
  row.alignment = { vertical: 'middle', wrapText: true }
  row.height = 30
}

// Tabla simple de resumen (título + encabezados + filas) a partir de la fila indicada.
function addTable(ws, startRow, title, headers, rows) {
  ws.getCell(startRow, 1).value = title
  ws.getCell(startRow, 1).font = { bold: true, size: 12, color: { argb: NAVY } }
  const header = ws.getRow(startRow + 1)
  header.values = headers
  styleHeader(header)
  rows.forEach((values, i) => {
    const row = ws.getRow(startRow + 2 + i)
    row.values = values
  })
  return startRow + 2 + rows.length + 1
}

// Cuadre diario: hoja "Cuadre" (una fila por trabajador + totales) y hoja "Detalle" (cada pedido con su responsable).
export async function exportCuadreExcel({ workers, totales, meta, filename }) {
  const { default: ExcelJS } = await import('exceljs')
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Aerogas · Portal de reportes'

  const ws = wb.addWorksheet('Cuadre', { views: [{ state: 'frozen', ySplit: 4 }] })
  ws.getCell('A1').value = `Cuadre diario de caja · ${meta.fecha} · ${meta.sede}`
  ws.getCell('A1').font = { bold: true, size: 14, color: { argb: NAVY } }
  ws.getCell('A2').value = `Generado por ${meta.usuario} el ${meta.generado}`
  const cols = [
    ['Trabajador', 30], ['DNI', 12], ['Rol', 20], ['Entregas', 10], ['Total vendido (S/)', 16], ['Efectivo a rendir (S/)', 18],
    ['Yape (S/)', 12], ['Tarjeta (S/)', 12], ['Vales FISE', 10], ['Monto vales (S/)', 14], ['Canjes', 8], ['Efectivo recibido (S/)', 18], ['Firma', 24],
  ]
  cols.forEach(([, width], i) => (ws.getColumn(i + 1).width = width))
  const header = ws.getRow(4)
  header.values = cols.map(([h]) => h)
  styleHeader(header)
  workers.forEach((w) => {
    const row = ws.addRow([w.nombre, w.dni, w.rol, w.entregas, w.total, w.efectivo, w.yape, w.tarjeta, w.vales, w.valesMonto, w.canjes.length, null, null])
    row.height = 22
  })
  const tot = ws.addRow(['TOTAL', '', '', totales.entregas, totales.total, totales.efectivo, totales.yape, totales.tarjeta, totales.vales, totales.valesMonto, totales.canjes])
  tot.font = { bold: true }
  ;[5, 6, 7, 8, 10, 12].forEach((c) => (ws.getColumn(c).numFmt = MONEY))

  const det = wb.addWorksheet('Detalle', { views: [{ state: 'frozen', ySplit: 1 }] })
  det.columns = [
    { header: 'Trabajador', key: 'trabajador', width: 28 },
    { header: 'Hora entrega', key: 'hora', width: 17 },
    { header: 'Cliente', key: 'cliente', width: 26 },
    { header: 'Productos', key: 'productos', width: 40 },
    { header: 'Tipo de pago', key: 'tipoPago', width: 12 },
    { header: 'Total (S/)', key: 'total', width: 12 },
    { header: 'Efectivo (S/)', key: 'efectivo', width: 12 },
    { header: 'Yape (S/)', key: 'yape', width: 12 },
    { header: 'Tarjeta (S/)', key: 'tarjeta', width: 12 },
    { header: 'Código vale', key: 'vale', width: 14 },
    { header: 'Canje', key: 'canje', width: 8 },
  ]
  styleHeader(det.getRow(1))
  for (const w of workers) {
    for (const r of [...w.pedidos, ...w.canjes]) {
      det.addRow({
        trabajador: w.nombre,
        hora: r.fechaEntregado,
        cliente: r.cliente,
        productos: r.productos,
        tipoPago: r.tipoPago,
        total: r.raw.es_canje ? 0 : r.total,
        efectivo: r.raw.es_canje ? 0 : r.montos.efectivo,
        yape: r.raw.es_canje ? 0 : r.montos.yape,
        tarjeta: r.raw.es_canje ? 0 : r.montos.tarjeta,
        vale: r.codigoVale,
        canje: r.canje,
      })
    }
  }
  ;[6, 7, 8, 9].forEach((c) => (det.getColumn(c).numFmt = MONEY))
  det.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 11 } }

  const buffer = await wb.xlsx.writeBuffer()
  downloadBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename)
}

// Genera el .xlsx con la hoja "Ventas" (mismas columnas que la app) y una hoja "Resumen".
export async function exportExcel({ rows, summary, meta, filename }) {
  const { default: ExcelJS } = await import('exceljs')
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Aerogas · Portal de reportes'
  wb.created = new Date()

  // Hoja Resumen
  const rs = wb.addWorksheet('Resumen', { properties: { tabColor: { argb: NAVY } } })
  rs.columns = [{ width: 34 }, { width: 18 }, { width: 18 }]
  rs.getCell('A1').value = 'Reporte de ventas · Aeroservice'
  rs.getCell('A1').font = { bold: true, size: 16, color: { argb: NAVY } }
  const info = [
    ['Periodo (fecha de registro)', meta.periodo],
    ['Sede', meta.sede],
    ['Filtros', meta.filtros],
    ['Generado por', meta.usuario],
    ['Generado el', meta.generado],
  ]
  info.forEach(([k, v], i) => {
    rs.getCell(3 + i, 1).value = k
    rs.getCell(3 + i, 1).font = { bold: true }
    rs.getCell(3 + i, 2).value = v
  })
  let next = 3 + info.length + 1
  next = addTable(rs, next, 'Indicadores', ['Indicador', 'Valor'], [
    ['Pedidos registrados', summary.registrados],
    ['Pedidos entregados (ventas)', summary.entregados],
    ['Rechazados', summary.rechazados],
    ['En curso', summary.enCurso],
    ['Canjes', summary.canjes],
    ['Ingresos (S/)', summary.ingresos],
    ['Ticket promedio (S/)', summary.ticket],
    ['Unidades vendidas', summary.unidades],
    ['Vales FISE', summary.vales],
    ['Descuento vales FISE (S/)', summary.valesMonto],
  ])
  ;['Ingresos (S/)', 'Ticket promedio (S/)', 'Descuento vales FISE (S/)'].forEach((label) => {
    rs.eachRow((row) => {
      if (row.getCell(1).value === label) row.getCell(2).numFmt = MONEY
    })
  })
  const money3 = (start, list) => list.forEach((_, i) => (rs.getCell(start + 2 + i, 3).numFmt = MONEY))
  const t1 = next
  next = addTable(rs, next, 'Ventas por sede', ['Sede', 'Pedidos', 'Ingresos (S/)'], summary.porSede.map((g) => [g.label, g.cantidad, g.monto]))
  money3(t1, summary.porSede)
  const t2 = next
  next = addTable(rs, next, 'Productos (antes del vale FISE)', ['Producto', 'Unidades', 'Monto (S/)'], summary.porProducto.map((g) => [g.label, g.cantidad, g.monto]))
  money3(t2, summary.porProducto)
  const t3 = next
  next = addTable(rs, next, 'Medios de pago', ['Método', 'Pedidos', 'Monto (S/)'], summary.porPago.map((g) => [g.label, g.cantidad, g.monto]))
  money3(t3, summary.porPago)
  const t4 = next
  addTable(rs, next, 'Repartidores', ['Repartidor', 'Entregas', 'Ingresos (S/)'], summary.porRepartidor.map((g) => [g.label, g.cantidad, g.monto]))
  money3(t4, summary.porRepartidor)

  // Hoja Ventas (detalle)
  const ws = wb.addWorksheet('Ventas', { views: [{ state: 'frozen', ySplit: 1 }] })
  ws.columns = EXCEL_COLUMNS.map(({ header, key, width }) => ({ header, key, width }))
  styleHeader(ws.getRow(1))
  for (const r of rows) ws.addRow(excelValues(r))
  EXCEL_COLUMNS.forEach((c, i) => {
    if (c.money) ws.getColumn(i + 1).numFmt = MONEY
  })
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: EXCEL_COLUMNS.length } }

  const buffer = await wb.xlsx.writeBuffer()
  downloadBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), filename)
}
