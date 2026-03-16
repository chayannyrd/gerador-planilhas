import ExcelJS from 'exceljs'
import type { SheetType } from './csvParser'

const MONETARY_FORMAT = 'R$ #,##0.00'
const HEADER_COLOR_EMPRESARIAL = '073763'
const HEADER_COLOR_PENDENCIAS = '073763'
const CENTER: Partial<ExcelJS.Alignment> = { horizontal: 'center' }

// ─── Entry point ──────────────────────────────────────────────────────────────

export async function buildExcel(data: string[][], type: SheetType): Promise<Blob> {
  const workbook = new ExcelJS.Workbook()

  if (type === 'empresarial') {
    buildEmpresarial(workbook, data)
  } else {
    buildPendencias(workbook, data)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

// ─── Planilha Empresarial ─────────────────────────────────────────────────────

function buildEmpresarial(workbook: ExcelJS.Workbook, data: string[][]) {
  const ws = workbook.addWorksheet('FECHAMENTO')
  const MONETARY_COLUMN = 5

  addEmptyRow(ws)
  addHeader(ws, data[0], HEADER_COLOR_EMPRESARIAL)
  addDataRows(ws, data, MONETARY_COLUMN)
  autoFitColumns(ws)
  addEmpresarialFooter(ws)
}

function addEmpresarialFooter(ws: ExcelJS.Worksheet) {
  ws.addRow([])

  addSummaryRow(ws, 'TOTAL', 5, (row) => ({
    formula: `SUM(E3:E${row.number - 2})`,
  }), true)

  addSummaryRow(ws, 'LÍQUIDO (8%)', 5, (row) => ({
    formula: `E${row.number - 1}-(E${row.number - 1}*8%)`,
  }))
}

// ─── Planilha Pendências ──────────────────────────────────────────────────────

function buildPendencias(workbook: ExcelJS.Workbook, data: string[][]) {
  const ws = workbook.addWorksheet('PENDÊNCIAS')

  const header = data[0]

  // Encontra o índice da coluna "Pagamento Pendente" no header filtrado
  const pendentesColIndex = header.findIndex(
    (h) => h.toLowerCase().includes('pendente')
  )

  // +2: ExcelJS é base 1, e adicionamos coluna vazia na col A
  const pendentesExcelCol = pendentesColIndex + 2

  // Label TOTAL fica uma coluna antes de Pendentes
  const labelCol = pendentesExcelCol - 1

  addEmptyRow(ws)
  addHeader(ws, header, HEADER_COLOR_PENDENCIAS)
  addPendenciasDataRows(ws, data, pendentesExcelCol)
  autoFitColumns(ws)
  addPendenciasFooter(ws, pendentesExcelCol, labelCol)
}

function addPendenciasDataRows(
  ws: ExcelJS.Worksheet,
  data: string[][],
  monetaryCol: number
) {
  for (let y = 1; y < data.length; y++) {
    ws.addRow(['', ...data[y]]).eachCell((cell, col) => {
      cell.alignment = CENTER
      if (col === monetaryCol) applyPendenciasMonetary(cell)
    })
  }
}

function applyPendenciasMonetary(cell: ExcelJS.Cell) {
  // Formato do CSV: R$50710.00 — sem separador de milhar, ponto decimal
  const raw = cell.text
  const cleaned = raw.replace(/"/g, '').replace('R$', '').trim()
  const number = Number(cleaned)
  cell.value = isNaN(number) ? 0 : number
  cell.numFmt = MONETARY_FORMAT
}

function addPendenciasFooter(
  ws: ExcelJS.Worksheet,
  pendentesCol: number,
  labelCol: number
) {
  ws.addRow([])

  const colLetter = colIndexToLetter(pendentesCol)

  addSummaryRow(ws, 'TOTAL', pendentesCol, (row) => ({
    formula: `SUM(${colLetter}3:${colLetter}${row.number - 2})`,
  }), true, labelCol)
}

// ─── Helpers compartilhados ───────────────────────────────────────────────────

function addEmptyRow(ws: ExcelJS.Worksheet) {
  ws.addRow([])
}

function addHeader(ws: ExcelJS.Worksheet, headerRow: string[], color: string) {
  ws.addRow(['', ...headerRow]).eachCell((cell, i) => {
    if (i <= 1) return
    cell.alignment = CENTER
    cell.font = { color: { argb: 'FFFFFF' }, bold: true, size: 12 }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color },
    }
  })
}

function addDataRows(ws: ExcelJS.Worksheet, data: string[][], monetaryCol: number) {
  for (let y = 1; y < data.length; y++) {
    ws.addRow(['', ...data[y]]).eachCell((cell, col) => {
      cell.alignment = CENTER
      if (col === monetaryCol) applyMonetary(cell)
    })
  }
}

function applyMonetary(cell: ExcelJS.Cell) {
  const raw = cell.text
  const cleaned = raw.replace(/"/g, '').replace('R$', '').trim().replace(',', '.')
  const number = Number(cleaned)
  cell.value = isNaN(number) ? 0 : number
  cell.numFmt = MONETARY_FORMAT
}

function autoFitColumns(ws: ExcelJS.Worksheet) {
  ws.columns.forEach((column, i) => {
    if (i === 0) return
    let maxWidth = 0
    column.eachCell((cell, row) => {
      const scale = row === 2 ? 1.2 : 1.1
      maxWidth = Math.max(maxWidth, cell.text.length * scale)
    })
    column.width = maxWidth
  })
}

function addSummaryRow(
  ws: ExcelJS.Worksheet,
  label: string,
  valueCol: number,
  formulaFn: (row: ExcelJS.Row) => ExcelJS.CellFormulaValue,
  bold = false,
  labelCol = 4
) {
  const row = ws.addRow(Array(ws.columns.length).fill(''))

  const labelCell = row.findCell(labelCol)
  labelCell.value = label
  labelCell.alignment = CENTER
  if (bold) labelCell.font = { bold: true }

  const valueCell = row.findCell(valueCol)
  valueCell.value = formulaFn(row)
  valueCell.alignment = CENTER
  valueCell.numFmt = MONETARY_FORMAT
  if (bold) valueCell.font = { bold: true }
}

function colIndexToLetter(colIndex: number): string {
  let letter = ''
  let n = colIndex
  while (n > 0) {
    const rem = (n - 1) % 26
    letter = String.fromCharCode(65 + rem) + letter
    n = Math.floor((n - 1) / 26)
  }
  return letter
}
