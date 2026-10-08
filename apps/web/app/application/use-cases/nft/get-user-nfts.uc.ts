import type { NFT } from '@core/entities/nft.entity'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import { Address } from '@core/value-objects/address.vo'

/**
 * Use case for fetching all NFTs owned by a user.
 *
 * Retrieves the user's NFT inventory directly from the blockchain
 * via the NFT contract's getUserInventory method.
 */
export class GetUserNFTsUseCase {
  constructor(private readonly nftRepository: INFTRepository) {}
  async execute(ownerAddress: string): Promise<Result<NFT[]>> {
    return executeAsync(async () => {
      const owner = Address.create(ownerAddress)
      const nfts = await this.nftRepository.getUserInventory(owner)
      return nfts
    })
  }
}
