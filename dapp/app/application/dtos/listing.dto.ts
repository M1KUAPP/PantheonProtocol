import type { NFTAttribute } from '@core/entities/nft.entity'
import type { Address } from '@core/value-objects/address.vo'
import type { ListingId } from '@core/value-objects/listing-id.vo'
import type { TokenId } from '@core/value-objects/token-id.vo'

/**
 * Data Transfer Object for marketplace listings.
 *
 * Combines listing information with NFT metadata for display purposes.
 * Used to transfer listing data between application and presentation layers.
 */
export interface ListingDTO {
  readonly listingId: ListingId
  readonly tokenId: TokenId
  readonly seller: Address
  readonly priceWei: string
  readonly formattedPrice: string
  readonly metadata: {
    readonly name: string
    readonly image_path: string
    readonly description?: string
    readonly itemType: string
    readonly rarity: string
    readonly attributes: readonly NFTAttribute[]
  }
}
