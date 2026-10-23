import emblemUrl from '../../assets/emblem.png'
import { downloadBlob } from './exportExcel'

const NAVY = [31, 45, 132]
const INK = [18, 21, 43]
const MUTED = [91, 97, 120]
const LINE = [205, 211, 228]

const money = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const S = (v) => `S/ ${money.format(v ?? 0)}`
const hora = (fechaHora) => fechaHora.slice(11) // "dd/mm/aaaa hh:mm" -> "hh:mm"

async function toDataUrl(url) {
  const blob = await (await fetch(url)).blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

// Hoja de cuadre diario: una sección (desde página nueva) por trabajador, con espacio para firmar.
export async function exportCuadrePdf({ workers, meta, filename }) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 14
  const logo = await toDataUrl(emblemUrl)

  const table = {
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 1.5, textColor: INK, lineColor: [220, 225, 238], lineWidth: 0.1 },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [232, 236, 248], textColor: INK, fontStyle: 'bold' },
    margin: { left: M, right: M, top: 16, bottom: 16 },
  }

  workers.forEach((w, index) => {
    if (index > 0) doc.addPage()

    // Encabezado
    doc.addImage(logo, 'PNG', M, 12, 13, 13)
    doc.setFont('helvetica', 'bold').setFontSize(15).setTextColor(...INK).text('Cuadre diario de caja', M + 17, 18)
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...MUTED)
    doc.text(`${meta.fecha}   |   ${meta.sede}`, M + 17, 23.5)
    doc.text(`Generado por ${meta.usuario} el ${meta.generado}`, W - M, 18, { align: 'right' })
    doc.setDrawColor(...NAVY).setLineWidth(0.6).line(M, 28, W - M, 28)

    // Trabajador
    doc.setFont('helvetica', 'bold').setFontSize(13).setTextColor(...INK).text(w.nombre, M, 36)
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...MUTED)
    doc.text([w.dni && `DNI ${w.dni}`, w.rol, w.sede].filter(Boolean).join('   ·   ') || 'Trabajador', M, 41)

    // Resumen: lo que debe rendir
    const boxes = [
      ['Entregas', String(w.entregas)],
      ['Total vendido', S(w.total)],
      ['EFECTIVO A RENDIR', S(w.efectivo)],
      ['Yape', S(w.yape)],
      ['Tarjeta', S(w.tarjeta)],
      ['Vales FISE', `${w.vales} (${S(w.valesMonto)})`],
    ]
    const bw = (W - M * 2 - 5 * 3) / 6
    boxes.forEach(([label, value], i) => {
      const x = M + i * (bw + 3)
      const strong = i === 2
      if (strong) doc.setFillColor(...NAVY)
      else doc.setFillColor(244, 246, 251)
      doc.roundedRect(x, 45, bw, 16, 2, 2, 'F')
      doc.setFont('helvetica', strong ? 'bold' : 'normal').setFontSize(6.5).setTextColor(...(strong ? [255, 255, 255] : MUTED)).text(label, x + 2.5, 50)
      doc.setFont('helvetica', 'bold').setFontSize(9.5).setTextColor(...(strong ? [255, 255, 255] : INK)).text(value, x + 2.5, 57, { maxWidth: bw - 4 })
    })

    // Detalle de pedidos entregados
    autoTable(doc, {
      ...table,
      startY: 66,
      head: [['#', 'Hora', 'Cliente', 'Productos', 'Pago', 'Total', 'Efectivo', 'Yape', 'Tarjeta', 'Vale']],
      body: w.pedidos.map((r, i) => [
        i + 1,
        hora(r.fechaEntregado),
        r.cliente,
        r.productos,
        r.tipoPago,
        S(r.total),
        r.montos.efectivo ? S(r.montos.efectivo) : '',
        r.montos.yape ? S(r.montos.yape) : '',
        r.montos.tarjeta ? S(r.montos.tarjeta) : '',
        r.raw.con_vale ? r.codigoVale || 'Sí' : '',
      ]),
      foot: [['', '', '', '', 'Totales', S(w.total), S(w.efectivo), S(w.yape), S(w.tarjeta), String(w.vales)]],
      columnStyles: {
        0: { cellWidth: 7 },
        1: { cellWidth: 11 },
        3: { cellWidth: 48 },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
        8: { halign: 'right' },
      },
    })
    let y = doc.lastAutoTable.finalY + 6

    // Canjes entregados (no son dinero, pero el trabajador responde por el producto)
    if (w.canjes.length) {
      autoTable(doc, {
        ...table,
        startY: y,
        head: [['Canjes entregados', 'Cliente', 'Productos', 'Motivo']],
        body: w.canjes.map((r) => [hora(r.fechaEntregado), r.cliente, r.productos, r.motivoCanje]),
        headStyles: { ...table.headStyles, fillColor: [109, 74, 191] },
      })
      y = doc.lastAutoTable.finalY + 6
    }

    // Rendición y firmas: si no caben, van en una página nueva.
    if (y > H - 78) {
      doc.addPage()
      y = 20
    }
    doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(...NAVY).text('Rendición', M, y)
    y += 7
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...INK)
    const blank = (label, x, yy, width) => {
      doc.text(label, x, yy)
      doc.setDrawColor(...LINE).setLineWidth(0.3).line(x + doc.getTextWidth(label) + 2, yy + 0.5, x + width, yy + 0.5)
    }
    const half = (W - M * 2) / 2
    blank('Efectivo entregado: S/', M, y, half - 6)
    blank('Diferencia: S/', M + half, y, half)
    y += 8
    blank(`Vales FISE físicos entregados (de ${w.vales}):`, M, y, half - 6)
    blank('Yape/tarjeta verificado:', M + half, y, half)
    y += 8
    blank('Observaciones:', M, y, W - M * 2)
    y += 7
    doc.setDrawColor(...LINE).line(M, y, W - M, y)

    // Firmas
    const sy = Math.max(y + 26, H - 38)
    const sw = 70
    const signature = (x, title, name) => {
      doc.setDrawColor(...INK).setLineWidth(0.4).line(x, sy, x + sw, sy)
      doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...INK).text(title, x + sw / 2, sy + 5, { align: 'center' })
      doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...MUTED).text(name, x + sw / 2, sy + 10, { align: 'center' })
    }
    signature(M + 4, 'Firma del trabajador', [w.nombre, w.dni && `DNI ${w.dni}`].filter(Boolean).join(' · '))
    signature(W - M - sw - 4, 'Recibido por', 'Nombre y DNI: ____________________')
  })

  // Pie con numeración
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(...MUTED)
    doc.text(`Aerogas - Cuadre diario ${meta.fecha}`, M, H - 7)
    doc.text(`Página ${i} de ${pages}`, W - M, H - 7, { align: 'right' })
  }

  downloadBlob(doc.output('blob'), filename)
}
