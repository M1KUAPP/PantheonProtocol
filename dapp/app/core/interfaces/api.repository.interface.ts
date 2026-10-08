import type { AssetId } from '@core/value-objects/asset-id.vo'

/**
 * Represents a game asset that can be minted as an NFT.
 * Contains all the metadata needed to create and display the NFT.
 */
export interface GameAsset {
  /** Unique identifier in the game's database */
  readonly uid: number
  /** Display name of the asset */
  readonly name: string
  /** Detailed description of the asset */
  readonly description: string
  /** URL or path to the asset's image */
  readonly image_path: string
  /** Rarity classification (e.g., "Common", "Rare", "Legendary") */
  readonly rarity: string
  /** Category/type of the in-game item */
  readonly itemType: string
  /** Collection of attributes/traits for the asset */
  readonly attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

/**
 * Repository interface for game API interactions.
 *
 * Provides methods for fetching game assets, managing asset records,
 * and handling cross-system data synchronization between the game and blockchain.
 */
export interface IAPIRepository {
  /**
   * Retrieves asset data from the game's database.
   * @param assetId - The unique identifier of the game asset
   * @returns Promise resolving to the game asset data
   */
  getAssetData(assetId: AssetId): Promise<GameAsset>

  /**
   * Removes an asset record from the game's database.
   * Typically called after an NFT is minted to prevent duplicate minting.
   * @param assetId - The unique identifier of the asset to remove
   */
  removeAssetRecord(assetId: AssetId): Promise<void>

  /**
   * Exports an NFT back to the game system.
   * Used when a user wants to import their NFT into the game.
   * @param params - The NFT data to export to the game
   */
  exportNFTToGame(params: {
    uid: number
    name: string
    description: string
    item_type: string
    rarity: string
    imagePath: string
    attributes: Array<{ trait_type: string; value: string | number }>
  }): Promise<void>

  /**
   * Downloads an image from a URL.
   * Used for fetching NFT images for display or processing.
   * @param url - The URL of the image to download
   * @returns Promise resolving to the image as a Blob
   */
  downloadImage(url: string): Promise<Blob>
}
