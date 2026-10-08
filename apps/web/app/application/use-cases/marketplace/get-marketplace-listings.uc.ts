import type { IIPFSRepository } from '@core/interfaces/ipfs.repository.interface'
import type { IMarketplaceRepository, ListingWithNFT } from '@core/interfaces/marketplace.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync, fromPromise, isSuccess } from '@core/interfaces/result.type'
import type { Uri } from '@core/value-objects/uri.vo'

export type { ListingWithNFT }

/**
 * Use case for fetching all active marketplace listings.
 *
 * Retrieves all listings from the blockchain and enriches them
 * with NFT metadata from IPFS for display in the marketplace UI.
 */
export class GetMarketplaceListingsUseCase {
  constructor(
    private readonly marketplaceRepository: IMarketplaceRepository,
    private readonly ipfsRepository: IIPFSRepository
  ) {}
  async execute(): Promise<Result<ListingWithNFT[]>> {
    return executeAsync(async () => {
      const listingsWithNFT = await this.marketplaceRepository.getAllActiveListingsWithNFTData()
      if (listingsWithNFT.length === 0) {
        return []
      }
      const enrichedListings = await this.enrichWithMetadata(listingsWithNFT)
      return enrichedListings
    })
  }
  private async enrichWithMetadata(listings: ListingWithNFT[]): Promise<ListingWithNFT[]> {
    return Promise.all(
      listings.map(async (item): Promise<ListingWithNFT> => {
        if (item.nft.hasMetadata()) {
          return item
        }
        const metadataResult = await fromPromise(this.ipfsRepository.fetchMetadata(item.nft.tokenURI as Uri))
        if (!isSuccess(metadataResult)) {
          return item
        }
        const metadata = metadataResult.value
        const imagePath = metadata.image_path.startsWith('ipfs://')
          ? this.ipfsRepository.toGatewayUrl({ value: metadata.image_path } as Uri)
          : metadata.image_path
        const enrichedNFT = item.nft.withMetadata({
          uid: metadata.uid,
          name: metadata.name || '',
          description: metadata.description || '',
          item_type: metadata.item_type || 'Item',
          rarity: metadata.rarity || 'Common',
          image_path: imagePath,
          attributes: metadata.attributes || []
        })
        return { ...item, nft: enrichedNFT }
      })
    )
  }
}
