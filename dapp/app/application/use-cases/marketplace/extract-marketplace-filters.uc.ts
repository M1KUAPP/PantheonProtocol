import type { ListingDTO } from '@application/dtos/listing.dto'
import { RARITY_ORDER } from '@application/use-cases/marketplace/constants'

/**
 * Available filter options extracted from current listings.
 */
export interface AvailableFilters {
  itemTypes: string[]
  rarities: string[]
}

/**
 * A single sort option for the UI dropdown.
 */
interface SortOptionItem {
  value: string
  label: string
}

/**
 * Use case for extracting available filter and sort options from listings.
 *
 * Analyzes the current set of listings to determine what item types,
 * rarities, and sortable numeric attributes are available for filtering.
 */
export class ExtractMarketplaceFiltersUseCase {
  execute(listings: ListingDTO[]): AvailableFilters {
    const itemTypes = new Set<string>()
    const rarities = new Set<string>()
    listings.forEach((listing) => {
      itemTypes.add(listing.metadata.itemType)
      rarities.add(listing.metadata.rarity)
    })
    return {
      itemTypes: Array.from(itemTypes),
      rarities: Array.from(rarities).sort((a, b) => (RARITY_ORDER[b] ?? 0) - (RARITY_ORDER[a] ?? 0))
    }
  }
  generateSortOptions(listings: ListingDTO[], activeItemType: string): SortOptionItem[] {
    const defaultOptions: SortOptionItem[] = [
      { value: 'price-desc', label: 'Sort by: Price High-Low' },
      { value: 'price-asc', label: 'Sort by: Price Low-High' },
      { value: 'rarity', label: 'Sort by: Rarity' }
    ]
    if (activeItemType) {
      const numericSubtraits = new Set<string>()
      listings.forEach((listing) => {
        if (listing.metadata.itemType === activeItemType) {
          listing.metadata.attributes.forEach((attr) => {
            if (typeof attr.value === 'number') {
              numericSubtraits.add(attr.trait_type)
            }
          })
        }
      })
      numericSubtraits.forEach((trait) => {
        defaultOptions.push({ value: `subtrait-${trait}`, label: `Sort by: ${trait}` })
      })
    }
    return defaultOptions
  }
}
