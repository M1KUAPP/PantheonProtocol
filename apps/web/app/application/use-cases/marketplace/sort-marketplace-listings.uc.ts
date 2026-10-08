import type { ListingDTO } from '@application/dtos/listing.dto'
import { RARITY_ORDER } from '@application/use-cases/marketplace/constants'

/** Available sort options for marketplace listings */
type SortOption = 'price-asc' | 'price-desc' | 'rarity' | string

/**
 * Use case for sorting marketplace listings.
 *
 * Supports sorting by price (ascending/descending), rarity,
 * and dynamic numeric NFT attributes (subtraits).
 */
export class SortMarketplaceListingsUseCase {
  execute(listings: ListingDTO[], sortOption: SortOption): ListingDTO[] {
    const result = [...listings]
    switch (sortOption) {
      case 'price-asc':
        return this.sortByPriceAscending(result)
      case 'price-desc':
        return this.sortByPriceDescending(result)
      case 'rarity':
        return this.sortByRarity(result)
      default:
        if (sortOption.startsWith('subtrait-')) {
          const trait = sortOption.replace('subtrait-', '')
          return this.sortBySubtrait(result, trait)
        }
        return result
    }
  }
  private sortByPriceAscending(listings: ListingDTO[]): ListingDTO[] {
    return listings.sort((a, b) => Number(BigInt(a.priceWei) - BigInt(b.priceWei)))
  }
  private sortByPriceDescending(listings: ListingDTO[]): ListingDTO[] {
    return listings.sort((a, b) => Number(BigInt(b.priceWei) - BigInt(a.priceWei)))
  }
  private sortByRarity(listings: ListingDTO[]): ListingDTO[] {
    return listings.sort((a, b) => (RARITY_ORDER[b.metadata.rarity] ?? 0) - (RARITY_ORDER[a.metadata.rarity] ?? 0))
  }
  private sortBySubtrait(listings: ListingDTO[], trait: string): ListingDTO[] {
    return listings.sort((a, b) => {
      const aValue = a.metadata.attributes.find((attr) => attr.trait_type === trait)?.value ?? 0
      const bValue = b.metadata.attributes.find((attr) => attr.trait_type === trait)?.value ?? 0
      return (bValue as number) - (aValue as number)
    })
  }
}
