/**
 * @module Explore
 * Explore section component with scroll-triggered animations showcasing platform features.
 * Uses GSAP ScrollTrigger to animate content items as users scroll through the page.
 */

import {
  Container,
  InfoItem,
  InfoItems,
  ItemBox,
  ItemContainer,
  ItemText,
  ItemTitle,
  LineContainer,
  Section,
  Title
} from '@presentation/components/landing/explore.styles'
import { ScrollProgressLine } from '@presentation/components/ui/scroll-progress-line'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

const SCROLL_TRIGGER_START_OFFSET = 200
const TRANSLATE_Y_MULTIPLIER = -30

const INFO_ITEM_MAP = [
  {
    itemTitle: '01',
    itemText:
      'Create and mint your game asset NFTs with custom metadata, rarity levels, and royalty settings. Our intuitive minting interface makes it easy to tokenize your in-game items and bring them to the blockchain.'
  },
  {
    itemTitle: '02',
    itemText:
      'Browse our comprehensive marketplace featuring game assets from multiple gaming universes. Filter by game, rarity, price, and asset type to find exactly what you need for your collection.'
  },
  {
    itemTitle: '03',
    itemText:
      'Trade with confidence using our secure smart contract system. Every transaction is verifiable on-chain, ensuring authenticity and preventing fraud while supporting creator royalties.'
  },
  {
    itemTitle: '04',
    itemText:
      "Manage your entire NFT portfolio in one place. Track your assets, view price history, and monitor your collection's value with our comprehensive inventory management dashboard."
  },
  {
    itemTitle: '05',
    itemText:
      'Export your game assets seamlessly between compatible games and platforms. Our export manager ensures your NFTs maintain their properties and metadata across different gaming ecosystems.'
  },
  {
    itemTitle: '06',
    itemText:
      'Connect with Web3 using popular wallets like MetaMask. Our platform supports multiple networks and provides real-time transaction updates with transparent gas fee estimates.'
  }
]

/**
 * Props for the Details component that displays individual feature items.
 */
interface DetailsProps {
  itemTitle: string
  itemText: string
  addToRef: (el: HTMLLIElement | null) => void
  translateY: string
  opacity: number
}

const Details = ({ itemTitle, itemText, addToRef, translateY, opacity }: DetailsProps) => {
  return (
    <InfoItem ref={addToRef}>
      <ItemContainer $translateY={translateY} $opacity={opacity}>
        <ItemBox>
          <ItemTitle>{itemTitle}</ItemTitle>
          <ItemText>{itemText}</ItemText>
        </ItemBox>
      </ItemContainer>
    </InfoItem>
  )
}

const createScrollUpdateHandler = (
  index: number,
  setItemStates: React.Dispatch<React.SetStateAction<Array<{ translateY: string; opacity: number }>>>
) => {
  return (self: ScrollTrigger) => {
    const progress = self.progress
    const newTranslateY = `${TRANSLATE_Y_MULTIPLIER * progress}%`
    const newOpacity = progress
    setItemStates((prev) => {
      const newStates = [...prev]
      newStates[index] = { translateY: newTranslateY, opacity: newOpacity }
      return newStates
    })
  }
}

const createScrollTriggerConfig = (
  element: HTMLLIElement,
  index: number,
  setItemStates: React.Dispatch<React.SetStateAction<Array<{ translateY: string; opacity: number }>>>
): gsap.TweenVars => ({
  scrollTrigger: {
    trigger: element,
    start: `top center+=${SCROLL_TRIGGER_START_OFFSET}px`,
    end: 'bottom center',
    scrub: true,
    onUpdate: createScrollUpdateHandler(index, setItemStates)
  }
})

gsap.registerPlugin(ScrollTrigger)

/**
 * Explore section component that presents platform features with scroll-based animations.
 * Dynamically adjusts item opacity and position based on scroll progress using GSAP.
 */
export const Explore = () => {
  const showRefs = useRef<HTMLLIElement[]>([])
  const refsInitialized = useRef(false)
  const [itemStates, setItemStates] = useState<Array<{ translateY: string; opacity: number }>>(
    INFO_ITEM_MAP.map(() => ({ translateY: '0%', opacity: 0 }))
  )
  const addToRefs = useCallback((e: HTMLLIElement | null) => {
    if (e && !showRefs.current.includes(e)) {
      showRefs.current.push(e)
    }
  }, [])
  useLayoutEffect(() => {
    if (refsInitialized.current) return
    refsInitialized.current = true
    const tl = gsap.timeline()
    showRefs.current.forEach((element, index) => {
      tl.to(element, createScrollTriggerConfig(element, index, setItemStates))
    })
    return () => {
      tl.kill()
    }
  }, [])
  return (
    <Section id="explore">
      <Title>Explore</Title>
      <Container>
        <LineContainer>
          <ScrollProgressLine />
        </LineContainer>
        <InfoItems>
          <InfoItem></InfoItem>
          {INFO_ITEM_MAP.map((item, index) => (
            <Details
              key={index}
              itemTitle={item.itemTitle}
              itemText={item.itemText}
              addToRef={addToRefs}
              translateY={itemStates[index]?.translateY || '0%'}
              opacity={itemStates[index]?.opacity || 0}
            />
          ))}
        </InfoItems>
      </Container>
    </Section>
  )
}
