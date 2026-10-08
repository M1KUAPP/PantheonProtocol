/**
 * Application sidebar navigation component.
 *
 * Provides main navigation links and wallet connect/disconnect
 * button with hover-expandable functionality.
 * @module
 */

import {
  ArchiveBoxIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { useSidebar } from '@presentation/components/common/sidebar.context'
import {
  NavLabel,
  NavLink,
  NavMenu,
  NavSection,
  SidebarBackdrop,
  SidebarContainer,
  WalletButton
} from '@presentation/components/common/sidebar.styles'
import { useWalletConnectionViewModel } from '@presentation/view-models/wallet/wallet-connection.vm'

const SIDEBAR_LINKS = [
  { to: '/dashboard', icon: <Squares2X2Icon />, label: 'Dashboard' },
  { to: '/marketplace', icon: <ShoppingBagIcon />, label: 'Marketplace' },
  { to: '/inventory', icon: <ArchiveBoxIcon />, label: 'Inventory' },
  { to: '/create-nft', icon: <PlusCircleIcon />, label: 'Create NFT' }
]

/** Expandable sidebar with navigation links and wallet controls. */
export const Sidebar = () => {
  const { isExpanded, expand, collapse } = useSidebar()
  const { isProperlyConnected, connect, disconnect } = useWalletConnectionViewModel()
  const handleWalletAction = () => {
    if (isProperlyConnected) {
      disconnect()
    } else {
      connect()
    }
  }
  return (
    <>
      <SidebarBackdrop $isExpanded={isExpanded} onClick={collapse} />
      <SidebarContainer $isExpanded={isExpanded} onMouseEnter={expand} onMouseLeave={collapse}>
        <NavSection>
          <NavMenu>
            {SIDEBAR_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} $isExpanded={isExpanded} end={link.to === '/dashboard'}>
                {link.icon}
                <NavLabel $isExpanded={isExpanded}>{link.label}</NavLabel>
              </NavLink>
            ))}
          </NavMenu>
        </NavSection>
        <NavSection>
          <NavMenu>
            <WalletButton $isExpanded={isExpanded} $isConnected={isProperlyConnected} onClick={handleWalletAction}>
              {isProperlyConnected ? <ArrowLeftEndOnRectangleIcon /> : <ArrowRightEndOnRectangleIcon />}
              <NavLabel $isExpanded={isExpanded}>{isProperlyConnected ? 'Disconnect' : 'Connect'}</NavLabel>
            </WalletButton>
          </NavMenu>
        </NavSection>
      </SidebarContainer>
    </>
  )
}
