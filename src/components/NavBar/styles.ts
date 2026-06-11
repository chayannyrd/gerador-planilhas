import styled from 'styled-components'
import { Link } from 'react-router-dom'

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
`

/* ── Desktop links ─────────────────────────────────────── */

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 640px) {
    display: none;
  }
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

export const NavRouterLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? '#c8d8e8' : '#64829a')};
  background: ${({ $active }) => ($active ? '#1e3248' : 'transparent')};

  &:hover {
    background: #1e3248;
    color: #c8d8e8;
  }

  svg {
    width: 13px;
    height: 13px;
    opacity: ${({ $active }) => ($active ? '1' : '0.6')};
  }
`

/* ── Hamburguer button (só mobile) ─────────────────────── */

export const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #64829a;

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 640px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

/* ── Backdrop ───────────────────────────────────────────── */

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;
`

/* ── Drawer ─────────────────────────────────────────────── */

export const Drawer = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 260px;
  background: #0d1a27;
  border-left: 1px solid #1e3248;
  z-index: 200;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform 0.25s ease;
`

export const CloseButton = styled.button`
  display: flex;
  align-self: flex-end;
  background: none;
  border: none;
  cursor: pointer;
  color: #64829a;
  padding: 4px;
  margin-bottom: 0.75rem;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: #c8d8e8;
  }
`

export const DrawerLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 10px 12px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64829a;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #1e3248;
    color: #c8d8e8;
  }

  svg {
    width: 15px;
    height: 15px;
    opacity: 0.6;
    flex-shrink: 0;
  }
`

export const DrawerNavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 10px 12px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  color: ${({ $active }) => ($active ? '#c8d8e8' : '#64829a')};
  background: ${({ $active }) => ($active ? '#1e3248' : 'transparent')};

  &:hover {
    background: #1e3248;
    color: #c8d8e8;
  }

  svg {
    width: 15px;
    height: 15px;
    opacity: ${({ $active }) => ($active ? '1' : '0.6')};
    flex-shrink: 0;
  }
`
