import { createRoot } from 'react-dom/client'
import GlobalStyle from 'styles/global'
import { NavBar } from 'components/NavBar'
import { SpreadsheetGenerator } from 'components/SpreadsheetGenerator'

createRoot(document.getElementById('root')!).render(
  <>
    <NavBar />
    <SpreadsheetGenerator />
    <GlobalStyle />
  </>
)
