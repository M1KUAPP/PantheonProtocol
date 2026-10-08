/**
 * @module Faq
 * FAQ section component displaying frequently asked questions in an accordion format.
 * Provides answers to common questions about the platform, NFTs, fees, and security.
 */

import { Container, Section, Title } from '@presentation/components/landing/faq.styles'
import { AccordionItem } from '@presentation/components/ui/accordion-item'

const QUESTION_MAP = [
  {
    title: 'What is a game asset NFT?',
    subText:
      'A game asset NFT is a unique digital token that represents ownership of an in-game item on the blockchain. Unlike traditional game items, NFTs can be traded, sold, or transferred between players, and you truly own them outside the game environment.'
  },
  {
    title: 'How do I get started on the platform?',
    subText:
      'Connect your Web3 wallet (like MetaMask) to our platform. Make sure you have some ETH for gas fees. Once connected, you can browse the marketplace, create your own NFTs, or start trading immediately.'
  },
  {
    title: 'What are the fees for buying and selling?',
    subText:
      "We charge a small platform fee on each transaction to maintain the marketplace. Additionally, you'll pay blockchain gas fees for minting and trading. Creators can set their own royalty percentages (typically 2-10%) that they earn on secondary sales."
  },
  {
    title: 'How do royalties work for creators?',
    subText:
      "When you mint an NFT, you can set a royalty percentage (up to 10%). Every time your NFT is resold on our marketplace, you automatically receive that percentage of the sale price. This ensures creators benefit from their assets' long-term success."
  },
  {
    title: 'Can I use my NFTs in multiple games?',
    subText:
      "Our Export Manager feature allows compatible game assets to be used across different gaming platforms. However, this depends on whether the receiving game supports the specific NFT standard and metadata. Check each asset's compatibility information."
  },
  {
    title: 'Is my wallet secure on this platform?',
    subText:
      'We never store your private keys or have access to your wallet. All transactions are signed through your wallet provider. We use industry-standard security practices and smart contracts that have been thoroughly tested to ensure your assets remain safe.'
  }
]

/**
 * FAQ section component that displays commonly asked questions and answers.
 * Questions are rendered as expandable accordion items for better user experience.
 */
export const Faq = () => {
  return (
    <Section id="faq">
      <Title>Faq</Title>
      <Container>
        {QUESTION_MAP.map((q, index) => (
          <AccordionItem key={index} title={q.title} subText={q.subText} />
        ))}
      </Container>
    </Section>
  )
}
