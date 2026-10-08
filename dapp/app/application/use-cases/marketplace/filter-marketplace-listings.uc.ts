import type { ListingDTO } from '@application/dtos/listing.dto'

/**
 * Filter criteria for marketplace listings.
 */
export interface MarketplaceFilters {
  searchTerm?: string
  itemType?: string
  rarity?: string
}

/**
 * Use case for filtering marketplace listings by various criteria.
 *
 * Applies search term, item type, and rarity filters to a list of
 * listings, returning only those that match all specified criteria.
 */
export class FilterMarketplaceListingsUseCase {
  execute(listings: ListingDTO[], filters: MarketplaceFilters): ListingDTO[] {
    let result = [...listings]
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase()
      result = result.filter((listing) => listing.metadata.name.toLowerCase().includes(searchLower))
    }
    if (filters.itemType && filters.itemType.trim()) {
      result = result.filter((listing) => listing.metadata.itemType === filters.itemType)
    }
    if (filters.rarity && filters.rarity.trim()) {
      result = result.filter((listing) => listing.metadata.rarity === filters.rarity)
    }
    return result
  }
}
