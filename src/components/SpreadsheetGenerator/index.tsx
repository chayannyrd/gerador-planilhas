//SpreadsheetGenerataor/index.tsx
import type { SheetType } from 'utils/csvParser'
import { useSpreadsheetGenerator } from 'hooks/useSpreadsheetGenerator'
import {
  Container,
  FileInput,
  FileLabel,
  GenerateButton,
  Header,
  Select,
  SelectLabel,
  Subtitle,
  Title,
} from './styles'

export function SpreadsheetGenerator() {
  const { inputRef, anchorRef, sheetType, onSheetTypeChange, onGenerate } =
    useSpreadsheetGenerator()

  return (
    <Container>
      <Header>
        <Title>Gerador de Planilhas</Title>
        <Subtitle>Importe um CSV e exporte um Excel formatado.</Subtitle>
      </Header>

      <SelectLabel htmlFor="sheet-type">Tipo de planilha</SelectLabel>
      <Select
        id="sheet-type"
        value={sheetType}
        onChange={(e) => onSheetTypeChange(e.target.value as SheetType)}
      >
        <option value="empresarial">Planilha Empresarial</option>
        <option value="pendencias">Planilha - Pendências</option>
      </Select>

      <FileLabel htmlFor="csv-upload">Arquivo CSV</FileLabel>
      <FileInput id="csv-upload" ref={inputRef} type="file" accept=".csv" />

      <GenerateButton onClick={onGenerate}>Gerar Excel</GenerateButton>

      <a ref={anchorRef} hidden />
    </Container>
  )
} 