import type { DatabaseAsset } from '@application/dtos/asset-management.dto'
import { NotFoundError, ValidationError } from '@core/errors/domain-error'
import type { IDatabaseRepository } from '@core/interfaces/database.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'

/**
 * Result containing the retrieved asset and its source game.
 */
interface AssetDataResult {
  asset: DatabaseAsset
  sourceGame: string
}

/**
 * Use case for retrieving game asset data from the database.
 *
 * Fetches asset metadata by UID from the configured source game table.
 * Used before minting to verify the asset exists and get its properties.
 */
export class GetAssetDataUseCase {
  constructor(
    private databaseRepository: IDatabaseRepository,
    private sourceTableName: string
  ) {}
  async execute(uid: number): Promise<Result<AssetDataResult>> {
    return executeAsync(async () => {
      if (!uid || uid <= 0) {
        throw new ValidationError('Asset UID must be a positive number')
      }
      const sourceResult = await this.databaseRepository.getAssetByUid(this.sourceTableName, uid)
      if (sourceResult.error) {
        throw new Error(`Database error while searching source game: ${sourceResult.error}`)
      }
      if (sourceResult.data) {
        return {
          asset: sourceResult.data as DatabaseAsset,
          sourceGame: 'Source Game'
        }
      }
      throw new NotFoundError(`Asset with UID ${uid} not found in source game database`)
    })
  }
}
