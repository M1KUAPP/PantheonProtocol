import type { DatabaseAsset, ExportNFTRequest } from '@application/dtos/asset-management.dto'
import { ValidationError } from '@core/errors/domain-error'
import type { IDatabaseRepository } from '@core/interfaces/database.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'

/**
 * Result of the NFT export synchronization.
 */
interface ExportNFTResult {
  message: string
  exportedAsset: DatabaseAsset
}

/**
 * Use case for synchronizing an exported NFT back to the game database.
 *
 * When an NFT is exported (burned on-chain), this use case inserts
 * the asset data into the target game's database, recreating the
 * in-game item from the NFT metadata.
 */
export class SyncExportNFTUseCase {
  constructor(
    private databaseRepository: IDatabaseRepository,
    private targetTableName: string
  ) {}
  async execute(request: ExportNFTRequest): Promise<Result<ExportNFTResult>> {
    return executeAsync(async () => {
      const validation = this.validateRequest(request)
      if (!validation.valid) {
        throw new ValidationError(validation.message!)
      }
      const assetData: DatabaseAsset = {
        uid: request.uid,
        name: request.name,
        description: request.description,
        item_type: request.item_type,
        rarity: request.rarity,
        image_path: request.image_path,
        attributes: request.attributes
      }
      const insertResult = await this.databaseRepository.insertAsset(this.targetTableName, assetData)
      if (insertResult.error) {
        if (insertResult.error.includes('duplicate key') || insertResult.error.includes('unique constraint')) {
          throw new Error(`Asset with UID ${request.uid} already exists in target game`)
        }
        throw new Error(`Database error: ${insertResult.error}`)
      }
      return {
        message: `Asset successfully exported to target game`,
        exportedAsset: insertResult.data as DatabaseAsset
      }
    })
  }
  private validateRequest(request: ExportNFTRequest): { valid: boolean; message?: string } {
    const { uid, name, description, item_type, rarity, image_path, attributes } = request
    if (uid === undefined || !name || !description || !item_type || !rarity || !image_path || !attributes) {
      return { valid: false, message: 'Missing required asset data fields' }
    }
    if (isNaN(uid) || uid < 0) {
      return { valid: false, message: 'UID must be a non-negative number' }
    }
    if (!Array.isArray(attributes)) {
      return { valid: false, message: 'Attributes must be an array' }
    }
    return { valid: true }
  }
}
