import { LogoImg, Nav, NavLink, NavLinks } from './styles'

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
]

export function NavBar() {
  return (
    <Nav>
      <LogoImg src="fly.png" alt=" Flysmart" />
      <NavLinks>
        {LINKS.map(({ label, href, icon }) => (
          <NavLink key={label} href={href} target="_blank" rel="noopener noreferrer">
            {icon}
            {label}
          </NavLink>
        ))}
      </NavLinks>
    </Nav>
  )
}
