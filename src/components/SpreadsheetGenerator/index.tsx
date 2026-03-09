import { useSpreadsheetGenerator } from 'hooks/useSpreadsheetGenerator'
import { Container, FileInput, GenerateButton, Title } from './styles'

export function SpreadsheetGenerator() {
  const { inputRef, anchorRef, onGenerate } = useSpreadsheetGenerator()

  return (
    <Container>
      <Title as="h2">GERAR PLANILHA FORMATADA</Title>

      <FileInput ref={inputRef} type="file" accept=".csv" />

      <GenerateButton onClick={onGenerate}>GERAR EXCEL</GenerateButton>

      <a ref={anchorRef} hidden />
    </Container>
  )
}
