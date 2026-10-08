import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

/**
 * Database record structure for game assets stored in Supabase.
 */
interface AssetRecord {
  uid: number
  name: string
  description: string
  image_path: string
  rarity: string
  item_type: string
  attributes: Array<{ trait_type: string; value: string | number }>
}

/**
 * Low-level database service for Supabase interactions.
 *
 * Provides direct access to the Supabase database client for
 * CRUD operations on game asset records. This service handles
 * connection management and query execution.
 */
export class ServerDatabaseService {
  private readonly client: ReturnType<typeof createClient>
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey)
  }
  async getAssetByUid(tableName: string, uid: number): Promise<{ data: AssetRecord | null; error: string | null }> {
    try {
      const response = (await this.client
        .from(tableName)
        .select('*')
        .eq('uid', uid)
        .maybeSingle()) as PostgrestSingleResponse<AssetRecord>
      if (response.error) {
        return { data: null, error: response.error.message }
      }
      return { data: response.data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }
  async insertAsset(
    tableName: string,
    asset: Partial<AssetRecord>
  ): Promise<{ data: AssetRecord | null; error: string | null }> {
    try {
      const query = this.client.from(tableName) as ReturnType<typeof this.client.from> & {
        insert: (data: Record<string, unknown>) => {
          select: () => { single: () => Promise<PostgrestSingleResponse<AssetRecord>> }
        }
      }
      const response = await query.insert(asset).select().single()
      if (response.error) {
        return { data: null, error: response.error.message }
      }
      return { data: response.data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }
  async deleteAsset(tableName: string, uid: number): Promise<{ error: string | null }> {
    try {
      const { error } = await this.client.from(tableName).delete().eq('uid', uid)
      if (error) {
        return { error: error.message }
      }
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }
}
