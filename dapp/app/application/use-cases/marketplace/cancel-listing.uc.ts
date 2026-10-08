import type { IMarketplaceRepository } from '@core/interfaces/marketplace.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import { Address } from '@core/value-objects/address.vo'
import { ListingId } from '@core/value-objects/listing-id.vo'

/**
 * Parameters for cancelling a marketplace listing.
 */
interface CancelListingParams {
  readonly listingId: string | number
  readonly sellerAddress: string
}

/**
 * Result of a successful listing cancellation.
 */
interface CancelListingResult {
  readonly transactionHash: `0x${string}`
  readonly listingId: ListingId
}

/**
 * Use case for cancelling an active marketplace listing.
 *
 * Allows a seller to remove their NFT from the marketplace,
 * making it available for other operations like export or re-listing.
 */
export class CancelListingUseCase {
  constructor(private readonly marketplaceRepository: IMarketplaceRepository) {}
  async execute(params: CancelListingParams): Promise<Result<CancelListingResult>> {
    return executeAsync(async () => {
      const listingId = ListingId.create(Number(params.listingId))
      const seller = Address.create(params.sellerAddress)
      const cancelResult = await this.marketplaceRepository.cancelListing({
        listingId,
        seller
      })
      return {
        transactionHash: cancelResult.hash,
        listingId
      }
    })
  }
}
