import { UnauthorizedError } from '@core/errors/domain-error'
import type { IMarketplaceRepository } from '@core/interfaces/marketplace.repository.interface'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync, fromPromise, isSuccess } from '@core/interfaces/result.type'
import type { IWalletRepository } from '@core/interfaces/wallet.repository.interface'
import { Address } from '@core/value-objects/address.vo'
import type { WeiAmount } from '@core/value-objects/wei-amount.vo'

/**
 * Aggregated wallet statistics for the dashboard.
 */
interface WalletStats {
  readonly address: string
  readonly balance: WeiAmount
  readonly nftCount: number
  readonly activeListingsCount: number
  readonly isConnected: boolean
}

/**
 * Use case for fetching aggregated wallet statistics.
 *
 * Collects and combines data from multiple sources including wallet balance,
 * NFT inventory count, and active marketplace listings to provide a
 * dashboard overview.
 */
export class GetWalletStatsUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly nftRepository: INFTRepository,
    private readonly marketplaceRepository: IMarketplaceRepository
  ) {}
  async execute(addressValue?: string): Promise<Result<WalletStats>> {
    return executeAsync(async () => {
      let address: Address
      let isConnected = false
      if (addressValue) {
        address = Address.create(addressValue)
      } else {
        const wallet = await this.walletRepository.getCurrent()
        if (!wallet.address) {
          throw new UnauthorizedError('No wallet connected')
        }
        address = wallet.address
        isConnected = wallet.isConnected()
      }
      const balance = await this.walletRepository.getBalance(address)
      const nftsResult = await fromPromise(this.nftRepository.getUserInventory(address))
      const nftCount = isSuccess(nftsResult) ? nftsResult.value.length : 0
      const listingsResult = await fromPromise(this.marketplaceRepository.getUserListingsWithNFTData(address))
      const activeListingsCount = isSuccess(listingsResult) ? listingsResult.value.length : 0
      return {
        address: address.toString(),
        balance,
        nftCount,
        activeListingsCount,
        isConnected
      }
    })
  }
}
