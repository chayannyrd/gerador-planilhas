import Papa from 'papaparse'

export type SheetType = 'empresarial' | 'pendencias'

const EXCLUDED_COLUMNS_EMPRESARIAL = [4, 5, 17]
const EXCLUDED_COLUMNS_PENDENCIAS = [17]

export async function parseCsv(file: File, type: SheetType): Promise<string[][]> {
  const raw: string[][] = await new Promise((resolve) => {
    Papa.parse(file, {
      complete: (result) => resolve(result.data as string[][]),
    })
  })

  const excluded = type === 'empresarial'
    ? EXCLUDED_COLUMNS_EMPRESARIAL
    : EXCLUDED_COLUMNS_PENDENCIAS

  const validColumns = getValidColumns(raw, excluded)
  return filterColumns(raw, validColumns)
}

function getValidColumns(data: string[][], excluded: number[]): Set<number> {
  const validColumns = new Set<number>()

  for (let y = 1; y < data.length; y++) {
    const row = data[y]
    for (let x = 0; x < row.length; x++) {
      if (row[x]) validColumns.add(x)
    }
  }

  excluded.forEach((col) => validColumns.delete(col))

  return validColumns
}

function filterColumns(data: string[][], validColumns: Set<number>): string[][] {
  return data.map((row) => row.filter((_, i) => validColumns.has(i)))
}
