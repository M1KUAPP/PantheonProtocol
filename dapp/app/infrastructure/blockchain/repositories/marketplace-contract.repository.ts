import { Listing, ListingStatus } from '@core/entities/listing.entity'
import { NFT } from '@core/entities/nft.entity'
import { ContractError, NotFoundError, UserRejectedError } from '@core/errors/domain-error'
import { isUserRejectedError } from '@core/errors/error-helpers'
import type { IMarketplaceRepository, ListingWithNFT } from '@core/interfaces/marketplace.repository.interface'
import type { Address } from '@core/value-objects/address.vo'
import { Address as AddressClass } from '@core/value-objects/address.vo'
import { AssetId as AssetIdClass } from '@core/value-objects/asset-id.vo'
import type { ListingId } from '@core/value-objects/listing-id.vo'
import { ListingId as ListingIdClass } from '@core/value-objects/listing-id.vo'
import type { TokenId } from '@core/value-objects/token-id.vo'
import { TokenId as TokenIdClass } from '@core/value-objects/token-id.vo'
import { Uri as UriClass } from '@core/value-objects/uri.vo'
import type { WeiAmount } from '@core/value-objects/wei-amount.vo'
import { MARKETPLACE_ABI } from '@infrastructure/blockchain/contracts/abis'
import { extractListingId } from '@infrastructure/blockchain/utils/event-parser'
import type { Config } from '@wagmi/core'
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'

/**
 * Raw listing data structure returned from the marketplace contract.
 */
interface ListingDataStruct {
  listingId: bigint
  tokenId: bigint
  seller: string
  price: bigint
  active: boolean
}

/**
 * Extended listing data structure that includes associated NFT metadata.
 */
interface ListingWithNFTDataStruct {
  listingId: bigint
  tokenId: bigint
  seller: string
  price: bigint
  active: boolean
  nftOwner: string
  tokenURI: string
  assetId: bigint
  nftExists: boolean
}

/**
 * Implementation of IMarketplaceRepository using the Marketplace smart contract.
 *
 * Handles NFT marketplace operations including creating listings, buying NFTs,
 * cancelling listings, and querying active marketplace data from the blockchain.
 */
export class MarketplaceContractRepository implements IMarketplaceRepository {
  private readonly contractAddress: `0x${string}`
  private readonly config: Config
  constructor(contractAddress: `0x${string}`, config: Config) {
    this.contractAddress = contractAddress
    this.config = config
  }
  async createListing(params: {
    tokenId: TokenId
    price: WeiAmount
    seller: Address
  }): Promise<{ listingId: ListingId; hash: `0x${string}` }> {
    try {
      const hash = await writeContract(this.config, {
        address: this.contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'list',
        args: [BigInt(params.tokenId.value), BigInt(params.price.value)]
      })
      const receipt = await waitForTransactionReceipt(this.config, { hash })
      if (receipt.status !== 'success') {
        throw new ContractError('Listing creation transaction failed')
      }
      const extractedListingId = extractListingId(receipt.logs, MARKETPLACE_ABI)
      if (extractedListingId === null) {
        throw new ContractError('Failed to get listing ID from transaction receipt')
      }
      const listingId = ListingIdClass.create(Number(extractedListingId))
      return { listingId, hash }
    } catch (error) {
      if (isUserRejectedError(error)) {
        throw new UserRejectedError()
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to create listing')
    }
  }
  async buyListing(params: {
    listingId: ListingId
    buyer: Address
    price: WeiAmount
  }): Promise<{ hash: `0x${string}` }> {
    try {
      const hash = await writeContract(this.config, {
        address: this.contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'buy',
        args: [BigInt(params.listingId.value)],
        value: BigInt(params.price.value)
      })
      const receipt = await waitForTransactionReceipt(this.config, { hash })
      if (receipt.status !== 'success') {
        throw new ContractError('Buy transaction failed')
      }
      return { hash }
    } catch (error) {
      if (isUserRejectedError(error)) {
        throw new UserRejectedError()
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to buy listing')
    }
  }
  async cancelListing(params: { listingId: ListingId; seller: Address }): Promise<{ hash: `0x${string}` }> {
    try {
      const hash = await writeContract(this.config, {
        address: this.contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'cancel',
        args: [BigInt(params.listingId.value)]
      })
      const receipt = await waitForTransactionReceipt(this.config, { hash })
      if (receipt.status !== 'success') {
        throw new ContractError('Cancel listing transaction failed')
      }
      return { hash }
    } catch (error) {
      if (isUserRejectedError(error)) {
        throw new UserRejectedError()
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to cancel listing')
    }
  }
  async getById(listingId: ListingId): Promise<Listing> {
    try {
      const data = await readContract(this.config, {
        address: this.contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'listings',
        args: [BigInt(listingId.value)]
      })
      if (!data || !Array.isArray(data)) {
        throw new NotFoundError('Listing not found')
      }
      const [id, tokenId, seller, priceWei, active] = data
      if (!active) {
        throw new NotFoundError('Listing is not active')
      }
      const listing = Listing.fromPrimitives({
        listingId: Number(id),
        tokenId: Number(tokenId),
        seller: seller as string,
        priceWei: priceWei as bigint,
        status: (active as boolean) ? ListingStatus.Active : ListingStatus.Cancelled
      })
      return listing
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get listing')
    }
  }
  async isListed(tokenId: TokenId): Promise<boolean> {
    try {
      const isListed = await readContract(this.config, {
        address: this.contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'isTokenListed',
        args: [BigInt(tokenId.value)]
      })
      return isListed as boolean
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to check if token is listed')
    }
  }
  async getActiveListingCount(): Promise<number> {
    try {
      const count = await readContract(this.config, {
        address: this.contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'listingCount'
      })
      return Number(count)
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get active listing count')
    }
  }
  async getUserListingsWithNFTData(seller: Address): Promise<ListingWithNFT[]> {
    try {
      const listingsData = await readContract(this.config, {
        address: this.contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'getUserListingsWithNFTData',
        args: [seller.value as `0x${string}`]
      })
      const listingDataArray = listingsData as unknown as ListingWithNFTDataStruct[]
      return listingDataArray.map((data) => this.mapListingWithNFTDataToEntities(data))
    } catch (error) {
      throw new ContractError(error instanceof Error ? error.message : 'Failed to get user listings with NFT data')
    }
  }
  async getAllActiveListingsWithNFTData(): Promise<ListingWithNFT[]> {
    try {
      const listingsData = await readContract(this.config, {
        address: this.contractAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'getAllActiveListingsWithNFTData'
      })
      const listingDataArray = listingsData as unknown as ListingWithNFTDataStruct[]
      return listingDataArray.map((data) => this.mapListingWithNFTDataToEntities(data))
    } catch (error) {
      throw new ContractError(
        error instanceof Error ? error.message : 'Failed to get all active listings with NFT data'
      )
    }
  }
  private mapListingDataToEntity(data: ListingDataStruct): Listing {
    return Listing.fromPrimitives({
      listingId: Number(data.listingId),
      tokenId: Number(data.tokenId),
      seller: data.seller,
      priceWei: data.price,
      status: data.active ? ListingStatus.Active : ListingStatus.Cancelled
    })
  }
  private mapListingWithNFTDataToEntities(data: ListingWithNFTDataStruct): ListingWithNFT {
    const listing = this.mapListingDataToEntity({
      listingId: data.listingId,
      tokenId: data.tokenId,
      seller: data.seller,
      price: data.price,
      active: data.active
    })
    const nft = NFT.create({
      tokenId: TokenIdClass.create(Number(data.tokenId)),
      owner: AddressClass.create(data.nftOwner),
      tokenURI: UriClass.create(data.tokenURI),
      assetId: AssetIdClass.create(Number(data.assetId))
    })
    return { listing, nft }
  }
}
