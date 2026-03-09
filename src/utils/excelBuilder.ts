import ExcelJS from 'exceljs'

const MONETARY_FORMAT = 'R$ #,##0.00'
const HEADER_COLOR = '073763'
const CENTER: Partial<ExcelJS.Alignment> = { horizontal: 'center' }
const MONETARY_COLUMN = 5

export async function buildExcel(data: string[][]): Promise<Blob> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('FECHAMENTO')

  addEmptyRow(worksheet)
  addHeader(worksheet, data[0])
  addDataRows(worksheet, data)
  autoFitColumns(worksheet)
  addFooter(worksheet)

  const buffer = await workbook.xlsx.writeBuffer()

  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function addEmptyRow(ws: ExcelJS.Worksheet) {
  ws.addRow([])
}

function addHeader(ws: ExcelJS.Worksheet, headerRow: string[]) {
  ws.addRow(['', ...headerRow]).eachCell((cell, i) => {
    if (i <= 1) return
    cell.alignment = CENTER
    cell.font = { color: { argb: 'FFFFFF' }, bold: true, size: 12 }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: HEADER_COLOR },
    }
  })
}

function addDataRows(ws: ExcelJS.Worksheet, data: string[][]) {
  for (let y = 1; y < data.length; y++) {
    ws.addRow(['', ...data[y]]).eachCell((cell, col) => {
      cell.alignment = CENTER
      if (col === MONETARY_COLUMN) applyMonetary(cell)
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

function addFooter(ws: ExcelJS.Worksheet) {
  ws.addRow([])

  addSummaryRow(ws, 'TOTAL', (row) => ({
    formula: `SUM(E3:E${row.number - 2})`,
  }), true)

  addSummaryRow(ws, 'LÍQUIDO (-8%)', (row) => ({
    formula: `E${row.number - 1}-(E${row.number - 1}*8%)`,
  }))
}

function addSummaryRow(
  ws: ExcelJS.Worksheet,
  label: string,
  formulaFn: (row: ExcelJS.Row) => ExcelJS.CellFormulaValue,
  bold = false
) {
  const row = ws.addRow(Array(ws.columns.length).fill(''))

  const labelCell = row.findCell(4)
  labelCell.value = label
  labelCell.alignment = CENTER
  if (bold) labelCell.font = { bold: true }

  const valueCell = row.findCell(5)
  valueCell.value = formulaFn(row)
  valueCell.alignment = CENTER
  valueCell.numFmt = MONETARY_FORMAT
  if (bold) valueCell.font = { bold: true }
}
