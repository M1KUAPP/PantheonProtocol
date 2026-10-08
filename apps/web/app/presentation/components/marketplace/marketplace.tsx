/**
 * @module marketplace
 * Main marketplace page component that orchestrates listing display, filtering, and purchasing.
 * Fetches marketplace data from blockchain and provides search, filter, and detail view functionality.
 */

import type { ListingDTO } from '@application/dtos/listing.dto'
import type { ListingWithNFT } from '@application/use-cases/marketplace/get-marketplace-listings.uc'
import { isSuccess } from '@core/interfaces/result.type'
import { ListingDetailModal } from '@presentation/components/marketplace/listing-detail-modal'
import { MarketplaceControls } from '@presentation/components/marketplace/marketplace-controls'
import { MarketplaceFilterProvider } from '@presentation/components/marketplace/marketplace-filter.context'
import { MarketplaceGrid } from '@presentation/components/marketplace/marketplace-grid'
import {
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateTitle,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  Section
} from '@presentation/components/marketplace/marketplace.styles'
import { useMarketplaceUseCases, useServices } from '@presentation/providers/app-provider'
import { useMarketplaceViewModel } from '@presentation/view-models/marketplace/marketplace.vm'
import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Main marketplace page component.
 * Manages listing data fetching, filtering, search, and purchase interactions.
 */
export const Marketplace = () => {
  const { notification: notificationService } = useServices()
  const { getListings } = useMarketplaceUseCases()
  const [listingsWithNFT, setListingsWithNFT] = useState<ListingWithNFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await getListings.execute()
      if (isSuccess(result)) {
        setListingsWithNFT(result.value)
      } else {
        notificationService.error(result.error.message)
        setListingsWithNFT([])
      }
    } catch (err) {
      notificationService.error(err instanceof Error ? err.message : 'Failed to load marketplace listings')
      setListingsWithNFT([])
    } finally {
      setIsLoading(false)
    }
  }, [getListings])
  useEffect(() => {
    fetchListings()
  }, [fetchListings])
  const refetch = useCallback(async () => {
    await fetchListings()
  }, [fetchListings])
  const listings = useMemo(() => {
    return listingsWithNFT.map((item): ListingDTO => {
      const listing = item.listing
      const metadata = item.nft!.metadata!
      return {
        listingId: listing.listingId,
        tokenId: listing.tokenId,
        seller: listing.seller,
        priceWei: listing.price.toString(),
        formattedPrice: listing.getFormattedPrice(),
        metadata: {
          name: metadata.name,
          image_path: metadata.image_path,
          description: metadata.description,
          itemType: metadata.item_type,
          rarity: metadata.rarity,
          attributes: metadata.attributes
        }
      }
    })
  }, [listingsWithNFT])
  const {
    listingForDetail,
    handleViewItemClick,
    handleConfirmPurchase,
    handleCloseDetailModal,
    purchaseState,
    isPurchasePending,
    searchTerm,
    setSearchTerm,
    availableFilters,
    activeFilters,
    handleFilterChange,
    sortOptions,
    currentSortOption,
    setCurrentSortOption,
    processedListings
  } = useMarketplaceViewModel(listings, refetch)
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading listings from blockchain...</LoadingText>
      </LoadingContainer>
    )
  }
  return (
    <Section>
      {listings.length === 0 ? (
        <EmptyStateContainer>
          <EmptyStateIcon>🛒</EmptyStateIcon>
          <EmptyStateTitle>No Listings Available</EmptyStateTitle>
          <EmptyStateText>There are no active listings in the marketplace right now. Check back later!</EmptyStateText>
        </EmptyStateContainer>
      ) : (
        <MarketplaceFilterProvider
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          availableFilters={availableFilters}
          activeFilters={activeFilters}
          handleFilterChange={handleFilterChange}
          sortOptions={sortOptions}
          currentSortOption={currentSortOption}
          setCurrentSortOption={setCurrentSortOption}
        >
          <MarketplaceControls />
          {processedListings.length === 0 ? (
            <EmptyStateContainer>
              <EmptyStateIcon>🔍</EmptyStateIcon>
              <EmptyStateTitle>No Results Found</EmptyStateTitle>
              <EmptyStateText>
                No listings match your current filters. Try adjusting your search or filters.
              </EmptyStateText>
            </EmptyStateContainer>
          ) : (
            <MarketplaceGrid listings={processedListings} onViewItemClick={handleViewItemClick} />
          )}
        </MarketplaceFilterProvider>
      )}
      <ListingDetailModal
        listing={listingForDetail}
        purchaseState={purchaseState}
        isPurchasePending={isPurchasePending}
        onConfirm={handleConfirmPurchase}
        onClose={handleCloseDetailModal}
      />
    </Section>
  )
}
