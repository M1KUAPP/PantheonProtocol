/**
 * @module Home
 * Hero section component for the landing page featuring animated text and video.
 * Displays the main hero section with typing text animation, background video, and decorative NFT text circle.
 */

import { Box, Container, Section, VideoContainer } from '@presentation/components/landing/home.styles'
import { NFTTextCircle } from '@presentation/components/ui/nft-text-circle'
import { TypingText } from '@presentation/components/ui/typing-text'
import HomeVideo from '@presentation/media/home-video.mp4'

/**
 * Home hero section component that serves as the first visual element on the landing page.
 * Combines typing text animation, looping video background, and decorative circular text element.
 */
export const Home = () => {
  return (
    <Section id="home">
      <Container>
        <Box>
          <TypingText />
        </Box>
        <Box>
          <VideoContainer>
            <video src={HomeVideo} autoPlay muted loop />
          </VideoContainer>
        </Box>
        <NFTTextCircle />
      </Container>
    </Section>
  )
}
