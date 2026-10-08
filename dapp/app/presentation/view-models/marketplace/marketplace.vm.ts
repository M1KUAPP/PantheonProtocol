/**
 * Marketplace view model for browsing and purchasing NFT listings.
 *
 * Provides filtering, sorting, and purchase flow management for
 * the NFT marketplace interface.
 * @module
 */

import type { ListingDTO } from '@application/dtos/listing.dto'
import type { MarketplaceFilters } from '@application/use-cases/marketplace/filter-marketplace-listings.uc'
import { createAppConfig } from '@config/app-config'
import { UserRejectedError } from '@core/errors/domain-error'
import { useServices, useUseCases } from '@presentation/providers/app-provider'
import { useWalletState } from '@shared/hooks/use-wallet-state'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'

/** Purchase flow state machine states. */
type PurchaseState = 'idle' | 'confirming' | 'sold'

/** Currently active filter selections. */
interface ActiveFilters {
  itemType: string
  rarity: string
}

/** Return type for the marketplace view model hook. */
export interface MarketplaceViewModelReturn {
  isProperlyConnected: boolean
  listingForDetail: ListingDTO | null
  handleViewItemClick: (listing: ListingDTO) => void
  handleConfirmPurchase: () => void
  handleCloseDetailModal: () => void
  purchaseState: PurchaseState
  isPurchasePending: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  availableFilters: {
    itemTypes: string[]
    rarities: string[]
  }
  activeFilters: ActiveFilters
  handleFilterChange: (filterType: 'itemType' | 'rarity', value: string) => void
  sortOptions: { value: string; label: string }[]
  currentSortOption: string
  setCurrentSortOption: (option: string) => void
  processedListings: ListingDTO[]
}

/**
 * Hook that manages the marketplace page state.
 *
 * Handles listing display, filtering, sorting, and the NFT purchase
 * flow including wallet confirmation and transaction execution.
 * @param initialListings - The initial set of marketplace listings.
 * @param refetchListings - Callback to refresh listings after purchase.
 * @returns Marketplace state, filter controls, and purchase handlers.
 */
export function useMarketplaceViewModel(
  initialListings: ListingDTO[],
  refetchListings: () => void
): MarketplaceViewModelReturn {
  const { address: walletAddress, isConnected, chainId } = useWalletState()
  const appConfig = createAppConfig()
  const isProperlyConnected = isConnected && chainId === appConfig.getNetwork().id
  const useCases = useUseCases()
  const { notification: notificationService } = useServices()
  const [listingForDetail, setListingForDetail] = useState<ListingDTO | null>(null)
  const [currentListings, setCurrentListings] = useState(initialListings)
  const [purchaseState, setPurchaseState] = useState<PurchaseState>('idle')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ itemType: '', rarity: '' })
  const [currentSortOption, setCurrentSortOption] = useState('price-desc')
  const purchaseHandledRef = useRef(false)
  const buyNFTMutation = useMutation({
    mutationFn: ({
      listingId,
      priceInWei,
      buyerAddress,
      sellerAddress
    }: {
      listingId: number
      priceInWei: string
      buyerAddress: string
      sellerAddress: string
    }) => useCases.marketplace.buyNFT.execute({ listingId, priceInWei, buyerAddress, sellerAddress }),
    onSuccess: (result) => {
      if (result.success) {
        purchaseHandledRef.current = true
        notificationService.success('NFT purchased and added to your inventory.')
        setPurchaseState('sold')
        refetchListings()
      } else {
        if (result.error instanceof UserRejectedError) {
          notificationService.info('Transaction cancelled. No charges were made.')
          return
        }
        const errorMessage = result.error?.message || 'Failed to purchase NFT'
        notificationService.error(errorMessage)
      }
    },
    onError: (error: Error) => {
      if (error instanceof UserRejectedError) {
        notificationService.info('Transaction cancelled. No charges were made.')
        return
      }
      const errorMessage = error.message || 'Failed to purchase NFT'
      notificationService.error(errorMessage)
    }
  })
  useEffect(() => {
    setCurrentListings(initialListings)
  }, [initialListings])
  const availableFilters = useMemo(
    () => useCases.marketplace.extractMarketplaceFilters.execute(currentListings),
    [currentListings, useCases.marketplace.extractMarketplaceFilters]
  )
  const handleFilterChange = (filterType: 'itemType' | 'rarity', value: string) => {
    setActiveFilters((prev) => ({ ...prev, [filterType]: value }))
  }
  const sortOptions = useMemo(
    () => useCases.marketplace.extractMarketplaceFilters.generateSortOptions(currentListings, activeFilters.itemType),
    [currentListings, activeFilters.itemType, useCases.marketplace.extractMarketplaceFilters]
  )
  const processedListings = useMemo(() => {
    const filters: MarketplaceFilters = {
      searchTerm,
      itemType: activeFilters.itemType,
      rarity: activeFilters.rarity
    }
    const filtered = useCases.marketplace.filterMarketplaceListings.execute(currentListings, filters)
    return useCases.marketplace.sortMarketplaceListings.execute(filtered, currentSortOption)
  }, [
    currentListings,
    searchTerm,
    activeFilters,
    currentSortOption,
    useCases.marketplace.filterMarketplaceListings,
    useCases.marketplace.sortMarketplaceListings
  ])
  const handleViewItemClick = (listing: ListingDTO) => {
    purchaseHandledRef.current = false
    setPurchaseState('idle')
    setListingForDetail(listing)
  }
  const handleConfirmPurchase = () => {
    if (!isProperlyConnected) {
      notificationService.error('Please connect your wallet to purchase an NFT.')
      return
    }
    if (!listingForDetail || !walletAddress) return
    if (purchaseState === 'idle') {
      setPurchaseState('confirming')
    } else if (purchaseState === 'confirming') {
      buyNFTMutation.mutate({
        listingId: listingForDetail.listingId.value,
        priceInWei: listingForDetail.priceWei,
        buyerAddress: walletAddress,
        sellerAddress: listingForDetail.seller.value
      })
    }
  }
  const handleCloseDetailModal = () => {
    if (purchaseState === 'sold' && listingForDetail) {
      setCurrentListings((prev) => prev.filter((l) => l.listingId !== listingForDetail.listingId))
    }
    setListingForDetail(null)
  }
  return {
    isProperlyConnected,
    listingForDetail,
    handleViewItemClick,
    handleConfirmPurchase,
    handleCloseDetailModal,
    purchaseState,
    isPurchasePending: buyNFTMutation.isPending,
    searchTerm,
    setSearchTerm,
    availableFilters,
    activeFilters,
    handleFilterChange,
    sortOptions,
    currentSortOption,
    setCurrentSortOption,
    processedListings
  }
}
