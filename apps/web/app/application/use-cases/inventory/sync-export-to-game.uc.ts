import type { IAPIRepository } from '@core/interfaces/api.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'

/**
 * Parameters for syncing an exported NFT to the game backend.
 */
interface SyncExportToGameParams {
  uid: number
  name: string
  description: string
  item_type: string
  rarity: string
  imagePath: string
  attributes: Array<{ trait_type: string; value: string | number }>
}

/**
 * Use case for synchronizing an exported NFT to the game backend API.
 *
 * After an NFT is burned on-chain via export, this use case notifies
 * the game backend to recreate the corresponding in-game item.
 */
export class SyncExportToGameUseCase {
  constructor(private readonly apiRepository: IAPIRepository) {}
  async execute(params: SyncExportToGameParams): Promise<Result<void>> {
    return executeAsync(async () => {
      await this.apiRepository.exportNFTToGame({
        uid: params.uid,
        name: params.name,
        description: params.description,
        item_type: params.item_type,
        rarity: params.rarity,
        imagePath: params.imagePath,
        attributes: params.attributes
      })
    })
  }
}
