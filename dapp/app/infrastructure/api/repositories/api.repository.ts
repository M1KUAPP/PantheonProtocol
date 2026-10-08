import { NetworkError } from '@core/errors/domain-error'
import type { GameAsset, IAPIRepository } from '@core/interfaces/api.repository.interface'
import type { AssetId } from '@core/value-objects/asset-id.vo'
import { getHttpClient } from '@infrastructure/api/http-client'
import { normalizeAttributes } from '@infrastructure/api/utils/attribute-mapper'

/**
 * Implementation of IAPIRepository for game backend API communication.
 *
 * Handles all interactions with the game's backend API including
 * fetching game assets, removing minted assets, and exporting NFTs
 * back to the game.
 */
export class APIRepository implements IAPIRepository {
  /** HTTP client instance for making API requests */
  private readonly httpClient = getHttpClient()

  /**
   * Fetches game asset data by its ID.
   *
   * Retrieves the asset from the game's database and transforms it
   * into the domain GameAsset format.
   *
   * @param assetId - The unique identifier of the game asset
   * @returns Promise resolving to the game asset data
   * @throws NetworkError if the asset is not found or the request fails
   */
  async getAssetData(assetId: AssetId): Promise<GameAsset> {
    try {
      const response = await this.httpClient.getAssetData(assetId.value.toString())
      if (!response.success || !response.asset) {
        throw new NetworkError(response.message || `Asset data not found for ID ${assetId.value}`)
      }
      const asset = response.asset
      const gameAsset: GameAsset = {
        uid: asset.uid,
        name: asset.name,
        description: asset.description,
        image_path: asset.image_path,
        rarity: asset.rarity,
        itemType: asset.item_type,
        attributes: normalizeAttributes(asset.attributes)
      }
      return gameAsset
    } catch (error) {
      throw new NetworkError(`Failed to fetch asset data: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Removes an asset record from the game's database.
   *
   * Called after an NFT is successfully minted to prevent
   * the same asset from being minted again.
   *
   * @param assetId - The unique identifier of the asset to remove
   * @throws NetworkError if the deletion fails
   */
  async removeAssetRecord(assetId: AssetId): Promise<void> {
    try {
      const response = await this.httpClient.removeAssetRecord(assetId.value.toString())
      if (!response.success) {
        throw new NetworkError(response.message || 'Failed to delete asset record')
      }
    } catch (error) {
      throw new NetworkError(`Failed to delete asset record: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Exports an NFT back to the game system.
   *
   * Creates a new game asset from NFT data, allowing users
   * to import their NFTs into the game.
   *
   * @param params - The NFT data to export to the game
   * @throws NetworkError if the export fails
   */
  async exportNFTToGame(params: {
    uid: number
    name: string
    description: string
    item_type: string
    rarity: string
    imagePath: string
    attributes: Array<{ trait_type: string; value: string | number }>
  }): Promise<void> {
    try {
      const response = await this.httpClient.exportNFT({
        uid: params.uid,
        name: params.name,
        description: params.description,
        item_type: params.item_type,
        rarity: params.rarity,
        image_path: params.imagePath,
        attributes: params.attributes
      })
      if (!response.success) {
        throw new NetworkError(response.message || 'Failed to export NFT to game')
      }
    } catch (error) {
      throw new NetworkError(`Failed to export NFT to game: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Downloads an image from a URL.
   *
   * Used for fetching NFT images for display or processing.
   *
   * @param url - The URL of the image to download
   * @returns Promise resolving to the image as a Blob
   * @throws NetworkError if the download fails
   */
  async downloadImage(url: string): Promise<Blob> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new NetworkError(`Failed to fetch image: ${response.statusText}`)
      }
      return await response.blob()
    } catch (error) {
      throw new NetworkError(`Failed to download image: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
