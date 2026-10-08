import { NotFoundError, ValidationError } from '@core/errors/domain-error'
import type { IDatabaseRepository } from '@core/interfaces/database.repository.interface'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'

/**
 * Result of the asset deletion operation.
 */
interface DeleteAssetResult {
  deletedCount: number
  message: string
}

/**
 * Use case for removing game asset data from the database.
 *
 * Deletes an asset record by UID after it has been minted as an NFT.
 * This prevents the same game item from being minted multiple times.
 */
export class RemoveAssetDataUseCase {
  constructor(
    private databaseRepository: IDatabaseRepository,
    private sourceTableName: string
  ) {}
  async execute(uid: number): Promise<Result<DeleteAssetResult>> {
    return executeAsync(async () => {
      if (!uid || uid <= 0) {
        throw new ValidationError('Asset UID must be a positive number')
      }
      const sourceResult = await this.databaseRepository.deleteAsset(this.sourceTableName, uid)
      if (sourceResult.error) {
        throw new Error(`Failed to delete asset from source game: ${sourceResult.error}`)
      }
      if (sourceResult.data === null || sourceResult.data === 0) {
        throw new NotFoundError(`Asset with UID ${uid} not found in source game database`)
      }
      return {
        deletedCount: sourceResult.data,
        message: `Successfully deleted asset with UID ${uid} from source game`
      }
    })
  }
}
