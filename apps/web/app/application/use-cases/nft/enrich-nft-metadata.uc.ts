import type { NFT } from '@core/entities/nft.entity'
import type { IIPFSRepository } from '@core/interfaces/ipfs.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import type { Uri } from '@core/value-objects/uri.vo'

/**
 * Simplified NFT data for display purposes after metadata enrichment.
 */
export interface EnrichedNFTDisplayItem {
  tokenId: number
  name: string
  imageUrl: string
}

/**
 * Use case for enriching NFT entities with metadata from IPFS.
 *
 * Fetches metadata from the NFT's tokenURI and transforms IPFS URLs
 * into gateway URLs for display in the UI.
 */
export class EnrichNFTMetadataUseCase {
  constructor(private ipfsRepository: IIPFSRepository) {}
  async execute(nft: NFT): Promise<Result<EnrichedNFTDisplayItem>> {
    return executeAsync(async () => {
      const metadata = await this.ipfsRepository.fetchMetadata(nft.tokenURI as Uri)
      const imageUrl = metadata.image_path.startsWith('ipfs://')
        ? this.ipfsRepository.toGatewayUrl({ value: metadata.image_path } as Uri)
        : metadata.image_path
      return {
        tokenId: nft.tokenId.value,
        name: metadata.name,
        imageUrl
      }
    })
  }
  async executeMany(nfts: NFT[]): Promise<Result<EnrichedNFTDisplayItem[]>> {
    return executeAsync(async () => {
      const results = await Promise.all(nfts.map((nft) => this.execute(nft)))
      const enrichedItems: EnrichedNFTDisplayItem[] = []
      for (const result of results) {
        if (result.success) {
          enrichedItems.push(result.value)
        }
      }
      return enrichedItems
    })
  }
}
