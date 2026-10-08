/**
 * @module Footer
 * Footer component for the landing page with navigation, social links, and call-to-action.
 * Provides site navigation, social media links, and a banner encouraging user registration.
 */

import {
  AuthorContainer,
  BannerContainer,
  ButtonContainer,
  Container,
  InfoContainer,
  MenuItem,
  MenuItems,
  Section,
  SocialIcons,
  Title
} from '@presentation/components/landing/footer.styles'
import { Button } from '@presentation/components/ui/button'
import { Logo } from '@presentation/components/ui/logo'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

const SOCIAL_ICON_MAP = [
  { href: 'https://www.facebook.com', icon: <FaFacebook size={25} /> },
  { href: 'https://www.twitter.com', icon: <FaTwitter size={25} /> },
  { href: 'https://www.instagram.com', icon: <FaInstagram size={25} /> },
  { href: 'https://www.linkedin.com', icon: <FaLinkedin size={25} /> }
]

const MENU_ITEM_MAP = [
  { name: 'Home', id: 'home' },
  { id: 'about', name: 'About' },
  { id: 'explore', name: 'Explore' },
  { id: 'showcase', name: 'Showcase' },
  { id: 'faq', name: 'FAQ' }
]

/**
 * Footer section component with call-to-action banner, navigation menu, and social links.
 * Includes smooth scrolling navigation and external social media links with proper accessibility.
 */
export const Footer = () => {
  const navigateTo = (id: string) => {
    const e = document.getElementById(id)
    e?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  }
  return (
    <Section>
      <BannerContainer>
        <Title>Start Trading Game Assets Now</Title>
        <ButtonContainer>
          <Button text="Join Now" link="/dashboard" />
        </ButtonContainer>
      </BannerContainer>
      <Container>
        <InfoContainer>
          <Logo />
          <SocialIcons>
            {SOCIAL_ICON_MAP.map((social, index) => (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer">
                {social.icon}
              </a>
            ))}
          </SocialIcons>
        </InfoContainer>
        <MenuItems>
          {MENU_ITEM_MAP.map((item, index) => (
            <MenuItem key={index} onClick={() => navigateTo(item.id)}>
              {item.name}
            </MenuItem>
          ))}
        </MenuItems>
      </Container>
      <AuthorContainer>
        <span>&copy; {new Date().getFullYear()} Pantheon Protocol. All rights reserved.</span>
        <span>Made with &hearts; by Pantheon Protocol</span>
      </AuthorContainer>
    </Section>
  )
}
