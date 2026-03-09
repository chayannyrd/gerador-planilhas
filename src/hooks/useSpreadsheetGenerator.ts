import React from 'react'
import { parseCsv } from 'utils/csvParser'
import { buildExcel } from 'utils/excelBuilder'

interface UseSpreadsheetGenerator {
  inputRef: React.RefObject<HTMLInputElement>
  anchorRef: React.RefObject<HTMLAnchorElement>
  onGenerate: () => Promise<void>
}

export function useSpreadsheetGenerator(): UseSpreadsheetGenerator {
  const inputRef = React.useRef({} as HTMLInputElement)
  const anchorRef = React.useRef({} as HTMLAnchorElement)

  async function onGenerate() {
    const input = inputRef.current

    if (!input.files?.length) {
      alert('Selecione um arquivo CSV primeiro!')
      return
    }

    const file = input.files[0]
    const data = await parseCsv(file)
    const blob = await buildExcel(data)

    anchorRef.current.href = URL.createObjectURL(blob)
    anchorRef.current.click()
  }

  return { inputRef, anchorRef, onGenerate }
}
