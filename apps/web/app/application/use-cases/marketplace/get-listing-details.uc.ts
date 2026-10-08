import type { Listing } from '@core/entities/listing.entity'
import type { NFT } from '@core/entities/nft.entity'
import type { IMarketplaceRepository } from '@core/interfaces/marketplace.repository.interface'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync, fromPromise, unwrapOr } from '@core/interfaces/result.type'
import { ListingId } from '@core/value-objects/listing-id.vo'

/**
 * Combined listing and NFT data for the detail view.
 */
interface ListingDetails {
  readonly listing: Listing
  readonly nft: NFT | null
}

/**
 * Use case for fetching details of a single marketplace listing.
 *
 * Retrieves the listing data and associated NFT information
 * for display on the listing detail page.
 */
export class GetListingDetailsUseCase {
  constructor(
    private readonly marketplaceRepository: IMarketplaceRepository,
    private readonly nftRepository: INFTRepository
  ) {}
  async execute(listingIdValue: string | number): Promise<Result<ListingDetails>> {
    return executeAsync(async () => {
      const listingId = ListingId.create(Number(listingIdValue))
      const listing = await this.marketplaceRepository.getById(listingId)
      const nftResult = await fromPromise(this.nftRepository.getById(listing.tokenId))
      const nft = unwrapOr<NFT | null, Error>(nftResult, null)
      return {
        listing,
        nft
      }
    })
  }
}
