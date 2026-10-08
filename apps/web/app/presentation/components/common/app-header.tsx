/**
 * Application header component with navigation and controls.
 *
 * Displays the current page title, theme toggle, notification bell,
 * and user profile across all authenticated pages.
 * @module
 */

import { createAppConfig } from '@config/app-config'
import { BellIcon, HomeIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import {
  IconButton,
  PageHeaderContainer,
  PageTitle,
  ProfileContainer,
  ProfileImageContainer,
  TopBarContainer
} from '@presentation/components/common/app-header.styles'
import { NotificationModal } from '@presentation/components/common/notification-modal'
import { NotificationStore } from '@presentation/services/notification-store.service'
import { useThemeToggle } from '@presentation/styles/theme-provider'
import { useNotificationModalViewModel } from '@presentation/view-models/dashboard/notification-modal.vm'
import { useWalletConnectionViewModel } from '@presentation/view-models/wallet/wallet-connection.vm'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'

/**
 * Maps route paths to human-readable page titles.
 * @param pathname - The current URL pathname.
 * @returns The display title for the page.
 */
const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/marketplace':
      return 'Marketplace'
    case '/inventory':
      return 'My Inventory'
    case '/create-nft':
      return 'Create NFT'
    case '/dashboard':
    default:
      return 'Dashboard'
  }
}

/** Top header bar with page title, theme toggle, notifications, and profile. */
export const AppHeader = () => {
  const { address, isProperlyConnected } = useWalletConnectionViewModel()
  const location = useLocation()
  const navigate = useNavigate()
  const { isOpen, notifications, toggle, close, clearAll } = useNotificationModalViewModel()
  const { themeMode, toggleTheme } = useThemeToggle()
  const appConfig = createAppConfig()
  const prevConnectionStatusRef = useRef(isProperlyConnected)
  useEffect(() => {
    if (prevConnectionStatusRef.current && !isProperlyConnected) {
      NotificationStore.clearAll()
    }
    prevConnectionStatusRef.current = isProperlyConnected
  }, [isProperlyConnected])
  const isDarkMode = themeMode === 'dark'
  const title = getPageTitle(location.pathname)
  return (
    <TopBarContainer>
      <PageHeaderContainer>
        <PageTitle>{title}</PageTitle>
      </PageHeaderContainer>
      <ProfileContainer>
        <IconButton onClick={() => navigate('/')} title="Home">
          <HomeIcon width={20} height={20} />
        </IconButton>
        <IconButton onClick={toggleTheme} title="Toggle Theme">
          {isDarkMode ? <SunIcon width={20} height={20} /> : <MoonIcon width={20} height={20} />}
        </IconButton>
        <div style={{ position: 'relative' }}>
          <IconButton onClick={toggle}>
            <BellIcon width={20} height={20} />
          </IconButton>
          {isOpen && <NotificationModal notifications={notifications} onClearAll={clearAll} onClose={close} />}
        </div>
        <ProfileImageContainer as="div">
          <img src={appConfig.getAvatarUrl(address ?? '')} alt="User Profile" />
        </ProfileImageContainer>
      </ProfileContainer>
    </TopBarContainer>
  )
}
