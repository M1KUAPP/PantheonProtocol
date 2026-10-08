import type { AppConfig } from '@config/app-config'
import { createAppConfig } from '@config/app-config'
import { NetworkError } from '@core/errors/domain-error'

/**
 * Base response structure for all HTTP API calls.
 */
interface HttpApiResponse {
  /** Indicates if the request was successful */
  success: boolean
  /** Optional message providing additional details */
  message?: string
  /** Optional error code for specific failure types */
  code?: string
}

/**
 * Raw database asset structure returned from the API.
 */
interface HttpDatabaseAsset {
  /** Unique identifier in the game's database */
  uid: number
  /** Display name of the asset */
  name: string
  /** Detailed description */
  description: string
  /** Category/type of the item */
  item_type: string
  /** Rarity classification */
  rarity: string
  /** URL or path to the image */
  image_path: string
  /** Collection of asset attributes */
  attributes: Array<{ trait_type: string; value: string | number | boolean }>
}

/**
 * Response type for fetching asset data.
 */
export type AssetDataResponse = HttpApiResponse & {
  /** The retrieved asset data */
  asset?: HttpDatabaseAsset
  /** The source game identifier */
  sourceGame?: string
}

/**
 * Request payload for exporting an NFT to the game.
 */
export interface ExportNFTRequest {
  /** Unique identifier for the asset */
  uid: number
  /** Display name */
  name: string
  /** Asset description */
  description: string
  /** Item category/type */
  item_type: string
  /** Rarity classification */
  rarity: string
  /** Image URL/path */
  image_path: string
  /** Asset attributes */
  attributes: Array<{ trait_type: string; value: string | number }>
}

/**
 * Response type for NFT export operations.
 */
export type ExportNFTResponse = HttpApiResponse & {
  /** The exported asset data */
  exportedAsset?: HttpDatabaseAsset
}

/**
 * Response type for asset deletion operations.
 */
export type DeleteAssetResponse = HttpApiResponse

/**
 * Response type for creating a Pinata upload URL.
 */
export type UploadUrlResponse = HttpApiResponse & {
  /** Short-lived signed URL that accepts one upload */
  url?: string
}

/**
 * HTTP client for communicating with the game's backend API.
 *
 * Provides methods for fetching game assets, exporting NFTs back to the game,
 * and removing asset records. Uses the singleton pattern for connection reuse.
 */
class HttpClient {
  /** Base URL for all API requests */
  private readonly baseUrl: string
  /** Application configuration instance */
  private readonly config: AppConfig

  /**
   * Creates a new HttpClient instance.
   * @param config - Optional application configuration (creates default if not provided)
   */
  constructor(config?: AppConfig) {
    this.config = config || createAppConfig()
    this.baseUrl = this.config.getApiBaseUrl() || ''
  }

  /**
   * Performs an HTTP GET request.
   * @param endpoint - The API endpoint to call
   * @returns Promise resolving to the typed response
   */
  private async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return this.handleResponse<T>(response)
  }

  /**
   * Performs an HTTP POST request.
   * @param endpoint - The API endpoint to call
   * @param body - The request body to send
   * @returns Promise resolving to the typed response
   */
  private async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    return this.handleResponse<T>(response)
  }

  /**
   * Performs an HTTP DELETE request.
   * @param endpoint - The API endpoint to call
   * @returns Promise resolving to the typed response
   */
  private async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return this.handleResponse<T>(response)
  }

  /**
   * Processes the HTTP response and handles errors.
   * @param response - The fetch Response object
   * @returns Promise resolving to the parsed response data
   * @throws NetworkError if the response indicates failure
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json()
    if (!response.ok) {
      throw new NetworkError(data.message || `API request failed with status ${response.status}`)
    }
    return data as T
  }

  /**
   * Fetches asset data from the game's database.
   * @param uid - The unique identifier of the asset
   * @returns Promise resolving to the asset data response
   */
  async getAssetData(uid: string | number): Promise<AssetDataResponse> {
    return this.get<AssetDataResponse>(`${this.config.getApiEndpoints().GET_RECORD}/${uid}`)
  }

  /**
   * Exports an NFT back to the game system.
   * @param exportData - The NFT data to export
   * @returns Promise resolving to the export response
   */
  async exportNFT(exportData: ExportNFTRequest): Promise<ExportNFTResponse> {
    return this.post<ExportNFTResponse>(`${this.config.getApiEndpoints().EXPORT_RECORD}/${exportData.uid}`, exportData)
  }

  /**
   * Removes an asset record from the game's database.
   * @param uid - The unique identifier of the asset to remove
   * @returns Promise resolving to the deletion response
   */
  async removeAssetRecord(uid: string | number): Promise<DeleteAssetResponse> {
    return this.delete<DeleteAssetResponse>(`${this.config.getApiEndpoints().REMOVE_RECORD}/${uid}`)
  }

  /**
   * Asks the API for a signed Pinata upload URL.
   * @returns Promise resolving to the response holding the URL
   */
  async createIpfsUploadUrl(): Promise<UploadUrlResponse> {
    return this.post<UploadUrlResponse>(this.config.getApiEndpoints().IPFS_UPLOAD_URL, {})
  }
}

/** Singleton instance of the HTTP client */
let httpClientInstance: HttpClient | null = null

/**
 * Gets the singleton HttpClient instance.
 *
 * Creates a new instance if one doesn't exist or if a new config is provided.
 *
 * @param config - Optional configuration to use for the client
 * @returns The HttpClient singleton instance
 */
export function getHttpClient(config?: AppConfig): HttpClient {
  if (!httpClientInstance || config) {
    httpClientInstance = new HttpClient(config)
  }
  return httpClientInstance
}
