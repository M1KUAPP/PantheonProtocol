import type { NFTMetadata } from '@core/entities/nft.entity'
import type { IExportManagerRepository } from '@core/interfaces/export-manager.repository.interface'
import type { IIPFSRepository } from '@core/interfaces/ipfs.repository.interface'
import type { IMarketplaceRepository } from '@core/interfaces/marketplace.repository.interface'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync, fromPromise, isSuccess } from '@core/interfaces/result.type'
import { Address } from '@core/value-objects/address.vo'
import { IpfsCid } from '@core/value-objects/ipfs-cid.vo'

/**
 * Display-ready NFT item for the inventory view.
 */
interface InventoryNFTItem {
  tokenId: number
  name: string
  description: string
  imageUrl: string
  tokenURI: string
  assetId?: number
  owner: string
  isListed: boolean
  listingId?: number
  listingPrice?: bigint
  formattedListingPrice?: string
  isLocked: boolean
  metadata?: NFTMetadata
}

/**
 * Summary statistics for user's NFT inventory.
 */
interface InventoryStats {
  total: number
  exported: number
  listed: number
}

/**
 * Complete inventory data including items and statistics.
 */
interface GetUserInventoryResult {
  inventory: InventoryNFTItem[]
  stats: InventoryStats
}

/**
 * Use case for fetching a user's complete NFT inventory.
 *
 * Aggregates data from multiple sources: owned NFTs from the blockchain,
 * active marketplace listings, export counts, and IPFS metadata.
 * Returns a unified view of all user's NFTs with their current status.
 */
export class GetUserInventoryUseCase {
  constructor(
    private readonly nftRepository: INFTRepository,
    private readonly marketplaceRepository: IMarketplaceRepository,
    private readonly exportManagerRepository: IExportManagerRepository,
    private readonly ipfsRepository: IIPFSRepository
  ) {}
  async execute(userAddress: string): Promise<Result<GetUserInventoryResult>> {
    return executeAsync(async () => {
      const address = Address.create(userAddress)
      const ownedNfts = await this.nftRepository.getUserInventory(address)
      const userListingsWithNFT = await this.marketplaceRepository.getUserListingsWithNFTData(address)
      const userListings = userListingsWithNFT.map((item) => item.listing)
      const listedNfts = userListingsWithNFT.map((item) => item.nft)
      const allNfts = [...ownedNfts]
      const ownedTokenIds = new Set(ownedNfts.map((nft) => nft.tokenId.value))
      for (const listedNft of listedNfts) {
        if (!ownedTokenIds.has(listedNft.tokenId.value)) {
          allNfts.push(listedNft)
        }
      }
      const exportedCount = await this.exportManagerRepository.getUserExportCount(address)
      if (allNfts.length === 0) {
        return {
          inventory: [],
          stats: { total: 0, listed: 0, exported: exportedCount }
        }
      }
      const listingMap = new Map<number, (typeof userListings)[0]>()
      for (const listing of userListings) {
        listingMap.set(listing.tokenId.value, listing)
      }
      const inventoryItems: InventoryNFTItem[] = []
      for (const nft of allNfts) {
        const tokenIdValue = nft.tokenId.value
        const listing = listingMap.get(tokenIdValue)
        const isListed = listing !== null && listing !== undefined && listing.isActive()
        const inventoryItem: InventoryNFTItem = {
          tokenId: nft.tokenId.value,
          name: nft.metadata?.name || `NFT #${nft.tokenId.value}`,
          description: nft.metadata?.description || '',
          imageUrl: nft.metadata?.image_path || '',
          tokenURI: nft.tokenURI.value,
          assetId: nft.metadata?.uid,
          owner: address.value,
          isListed,
          listingId: listing ? listing.listingId.value : undefined,
          listingPrice: listing ? listing.price.value : undefined,
          formattedListingPrice: listing ? listing.getFormattedPrice() : undefined,
          isLocked: false,
          metadata: nft.metadata
        }
        inventoryItems.push(inventoryItem)
      }
      const itemsWithMetadata = await this.fetchMetadataInParallel(inventoryItems)
      const stats: InventoryStats = {
        total: itemsWithMetadata.length,
        exported: exportedCount,
        listed: itemsWithMetadata.filter((item) => item.isListed).length
      }
      return { inventory: itemsWithMetadata, stats }
    })
  }
  private async fetchMetadataInParallel(items: InventoryNFTItem[]): Promise<InventoryNFTItem[]> {
    const metadataPromises = items.map(async (item) => {
      if (item.metadata) {
        return item
      }
      const uri = item.tokenURI
      const cidMatch = uri.match(/ipfs:\/\/(.+)/) || uri.match(/\/ipfs\/(.+)/)
      if (!cidMatch || !cidMatch[1]) {
        return item
      }
      const cid = IpfsCid.create(cidMatch[1])
      const metadataResult = await fromPromise(this.ipfsRepository.getMetadata(cid))
      if (isSuccess(metadataResult) && metadataResult.value) {
        const metadata = metadataResult.value
        return {
          ...item,
          name: metadata.name || item.name,
          description: metadata.description || item.description,
          imageUrl: metadata.image_path || item.imageUrl,
          assetId: metadata.uid || item.assetId,
          metadata
        }
      }
      return item
    })
    return Promise.all(metadataPromises)
  }
}
