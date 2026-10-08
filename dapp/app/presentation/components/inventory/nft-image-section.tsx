/**
 * @module NFTImageSection
 * NFT image display component with loading state and status badges.
 * Handles image loading transitions and displays locked/listed status indicators.
 */

import {
  NFTImage as BaseNFTImage,
  ImageContainer,
  LoadingSpinner,
  StatusBadge
} from '@presentation/components/inventory/nft-card.styles'
import { useState } from 'react'
import styled from 'styled-components'

const ConditionalNFTImage = styled(BaseNFTImage)<{ $loaded: boolean }>`
  display: ${(props) => (props.$loaded ? 'block' : 'none')};
`

/**
 * Props for NFTImageSection component.
 * Controls image display and status badge visibility for NFT cards.
 */
interface NFTImageSectionProps {
  imageUrl?: string
  name: string
  isLocked?: boolean
  hasListing: boolean
}

/**
 * Renders NFT image with loading spinner and status badges.
 * Shows locked or listed status overlays based on NFT state.
 */
export const NFTImageSection = ({ imageUrl, name, isLocked, hasListing }: NFTImageSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  return (
    <ImageContainer className="card-clickable-area">
      {!imageLoaded && <LoadingSpinner $size="sm" />}
      <ConditionalNFTImage src={imageUrl} alt={name} onLoad={() => setImageLoaded(true)} $loaded={imageLoaded} />
      {isLocked && (
        <StatusBadge $status="locked" $position="absolute">
          Locked
        </StatusBadge>
      )}
      {hasListing && !isLocked && (
        <StatusBadge $status="listed" $position="absolute">
          Listed
        </StatusBadge>
      )}
    </ImageContainer>
  )
}
