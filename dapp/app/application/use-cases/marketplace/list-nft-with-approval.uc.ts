import { WEI_PER_ETHER } from '@core/constants/blockchain.constants'
import type { IMarketplaceRepository } from '@core/interfaces/marketplace.repository.interface'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import { Address } from '@core/value-objects/address.vo'
import type { ListingId } from '@core/value-objects/listing-id.vo'
import { TokenId } from '@core/value-objects/token-id.vo'
import { WeiAmount } from '@core/value-objects/wei-amount.vo'

/**
 * Parameters for listing an NFT on the marketplace.
 */
interface ListNFTWithApprovalParams {
  readonly tokenId: number
  readonly priceInEther: string
  readonly seller: string
  readonly marketplaceAddress: string
}

/**
 * Result of a successful NFT listing operation.
 */
interface ListNFTWithApprovalResult {
  readonly listingId: ListingId
  readonly transactionHash: `0x${string}`
  readonly approvalHash?: `0x${string}`
}

/**
 * Use case for listing an NFT on the marketplace with automatic approval.
 *
 * Handles the full listing flow: approving the marketplace contract
 * to transfer the NFT (if not already approved), then creating the
 * listing at the specified price.
 */
export class ListNFTWithApprovalUseCase {
  constructor(
    private readonly nftRepository: INFTRepository,
    private readonly marketplaceRepository: IMarketplaceRepository
  ) {}
  async execute(params: ListNFTWithApprovalParams): Promise<Result<ListNFTWithApprovalResult>> {
    return executeAsync(async () => {
      const tokenId = TokenId.create(params.tokenId)
      const seller = Address.create(params.seller)
      const marketplaceAddress = Address.create(params.marketplaceAddress)
      const priceInWei = BigInt(Math.floor(parseFloat(params.priceInEther) * WEI_PER_ETHER))
      const price = WeiAmount.create(priceInWei)
      const approvedAddress = await this.nftRepository.getApproved(tokenId)
      let approvalHash: `0x${string}` | undefined
      if (!approvedAddress || !approvedAddress.equals(marketplaceAddress)) {
        const approveResult = await this.nftRepository.approve({
          to: marketplaceAddress,
          tokenId
        })
        approvalHash = approveResult.hash
      }
      const listResult = await this.marketplaceRepository.createListing({
        tokenId,
        price,
        seller
      })
      return {
        listingId: listResult.listingId,
        transactionHash: listResult.hash,
        approvalHash
      }
    })
  }
}
