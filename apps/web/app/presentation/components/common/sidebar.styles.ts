import { CustomBackdrop } from '@presentation/components/common/backdrop'
import { NavLink as RouterNavLink } from 'react-router'
import styled from 'styled-components'

export const SidebarBackdrop = styled(CustomBackdrop)<{ $isExpanded: boolean }>`
  z-index: 99;
  opacity: ${(props) => (props.$isExpanded ? 1 : 0)};
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${(props) => (props.$isExpanded ? 'auto' : 'none')};
`

export const SidebarContainer = styled.aside<{ $isExpanded: boolean }>`
  position: fixed;
  top: 0;
  left: 1.5rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${(props) => (props.$isExpanded ? props.theme.sidebarExpandedWidth : props.theme.sidebarWidth)};
  height: 100vh;
  padding: 1.5rem 0.75rem;
  border-right: none;
  box-sizing: border-box;
  background-color: transparent;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
`

export const NavSection = styled.div`
  display: flex;
  flex-direction: column;
`

export const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.35rem;
`

export const NavLink = styled(RouterNavLink)<{ $isExpanded: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 2.75rem;
  padding: 0 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: ${(props) => props.theme.sidebarText};
  transition: all 0.2s ease-in-out;

  svg {
    width: ${(props) => props.theme.navIconSize};
    height: ${(props) => props.theme.navIconSize};
    transition: stroke 0.2s ease-in-out;
    flex-shrink: 0;
    stroke: ${(props) => props.theme.sidebarIcon};
  }

  &.active,
  &:hover {
    color: ${(props) => props.theme.secondary};
    background-color: ${(props) => props.theme.main};

    svg {
      stroke: ${(props) => props.theme.secondary};
    }
  }

  &:active {
    transform: scale(0.95);
  }
`

export const NavLabel = styled.span<{ $isExpanded: boolean }>`
  margin-left: 0.75rem;
  white-space: nowrap;
  opacity: ${(props) => (props.$isExpanded ? 1 : 0)};
  transition: opacity ${(props) => (props.$isExpanded ? '0.2s ease-in-out 0.1s' : '0.1s ease-in-out')};
`

export const WalletButton = styled.button<{
  $isExpanded: boolean
  $isConnected: boolean
}>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 2.75rem;
  padding: 0 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: ${(props) => props.theme.fonts};
  font-weight: 500;
  text-decoration: none;
  color: ${(props) => props.theme.sidebarText};
  background-color: transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  svg {
    width: ${(props) => props.theme.navIconSize};
    height: ${(props) => props.theme.navIconSize};
    transition: fill 0.2s ease-in-out;
    flex-shrink: 0;
    fill: ${(props) => props.theme.sidebarIcon};
  }

  &:hover {
    color: ${(props) => (props.$isConnected ? props.theme.disconnectButton : props.theme.connectButton)};
    background-color: ${(props) => (props.$isConnected ? props.theme.disconnectButtonBg : props.theme.connectButtonBg)};

    svg {
      fill: ${(props) => (props.$isConnected ? props.theme.disconnectButton : props.theme.connectButton)};
    }
  }

  &:active {
    transform: scale(0.95);
  }
`
