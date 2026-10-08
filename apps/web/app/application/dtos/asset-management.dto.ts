import type { ApiResponse } from '@application/dtos/api-response.dto'
import type { NFTAttribute } from '@core/entities/nft.entity'

/**
 * Represents a game asset stored in the database.
 *
 * Contains all properties needed to mint an NFT from a game item,
 * including metadata and visual attributes.
 */
export interface DatabaseAsset {
  uid: number
  name: string
  description: string
  item_type: string
  rarity: string
  image_path: string
  attributes: NFTAttribute[]
}

/**
 * Response from fetching asset data from the game backend.
 */
export type AssetDataResponse = ApiResponse & {
  asset?: DatabaseAsset
  sourceGame?: string
}

/**
 * Request payload for exporting an NFT back to the game system.
 */
export interface ExportNFTRequest {
  uid: number
  name: string
  description: string
  item_type: string
  rarity: string
  image_path: string
  attributes: NFTAttribute[]
}

/**
 * Response from exporting an NFT to the game system.
 */
export type ExportNFTResponse = ApiResponse & {
  exportedAsset?: DatabaseAsset
}

/**
 * Response from deleting an asset record from the database.
 */
export type DeleteAssetResponse = ApiResponse
