import styled from 'styled-components'

export const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: #0d1a27;
  border-bottom: 1px solid #1e3248;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
`

export const LogoImg = styled.img`
  height: 28px;
  width: auto;
  display: block;
  user-select: none;
  pointer-events: none;
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #64829a;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;

  &:hover {
    background: #1e3248;
    color: #c8d8e8;
  }

  svg {
    width: 13px;
    height: 13px;
    opacity: 0.6;
  }
`
