/**
 * @module NFTDetailModal
 * Full-screen modal displaying complete NFT details and metadata.
 * Shows image, description, attributes, status, and listing information.
 */

import type { NFTAttribute, NFTMetadata } from '@core/entities/nft.entity'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CustomBackdrop } from '@presentation/components/common/backdrop'
import {
  CloseButton,
  Description,
  ImageColumn,
  InfoBlock,
  InfoColumn,
  InfoGrid,
  InfoLabel,
  InfoValue,
  ListingPriceContainer,
  ListingPriceValue,
  ModalBody,
  ModalContent,
  ModalHeader,
  StatusBadge,
  StatusBadgeWrapper,
  StatusContainer,
  Title
} from '@presentation/components/inventory/nft-detail-modal.styles'

/**
 * Props for NFTDetailModal component.
 * Contains NFT display data and close handler for modal interaction.
 */
interface NFTDetailModalProps {
  name: string
  imageUrl?: string
  metadata?: NFTMetadata
  isLocked?: boolean
  formattedListingPrice?: string
  onClose: () => void
}

/**
 * Renders a detailed modal view of an NFT with full metadata, attributes, and status.
 * Displays in a two-column layout with image on left and information on right.
 */
export const NFTDetailModal = ({
  name,
  imageUrl,
  metadata,
  isLocked,
  formattedListingPrice,
  onClose
}: NFTDetailModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  const getStatus = (): 'available' | 'listed' | 'locked' => {
    if (isLocked) return 'locked'
    if (formattedListingPrice) return 'listed'
    return 'available'
  }
  const status = getStatus()
  return (
    <CustomBackdrop onClick={handleBackdropClick}>
      <ModalContent>
        <ModalHeader>
          <CloseButton onClick={onClose}>
            <XMarkIcon width={24} height={24} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <ImageColumn>
            <img src={imageUrl || '/placeholder-nft.png'} alt={name} />
          </ImageColumn>
          <InfoColumn>
            <Title>{name}</Title>
            <Description>{metadata?.description || 'No description available.'}</Description>
            <InfoGrid>
              {metadata?.item_type && (
                <InfoBlock>
                  <InfoLabel>Item Type</InfoLabel>
                  <InfoValue>{metadata.item_type}</InfoValue>
                </InfoBlock>
              )}
              {metadata?.rarity && (
                <InfoBlock>
                  <InfoLabel>Rarity</InfoLabel>
                  <InfoValue>{metadata.rarity}</InfoValue>
                </InfoBlock>
              )}
              {metadata?.attributes?.map((attr: NFTAttribute) => (
                <InfoBlock key={attr.trait_type}>
                  <InfoLabel>{attr.trait_type}</InfoLabel>
                  <InfoValue>{String(attr.value)}</InfoValue>
                </InfoBlock>
              ))}
            </InfoGrid>
            <StatusContainer>
              <InfoLabel>Status</InfoLabel>
              <StatusBadgeWrapper>
                <StatusBadge $status={status}>{status}</StatusBadge>
              </StatusBadgeWrapper>
              {formattedListingPrice && (
                <ListingPriceContainer>
                  <InfoLabel>Listed Price</InfoLabel>
                  <ListingPriceValue>{formattedListingPrice} ETH</ListingPriceValue>
                </ListingPriceContainer>
              )}
            </StatusContainer>
          </InfoColumn>
        </ModalBody>
      </ModalContent>
    </CustomBackdrop>
  )
}
