/**
 * @module About
 * About section component for the landing page that showcases the platform's value proposition.
 * Displays an NFT carousel alongside marketing content and a call-to-action button.
 */

import {
  Box,
  ButtonContainer,
  Caption,
  Container,
  Section,
  SubText,
  Title
} from '@presentation/components/landing/about.styles'
import { Button } from '@presentation/components/ui/button'
import { NFTCarousel } from '@presentation/components/ui/nft-carousel'
import { DarkTheme } from '@presentation/styles/theme-definitions'
import { ThemeProvider } from 'styled-components'

const navigateTo = () => {
  const aboutSection = document.getElementById('explore')
  aboutSection?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  })
}

/**
 * About section component that introduces the platform's core features and benefits.
 * Features an NFT carousel, descriptive text, and navigation to the Explore section.
 */
export const About = () => {
  return (
    <Section id="about">
      <Container>
        <Box>
          <NFTCarousel />
        </Box>
        <Box>
          <Title>Trade Gaming Assets Like Never Before</Title>
          <SubText>
            Welcome to the premier blockchain marketplace for game asset NFTs. Buy, sell, and trade unique in-game items
            with true ownership secured by smart contracts. Experience the future of gaming economies.
          </SubText>
          <Caption>
            Built on Ethereum with seamless wallet integration, our platform ensures secure transactions, verifiable
            ownership, and instant liquidity for your digital gaming treasures. Join thousands of gamers revolutionizing
            how virtual assets are owned and traded.
          </Caption>
          <ButtonContainer>
            <ThemeProvider theme={DarkTheme}>
              <Button text="Explore More" onClick={navigateTo} />
            </ThemeProvider>
          </ButtonContainer>
        </Box>
      </Container>
    </Section>
  )
}
