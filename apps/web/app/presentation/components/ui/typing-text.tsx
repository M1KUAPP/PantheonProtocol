/**
 * Animated typing text component for the landing hero section.
 *
 * Displays a headline with typewriter effect cycling through
 * different highlighted words with theme colors.
 * @module
 */

import { Button } from '@presentation/components/ui/button'
import { ButtonContainer, SubText, Title } from '@presentation/components/ui/typing-text.styles'
import { useTheme } from 'styled-components'
import Typewriter from 'typewriter-effect'

/** Hero section with animated typewriter text and explore button. */
export const TypingText = () => {
  const theme = useTheme()
  const TEXT_MAP = [
    { text: 'Game Assets.', color: theme.accent1 },
    { text: 'NFTs.', color: theme.accent2 },
    { text: 'Collectibles.', color: theme.accent3 }
  ]
  const navigateTo = () => {
    const aboutSection = document.getElementById('about')
    aboutSection?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  }
  return (
    <>
      <Title>
        Explore the new era of
        <Typewriter
          options={{
            autoStart: true,
            loop: true
          }}
          onInit={(typewriter) => {
            TEXT_MAP.forEach(({ text, color }) => {
              typewriter.typeString(`<span style="color: ${color}">${text}</span>`).pauseFor(2000).deleteAll()
            })
            typewriter.start()
          }}
        />
      </Title>
      <SubText>Discover in-game asset true ownership.</SubText>
      <ButtonContainer>
        <Button text="Explore" onClick={navigateTo} />
      </ButtonContainer>
    </>
  )
}
