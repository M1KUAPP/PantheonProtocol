/**
 * Generic result type for database operations.
 * Provides a consistent way to handle both successful queries and errors.
 *
 * @typeParam T - The type of data returned on success
 */
export interface DatabaseQueryResult<T> {
  /** The query result data, or null if the operation failed */
  data: T | null
  /** Error message if the operation failed, or null on success */
  error: string | null
}

/**
 * Repository interface for database operations.
 *
 * Provides low-level database access methods for asset management.
 * Implementations may use various database backends (Supabase, PostgreSQL, etc.).
 */
export interface IDatabaseRepository {
  /**
   * Retrieves an asset by its unique identifier.
   * @param tableName - The database table to query
   * @param uid - The unique identifier of the asset
   * @returns Promise resolving to the query result
   */
  getAssetByUid(tableName: string, uid: number): Promise<DatabaseQueryResult<unknown>>

  /**
   * Inserts a new asset into the database.
   * @param tableName - The database table to insert into
   * @param asset - The asset data to insert
   * @returns Promise resolving to the inserted record
   */
  insertAsset(tableName: string, asset: object): Promise<DatabaseQueryResult<unknown>>

  /**
   * Deletes an asset from the database.
   * @param tableName - The database table to delete from
   * @param uid - The unique identifier of the asset to delete
   * @returns Promise resolving to the number of deleted records
   */
  deleteAsset(tableName: string, uid: number): Promise<DatabaseQueryResult<number>>
}
