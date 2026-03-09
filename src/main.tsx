// src/main.tsx
import { createRoot } from 'react-dom/client'
import GlobalStyle from 'styles/global'
import { SpreadsheetGenerator } from 'components/SpreadsheetGenerator'

createRoot(document.getElementById('root')!).render(
  <>
    <SpreadsheetGenerator />
    <GlobalStyle />
  </>
)
