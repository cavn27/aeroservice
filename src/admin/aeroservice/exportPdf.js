import emblemUrl from '../../assets/emblem.png'
import { downloadBlob } from './exportExcel'

const NAVY = [31, 45, 132]
const INK = [18, 21, 43]
const MUTED = [91, 97, 120]

const money = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const S = (v) => `S/ ${money.format(v ?? 0)}`
const N = (v) => new Intl.NumberFormat('es-PE').format(v ?? 0)

async function toDataUrl(url) {
  const blob = await (await fetch(url)).blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

// Genera el PDF (A4 horizontal). Las librerías se descargan solo al exportar.
export async function exportPdf({ rows, summary, meta, filename }) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })
  const W = doc.internal.pageSize.getWidth()
  const M = 12

  // Encabezado
  const logo = await toDataUrl(emblemUrl)
  doc.addImage(logo, 'PNG', M, 10, 14, 14)
  doc.setFont('helvetica', 'bold').setFontSize(16).setTextColor(...INK)
  doc.text('Reporte de ventas - Aeroservice', M + 18, 16)
  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...MUTED)
  doc.text(`Periodo (fecha de registro): ${meta.periodo}   |   Sede: ${meta.sede}   |   ${meta.filtros}`, M + 18, 21.5)
  doc.text(`Generado por ${meta.usuario} el ${meta.generado}`, M + 18, 26)
  doc.setDrawColor(...NAVY).setLineWidth(0.6).line(M, 30, W - M, 30)

  // Indicadores
  const kpis = [
    ['Ingresos', S(summary.ingresos)],
    ['Pedidos entregados', N(summary.entregados)],
    ['Ticket promedio', S(summary.ticket)],
    ['Unidades vendidas', N(summary.unidades)],
    ['Rechazados', `${N(summary.rechazados)} de ${N(summary.registrados)}`],
    ['Vales FISE', `${N(summary.vales)} (${S(summary.valesMonto)})`],
  ]
  const boxW = (W - M * 2 - 5 * 4) / 6
  kpis.forEach(([label, value], i) => {
    const x = M + i * (boxW + 4)
    doc.setFillColor(244, 246, 251).roundedRect(x, 34, boxW, 18, 2, 2, 'F')
    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...MUTED).text(label, x + 3, 39.5)
    doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...INK).text(value, x + 3, 47, { maxWidth: boxW - 6 })
  })

  const tableStyle = {
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 1.6, textColor: INK, lineColor: [220, 225, 238], lineWidth: 0.1 },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 253] },
    margin: { left: M, right: M },
  }

  // Resúmenes en dos columnas
  const half = (W - M * 2 - 6) / 2
  const resumen = (title, head, body, x, y) => {
    doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(...NAVY).text(title, x, y)
    autoTable(doc, {
      ...tableStyle,
      startY: y + 2,
      head: [head],
      body: body.length ? body : [['Sin datos', '', '']],
      margin: { left: x },
      tableWidth: half,
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
    })
    return doc.lastAutoTable.finalY
  }
  const y0 = 60
  const leftEnd = resumen('Ventas por sede', ['Sede', 'Pedidos', 'Ingresos'], summary.porSede.map((g) => [g.label, N(g.cantidad), S(g.monto)]), M, y0)
  const rightEnd = resumen(
    'Productos (antes del vale FISE)',
    ['Producto', 'Unidades', 'Monto'],
    summary.porProducto.map((g) => [g.label, N(g.cantidad), S(g.monto)]),
    M + half + 6,
    y0,
  )
  const y1 = Math.max(leftEnd, rightEnd) + 9
  resumen('Medios de pago', ['Método', 'Pedidos', 'Monto'], summary.porPago.map((g) => [g.label, N(g.cantidad), S(g.monto)]), M, y1)
  resumen(
    'Repartidores (top 10)',
    ['Repartidor', 'Entregas', 'Ingresos'],
    summary.porRepartidor.slice(0, 10).map((g) => [g.label, N(g.cantidad), S(g.monto)]),
    M + half + 6,
    y1,
  )

  // Detalle de pedidos
  doc.addPage()
  doc.setFont('helvetica', 'bold').setFontSize(12).setTextColor(...NAVY).text(`Detalle de pedidos (${N(rows.length)})`, M, 16)
  autoTable(doc, {
    ...tableStyle,
    startY: 20,
    head: [['Fecha', 'Estación', 'Tipo', 'Cliente', 'Distrito', 'Productos', 'Total', 'Pago', 'Estado', 'Repartidor']],
    body: rows.map((r) => [r.fechaRegistro, r.estacion, r.tipoVenta, r.cliente, r.distrito, r.productos, S(r.total), r.tipoPago, r.estado, r.repartidor]),
    styles: { ...tableStyle.styles, fontSize: 7 },
    columnStyles: { 0: { cellWidth: 24 }, 5: { cellWidth: 62 }, 6: { halign: 'right', cellWidth: 20 } },
  })

  // Pie de página con numeración
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...MUTED)
    doc.text('Aerogas - Portal de reportes', M, doc.internal.pageSize.getHeight() - 6)
    doc.text(`Página ${i} de ${pages}`, W - M, doc.internal.pageSize.getHeight() - 6, { align: 'right' })
  }

  downloadBlob(doc.output('blob'), filename)
}
