import React from 'react'
import { Backdrop, CloseButton, Drawer, DrawerLink, HamburgerButton, LogoImg, Nav, NavLink, NavLinks } from './styles'

const LINKS = [
  {
    label: 'Relatórios',
    href: 'https://airtable.com/appH9OXwYcxW7ise2/pagbVspANz33YsyeR?4jumb%3Agroup=eyJwZWxJcFNKT0lReXNUVjZ1SyI6W119',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: 'Gerador de Faturas',
    href: 'https://airtable.com/appH9OXwYcxW7ise2/pag8uFPk9Q950bpSw?hiBmi=recns1uxCAjy868Ih',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Google Planilhas',
    href: 'https://docs.google.com/spreadsheets/u/0/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
  },
  {
    label: 'Consultar CNPJ',
    href: 'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
]

export function NavBar() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Nav>
        <LogoImg src="fly.png" alt="Flysmart" />

        {/* Desktop */}
        <NavLinks>
          {LINKS.map(({ label, href, icon }) => (
            <NavLink key={label} href={href} target="_blank" rel="noopener noreferrer">
              {icon}
              {label}
            </NavLink>
          ))}
        </NavLinks>

        {/* Mobile: botão hamburguer */}
        <HamburgerButton onClick={() => setOpen(true)} aria-label="Abrir menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </HamburgerButton>
      </Nav>

      {/* Mobile: drawer */}
      {open && <Backdrop onClick={() => setOpen(false)} />}
      <Drawer $open={open}>
        <CloseButton onClick={() => setOpen(false)} aria-label="Fechar menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>
        {LINKS.map(({ label, href, icon }) => (
          <DrawerLink key={label} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            {icon}
            {label}
          </DrawerLink>
        ))}
      </Drawer>
    </>
  )
}
