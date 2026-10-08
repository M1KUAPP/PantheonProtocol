/**
 * @module NavigationBar
 * Main navigation bar component for the landing page with smooth scroll navigation.
 * Provides site-wide navigation with logo, menu items, and wallet connection functionality.
 */

import { MenuItem, MenuItems, Navbar, Section } from '@presentation/components/landing/navigation-bar.styles'
import { Logo } from '@presentation/components/ui/logo'
import { ConnectWallet } from '@presentation/components/wallet/connect-wallet'

const MENU_ITEM_MAP = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'explore', name: 'Explore' },
  { id: 'showcase', name: 'Showcase' },
  { id: 'team', name: 'Team' },
  { id: 'faq', name: 'FAQ' }
]

/**
 * Navigation bar component that provides smooth scrolling navigation across landing page sections.
 * Includes logo branding, menu navigation, and wallet connection controls.
 */
export const NavigationBar = () => {
  const navigateTo = (id: string) => {
    let e = document.getElementById(id)
    e?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  }
  return (
    <Section>
      <Navbar>
        <Logo />
        <MenuItems>
          {MENU_ITEM_MAP.map((item, index) => (
            <MenuItem key={index} onClick={() => navigateTo(item.id)}>
              {item.name}
            </MenuItem>
          ))}
        </MenuItems>
        <ConnectWallet />
      </Navbar>
    </Section>
  )
}
