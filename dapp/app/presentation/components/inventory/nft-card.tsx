/**
 * @module NFTCard
 * Individual NFT card component for inventory display.
 * Combines image, info, and action sections with modal detail view.
 */

import type { NFTMetadata } from '@core/entities/nft.entity'
import { NFTActionsSection } from '@presentation/components/inventory/nft-actions-section'
import { Card, CardContent } from '@presentation/components/inventory/nft-card.styles'
import { NFTDetailModal } from '@presentation/components/inventory/nft-detail-modal'
import { NFTImageSection } from '@presentation/components/inventory/nft-image-section'
import { NFTInfoSection } from '@presentation/components/inventory/nft-info-section'
import { useNFTCardViewModel } from '@presentation/view-models/nft/nft-card.vm'
import { useState } from 'react'

/**
 * Props for NFTCard component.
 * Contains all NFT data and callbacks required for display and interaction.
 */
interface NFTCardProps {
  tokenId: number
  name: string
  imageUrl?: string
  assetId?: number
  owner: string
  listingId?: number
  listingPrice?: bigint
  formattedListingPrice?: string
  isLocked?: boolean
  metadata?: NFTMetadata
  onActionComplete?: () => void
}

/**
 * Displays an NFT card with image, information, and available actions.
 * Clicking the card opens a detailed modal view with full metadata.
 */
export const InventoryNFTCard = ({
  tokenId,
  name,
  imageUrl,
  assetId,
  listingId,
  formattedListingPrice,
  isLocked,
  metadata,
  onActionComplete
}: NFTCardProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const {
    showListInput,
    priceInput,
    isPending,
    hasListing,
    handleExport,
    handleList,
    handleCancel,
    setShowListInput,
    setPriceInput
  } = useNFTCardViewModel({ tokenId, listingId, metadata, onActionComplete })
  const handleCardClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.card-clickable-area')) {
      setShowDetailModal(true)
    }
  }
  return (
    <>
      <Card onClick={handleCardClick}>
        <NFTImageSection imageUrl={imageUrl} name={name} isLocked={isLocked} hasListing={hasListing} />
        <CardContent className="card-clickable-area">
          <NFTInfoSection
            name={name}
            tokenId={tokenId}
            assetId={assetId}
            formattedListingPrice={formattedListingPrice}
            isLocked={isLocked}
          />
          {!isLocked && (
            <NFTActionsSection
              hasListing={hasListing}
              showListInput={showListInput}
              priceInput={priceInput}
              isPending={isPending}
              listingId={listingId}
              onExport={handleExport}
              onList={handleList}
              onCancel={handleCancel}
              onShowListInput={setShowListInput}
              onPriceInputChange={setPriceInput}
            />
          )}
        </CardContent>
      </Card>
      {showDetailModal && (
        <NFTDetailModal
          name={name}
          imageUrl={imageUrl}
          metadata={metadata}
          isLocked={isLocked}
          formattedListingPrice={formattedListingPrice}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  )
}
