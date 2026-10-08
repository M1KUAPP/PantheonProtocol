/**
 * @module Showcase
 * NFT showcase section with animated scrolling rows displaying sample NFT collections.
 * Features horizontal scrolling animation with pause-on-hover functionality for NFT previews.
 */

import { Details, ImageContainer, Price, Row, Section } from '@presentation/components/landing/showcase.styles'
import abstract0 from '@presentation/media/nfts/abstract-0.png'
import abstract1 from '@presentation/media/nfts/abstract-1.png'
import abstract2 from '@presentation/media/nfts/abstract-2.png'
import abstract3 from '@presentation/media/nfts/abstract-3.png'
import abstract4 from '@presentation/media/nfts/abstract-4.png'
import abstract5 from '@presentation/media/nfts/abstract-5.png'
import abstract6 from '@presentation/media/nfts/abstract-6.png'
import abstract7 from '@presentation/media/nfts/abstract-7.png'
import abstract8 from '@presentation/media/nfts/abstract-8.png'
import abstract9 from '@presentation/media/nfts/abstract-9.png'
import { useRef } from 'react'
import { FaEthereum } from 'react-icons/fa'

const NFT_IMAGES = [
  abstract0,
  abstract1,
  abstract2,
  abstract3,
  abstract4,
  abstract5,
  abstract6,
  abstract7,
  abstract8,
  abstract9
]

const NFT_NAMES = [
  'CryptoKnight',
  'PixelDragon',
  'CosmicApe',
  'NeonPunk',
  'GalacticWolf',
  'CyberTiger',
  'QuantumBear',
  'SolarPhoenix',
  'DiamondLion',
  'EtherWhale',
  'AstralFox',
  'VoidSerpent',
  'PlasmaHawk',
  'NovaPanther',
  'MysticOwl',
  'CrystalShark',
  'ThunderBison',
  'FrostLynx',
  'ShadowRaven',
  'VoltageEagle'
]

/**
 * Props for individual NFT display items in the showcase carousel.
 */
interface NFTItemProps {
  img: string
  number?: number
  price?: number
  passRef: React.RefObject<HTMLDivElement | null>
}

const NFTItem = ({
  img,
  number = Math.floor(Math.random() * 900) + 100,
  price = Math.random() * 9.9,
  passRef
}: NFTItemProps) => {
  const nftName = NFT_NAMES[Math.floor(Math.random() * NFT_NAMES.length)]
  const playState = () => {
    if (passRef.current) {
      passRef.current.style.animationPlayState = 'running'
    }
  }
  const pauseState = () => {
    if (passRef.current) {
      passRef.current.style.animationPlayState = 'paused'
    }
  }
  return (
    <ImageContainer onMouseOver={pauseState} onMouseOut={playState}>
      <img src={img} alt="" />
      <Details>
        <div>
          <span>{nftName}</span>
          <h1>#{number}</h1>
        </div>
        <div>
          <span>Price</span>
          <Price>
            <FaEthereum color="white" />
            <h1>{Number(price).toFixed(1)}</h1>
          </Price>
        </div>
      </Details>
    </ImageContainer>
  )
}

/**
 * Showcase section displaying animated rows of NFT previews with hover interactions.
 * Creates infinite scrolling effect by duplicating NFT arrays and supports animation pause on hover.
 */
export const Showcase = () => {
  const upRowRef = useRef<HTMLDivElement>(null)
  const downRowRef = useRef<HTMLDivElement>(null)
  const imageWidth = 15 * 16 + 2 * 16
  const minImages = Math.ceil(window.innerWidth / imageWidth)
  const repeatCount = Math.ceil(minImages / NFT_IMAGES.length)
  const content = Array(repeatCount * 2)
    .fill(NFT_IMAGES)
    .flat()
  return (
    <Section id="showcase">
      <Row direction="none" ref={upRowRef}>
        {content.map((img, index) => (
          <NFTItem key={index} img={img} passRef={upRowRef} />
        ))}
      </Row>
      <Row direction="reverse" ref={downRowRef}>
        {content.map((img, index) => (
          <NFTItem key={index} img={img} passRef={downRowRef} />
        ))}
      </Row>
      <Row direction="none" ref={upRowRef}>
        {content.map((img, index) => (
          <NFTItem key={index} img={img} passRef={upRowRef} />
        ))}
      </Row>
    </Section>
  )
}
