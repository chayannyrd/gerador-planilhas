import Papa from 'papaparse'

const EXCLUDED_COLUMNS = [4, 5, 17]

export async function parseCsv(file: File): Promise<string[][]> {
  const raw: string[][] = await new Promise((resolve) => {
    Papa.parse(file, {
      complete: (result) => resolve(result.data as string[][]),
    })
  })

  const validColumns = getValidColumns(raw)
  return filterColumns(raw, validColumns)
}

function getValidColumns(data: string[][]): Set<number> {
  const validColumns = new Set<number>()

  for (let y = 1; y < data.length; y++) {
    const row = data[y]
    for (let x = 0; x < row.length; x++) {
      if (row[x]) validColumns.add(x)
    }
  }

  EXCLUDED_COLUMNS.forEach((col) => validColumns.delete(col))

  return validColumns
}

function filterColumns(data: string[][], validColumns: Set<number>): string[][] {
  return data.map((row) => row.filter((_, i) => validColumns.has(i)))
}
