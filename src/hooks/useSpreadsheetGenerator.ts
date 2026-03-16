import React from 'react'
import { parseCsv, type SheetType } from 'utils/csvParser'
import { buildExcel } from 'utils/excelBuilder'

interface UseSpreadsheetGenerator {
  inputRef: React.RefObject<HTMLInputElement>
  anchorRef: React.RefObject<HTMLAnchorElement>
  sheetType: SheetType
  onSheetTypeChange: (type: SheetType) => void
  onGenerate: () => Promise<void>
}

export function useSpreadsheetGenerator(): UseSpreadsheetGenerator {
  const inputRef = React.useRef({} as HTMLInputElement)
  const anchorRef = React.useRef({} as HTMLAnchorElement)
  const [sheetType, setSheetType] = React.useState<SheetType>('empresarial')

  function onSheetTypeChange(type: SheetType) {
    setSheetType(type)
  }

  async function onGenerate() {
    const input = inputRef.current

    if (!input.files?.length) {
      alert('Selecione um arquivo CSV primeiro!')
      return
    }

    const file = input.files[0]
    const data = await parseCsv(file, sheetType)
    const blob = await buildExcel(data, sheetType)

    anchorRef.current.href = URL.createObjectURL(blob)
    anchorRef.current.click()
  }

  return { inputRef, anchorRef, sheetType, onSheetTypeChange, onGenerate }
}