import { useSpreadsheetGenerator } from 'hooks/useSpreadsheetGenerator'
import {
  Container,
  FileInput,
  FileLabel,
  GenerateButton,
  Header,
  Subtitle,
  Title,
} from './styles'

export function SpreadsheetGenerator() {
  const { inputRef, anchorRef, onGenerate } = useSpreadsheetGenerator()

  return (
    <Container>
      <Header>
        <Title>Gerador de Planilhas</Title>
        <Subtitle>Importe um CSV e exporte um Excel formatado.</Subtitle>
      </Header>

      <FileLabel htmlFor="csv-upload">Arquivo CSV</FileLabel>
      <FileInput id="csv-upload" ref={inputRef} type="file" accept=".csv" />

      <GenerateButton onClick={onGenerate}>Gerar Excel</GenerateButton>

      <a ref={anchorRef} hidden />
    </Container>
  )
}
