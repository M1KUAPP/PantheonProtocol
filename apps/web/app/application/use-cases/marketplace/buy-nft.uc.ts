import { UnauthorizedError } from '@core/errors/domain-error'
import type { IMarketplaceRepository } from '@core/interfaces/marketplace.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import { Address } from '@core/value-objects/address.vo'
import { ListingId } from '@core/value-objects/listing-id.vo'
import { WeiAmount } from '@core/value-objects/wei-amount.vo'

/**
 * Parameters for purchasing an NFT from the marketplace.
 */
interface BuyNFTParams {
  readonly listingId: string | number
  readonly buyerAddress: string
  readonly priceInWei: string
  readonly sellerAddress: string
}

/**
 * Result of a successful NFT purchase.
 */
interface BuyNFTResult {
  readonly transactionHash: `0x${string}`
  readonly listingId: ListingId
}

/**
 * Use case for purchasing an NFT from the marketplace.
 *
 * Validates that the buyer is not the seller, then executes
 * the purchase transaction which transfers ETH to the seller
 * and the NFT to the buyer.
 */
export class BuyNFTUseCase {
  constructor(private readonly marketplaceRepository: IMarketplaceRepository) {}
  async execute(params: BuyNFTParams): Promise<Result<BuyNFTResult>> {
    return executeAsync(async () => {
      const listingId = ListingId.create(Number(params.listingId))
      const buyer = Address.create(params.buyerAddress)
      const seller = Address.create(params.sellerAddress)
      const price = WeiAmount.fromString(params.priceInWei)
      if (seller.equals(buyer)) {
        throw new UnauthorizedError('Buyer cannot be the seller')
      }
      const buyResult = await this.marketplaceRepository.buyListing({
        listingId,
        buyer,
        price
      })
      return {
        transactionHash: buyResult.hash,
        listingId
      }
    })
  }
}
