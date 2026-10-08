import type { DatabaseQueryResult, IDatabaseRepository } from '@core/interfaces/database.repository.interface'
import { ServerDatabaseService } from '@infrastructure/database/server-database.service'

/**
 * Implementation of IDatabaseRepository using Supabase as the backend.
 *
 * Acts as an adapter between the domain layer and the ServerDatabaseService,
 * translating domain operations into database queries. Used for server-side
 * database operations like asset management.
 */
export class ServerDatabaseRepository implements IDatabaseRepository {
  constructor(private databaseService: ServerDatabaseService) {}
  async getAssetByUid(tableName: string, uid: number): Promise<DatabaseQueryResult<unknown>> {
    return await this.databaseService.getAssetByUid(tableName, uid)
  }
  async insertAsset(tableName: string, asset: object): Promise<DatabaseQueryResult<unknown>> {
    return await this.databaseService.insertAsset(tableName, asset)
  }
  async deleteAsset(tableName: string, uid: number): Promise<DatabaseQueryResult<number>> {
    const result = await this.databaseService.deleteAsset(tableName, uid)
    if (result.error) {
      return { data: null, error: result.error }
    }
    return { data: 1, error: null }
  }
}
