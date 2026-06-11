import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalStyle from 'styles/global'
import { NavBar } from 'components/NavBar'
import { SpreadsheetGenerator } from 'components/SpreadsheetGenerator'
import { PdfMerger } from 'components/PdfMerger'
import { Footer } from 'components/PdfMerger/styles'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<SpreadsheetGenerator />} />
      <Route path="/gerador-planilhas" element={<SpreadsheetGenerator />} />
      <Route path="/mesclar-pdf" element={<PdfMerger />} />
    </Routes>
    <GlobalStyle />
  </BrowserRouter>

)
