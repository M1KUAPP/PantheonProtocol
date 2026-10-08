import type { IpfsCid } from '@core/value-objects/ipfs-cid.vo'
import type { Uri } from '@core/value-objects/uri.vo'

/**
 * NFT metadata structure for IPFS storage.
 * Follows a standard format for NFT metadata files.
 */
export interface IPFSMetadata {
  /** Unique identifier linking to the game asset */
  readonly uid: number
  /** Display name of the NFT */
  readonly name: string
  /** Detailed description of the NFT */
  readonly description: string
  /** Category/type of the in-game item */
  readonly item_type: string
  /** Rarity classification */
  readonly rarity: string
  /** URL or path to the NFT image */
  readonly image_path: string
  /** Collection of NFT attributes/traits */
  readonly attributes: ReadonlyArray<{
    readonly trait_type: string
    readonly value: string | number | boolean
  }>
}

/**
 * Result of pinning content to IPFS.
 * Contains the CID and accessible URL for the pinned content.
 */
export interface IPFSPinResult {
  /** The Content Identifier of the pinned content */
  readonly cid: IpfsCid
  /** The accessible URI for the content */
  readonly url: Uri
}

/**
 * Repository interface for IPFS operations.
 *
 * Provides methods for uploading, retrieving, and managing content
 * on the InterPlanetary File System (IPFS).
 */
export interface IIPFSRepository {
  /**
   * Uploads a file to IPFS and pins it.
   * @param file - The file to upload
   * @param uploadUrl - A signed upload URL from the API
   * @returns Promise resolving to the pin result with CID and URL
   */
  uploadFile(file: File, uploadUrl: string): Promise<IPFSPinResult>

  /**
   * Uploads NFT metadata as a JSON file to IPFS.
   * @param metadata - The metadata object to upload
   * @param filename - The filename for the metadata file
   * @param uploadUrl - A signed upload URL from the API
   * @returns Promise resolving to the pin result
   */
  uploadMetadata(metadata: IPFSMetadata, filename: string, uploadUrl: string): Promise<IPFSPinResult>

  /**
   * Retrieves raw content from IPFS by CID.
   * @param cid - The Content Identifier
   * @returns Promise resolving to the content as a string
   */
  getContent(cid: IpfsCid): Promise<string>

  /**
   * Retrieves and parses NFT metadata from IPFS.
   * @param cid - The Content Identifier of the metadata file
   * @returns Promise resolving to the parsed metadata
   */
  getMetadata(cid: IpfsCid): Promise<IPFSMetadata>

  /**
   * Fetches metadata from a token URI (handles IPFS and HTTP URIs).
   * @param tokenURI - The URI pointing to the metadata
   * @returns Promise resolving to the parsed metadata
   */
  fetchMetadata(tokenURI: Uri): Promise<IPFSMetadata>

  /**
   * Converts a URI to an HTTP gateway URL.
   * @param uri - The URI to convert
   * @returns The HTTP-accessible gateway URL
   */
  toGatewayUrl(uri: Uri): string

  /**
   * Checks if content is pinned on the IPFS node.
   * @param cid - The Content Identifier to check
   * @returns Promise resolving to true if pinned
   */
  isPinned(cid: IpfsCid): Promise<boolean>

  /**
   * Unpins content from the IPFS node.
   * @param cid - The Content Identifier to unpin
   */
  unpin(cid: IpfsCid): Promise<void>
}
