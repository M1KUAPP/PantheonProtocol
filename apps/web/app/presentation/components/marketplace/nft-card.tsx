/**
 * @module nft-card
 * Card component for displaying individual NFT listings in the marketplace grid.
 * Shows NFT image, name, token ID, price, and action buttons.
 */

import type { ListingDTO } from '@application/dtos/listing.dto'
import {
  ActionButton,
  ActionsContainer,
  Card,
  CardContent,
  ImageContainer,
  InfoLabel,
  InfoRow,
  InfoValue,
  NFTImage,
  NFTInfo,
  NFTTitle
} from '@presentation/components/inventory/nft-card.styles'

/**
 * Props for the MarketplaceNFTCard component.
 * Represents a single listing in the marketplace grid.
 */
interface NFTCardProps {
  listing: ListingDTO
  onViewItemClick: (listing: ListingDTO) => void
}

/**
 * Card component for displaying a marketplace listing.
 * Shows NFT image, name, token ID, and price with a view item action.
 */
export const MarketplaceNFTCard = ({ listing, onViewItemClick }: NFTCardProps) => {
  const handleCardClick = () => {
    onViewItemClick(listing)
  }
  return (
    <Card onClick={handleCardClick}>
      <ImageContainer>
        <NFTImage src={listing.metadata.image_path} alt={listing.metadata.name} />
      </ImageContainer>
      <CardContent>
        <NFTTitle>{listing.metadata.name}</NFTTitle>
        <NFTInfo>
          <InfoRow>
            <InfoLabel>Token ID:</InfoLabel>
            <InfoValue>#{listing.tokenId.value}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Price:</InfoLabel>
            <InfoValue>{listing.formattedPrice} ETH</InfoValue>
          </InfoRow>
        </NFTInfo>
        <ActionsContainer>
          <ActionButton onClick={handleCardClick}>View Item</ActionButton>
        </ActionsContainer>
      </CardContent>
    </Card>
  )
}
