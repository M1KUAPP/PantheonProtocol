/**
 * @module marketplace-grid
 * Grid layout component that displays marketplace listings as cards.
 * Renders a responsive grid of NFT cards for browsing available listings.
 */

import type { ListingDTO } from '@application/dtos/listing.dto'
import { GridWrapper } from '@presentation/components/marketplace/marketplace-grid.styles'
import { MarketplaceNFTCard } from '@presentation/components/marketplace/nft-card'

/**
 * Props for the MarketplaceGrid component.
 * Handles display of multiple listings in a grid layout.
 */
interface MarketplaceGridProps {
  listings: ListingDTO[]
  onViewItemClick: (listing: ListingDTO) => void
}

/**
 * Grid component that displays marketplace listings as NFT cards.
 * Provides a responsive layout for browsing available items.
 */
export const MarketplaceGrid = ({ listings, onViewItemClick }: MarketplaceGridProps) => {
  return (
    <GridWrapper>
      {listings.map((listing) => (
        <MarketplaceNFTCard key={listing.listingId.value} listing={listing} onViewItemClick={onViewItemClick} />
      ))}
    </GridWrapper>
  )
}
