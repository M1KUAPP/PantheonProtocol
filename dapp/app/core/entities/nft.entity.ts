import { Address } from '@core/value-objects/address.vo'
import { AssetId } from '@core/value-objects/asset-id.vo'
import { TokenId } from '@core/value-objects/token-id.vo'
import { Uri } from '@core/value-objects/uri.vo'

/**
 * Represents a single attribute/trait of an NFT.
 * Follows the OpenSea metadata standard for NFT attributes.
 */
export interface NFTAttribute {
  /** The name/category of the trait (e.g., "Rarity", "Level") */
  readonly trait_type: string
  /** The value of the trait */
  readonly value: string | number | boolean
}

/**
 * NFT metadata structure containing display information.
 * This data is typically stored on IPFS and referenced by the tokenURI.
 */
export interface NFTMetadata {
  /** Unique identifier linking to the game asset */
  readonly uid: number
  /** Display name of the NFT */
  readonly name: string
  /** Detailed description of the NFT */
  readonly description: string
  /** Category/type of the in-game item */
  readonly item_type: string
  /** Rarity classification (e.g., "Common", "Rare", "Legendary") */
  readonly rarity: string
  /** URL or path to the NFT image */
  readonly image_path: string
  /** Collection of NFT attributes/traits */
  readonly attributes: readonly NFTAttribute[]
}

/**
 * Domain entity representing an ERC-721 Non-Fungible Token.
 *
 * An NFT represents a unique digital asset on the blockchain with ownership tracking.
 * This entity encapsulates the on-chain data (tokenId, owner, tokenURI) along with
 * optional off-chain metadata fetched from IPFS.
 *
 * @example
 * ```typescript
 * const nft = NFT.fromPrimitives({
 *   tokenId: 1,
 *   owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f1934F',
 *   tokenURI: 'ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
 * });
 *
 * if (nft.isOwnedBy(userAddress)) {
 *   // User owns this NFT
 * }
 * ```
 */
export class NFT {
  /** Unique token identifier on the blockchain */
  private readonly _tokenId: TokenId
  /** Current owner's Ethereum address */
  private readonly _owner: Address
  /** URI pointing to the token's metadata (typically IPFS) */
  private readonly _tokenURI: Uri
  /** Optional reference to the original game asset */
  private readonly _assetId?: AssetId
  /** Optional loaded metadata from the tokenURI */
  private _metadata?: NFTMetadata

  /**
   * Creates a new NFT instance.
   * @param tokenId - The unique token identifier
   * @param owner - The owner's address
   * @param tokenURI - URI to the token metadata
   * @param assetId - Optional game asset reference
   * @param metadata - Optional pre-loaded metadata
   */
  private constructor(tokenId: TokenId, owner: Address, tokenURI: Uri, assetId?: AssetId, metadata?: NFTMetadata) {
    this._tokenId = tokenId
    this._owner = owner
    this._tokenURI = tokenURI
    this._assetId = assetId
    this._metadata = metadata
  }

  /**
   * Factory method to create an NFT from value objects.
   * @param params - NFT parameters with value object types
   * @returns A new NFT instance
   */
  static create(params: {
    tokenId: TokenId
    owner: Address
    tokenURI: Uri
    assetId?: AssetId
    metadata?: NFTMetadata
  }): NFT {
    return new NFT(params.tokenId, params.owner, params.tokenURI, params.assetId, params.metadata)
  }

  /**
   * Factory method to create an NFT from primitive values.
   * Useful for hydrating entities from smart contract responses.
   * @param params - NFT parameters with primitive types
   * @returns A new NFT instance
   */
  static fromPrimitives(params: {
    tokenId: number
    owner: string
    tokenURI: string
    assetId?: number
    metadata?: NFTMetadata
  }): NFT {
    return new NFT(
      TokenId.create(params.tokenId),
      Address.create(params.owner),
      Uri.create(params.tokenURI),
      params.assetId !== undefined ? AssetId.create(params.assetId) : undefined,
      params.metadata
    )
  }

  /** Gets the unique token identifier */
  get tokenId(): TokenId {
    return this._tokenId
  }

  /** Gets the current owner's address */
  get owner(): Address {
    return this._owner
  }

  /** Gets the token metadata URI */
  get tokenURI(): Uri {
    return this._tokenURI
  }

  /** Gets the associated game asset ID if available */
  get assetId(): AssetId | undefined {
    return this._assetId
  }

  /** Gets the loaded metadata if available */
  get metadata(): NFTMetadata | undefined {
    return this._metadata
  }

  /**
   * Checks if metadata has been loaded for this NFT.
   * @returns True if metadata is present
   */
  hasMetadata(): boolean {
    return this._metadata !== undefined
  }

  /**
   * Creates a new NFT instance with attached metadata.
   * @param metadata - The metadata to attach
   * @returns A new NFT instance with metadata
   */
  withMetadata(metadata: NFTMetadata): NFT {
    return new NFT(this._tokenId, this._owner, this._tokenURI, this._assetId, metadata)
  }

  /**
   * Checks if the NFT is owned by the given address.
   * @param address - The address to check ownership against
   * @returns True if the address owns this NFT
   */
  isOwnedBy(address: Address): boolean {
    return this._owner.equals(address)
  }

  /**
   * Checks if this NFT originated from a specific game asset.
   * @param assetId - The asset ID to check
   * @returns True if the NFT is linked to the given asset
   */
  isFromAsset(assetId: AssetId): boolean {
    return this._assetId !== undefined && this._assetId.equals(assetId)
  }

  /**
   * Gets the NFT's display name from metadata.
   * @returns The NFT name
   * @throws Error if metadata is not loaded
   */
  getName(): string {
    if (!this._metadata) {
      throw new Error('Metadata not loaded for this NFT')
    }
    return this._metadata.name
  }

  /**
   * Gets the NFT's description from metadata.
   * @returns The NFT description
   * @throws Error if metadata is not loaded
   */
  getDescription(): string {
    if (!this._metadata) {
      throw new Error('Metadata not loaded for this NFT')
    }
    return this._metadata.description
  }

  /**
   * Gets the NFT's image URL from metadata.
   * @returns The image URL/path
   * @throws Error if metadata is not loaded
   */
  getImageUrl(): string {
    if (!this._metadata) {
      throw new Error('Metadata not loaded for this NFT')
    }
    return this._metadata.image_path
  }

  /**
   * Retrieves a specific attribute from the NFT metadata.
   * @param traitType - The trait type to search for
   * @returns The matching attribute or undefined if not found
   */
  getAttribute(traitType: string): NFTAttribute | undefined {
    if (!this._metadata) {
      return undefined
    }
    return this._metadata.attributes.find((attr) => attr.trait_type === traitType)
  }

  /**
   * Converts the entity to a plain object with primitive values.
   * Useful for serialization and storage.
   * @returns Plain object representation
   */
  toPrimitives(): {
    tokenId: number
    owner: string
    tokenURI: string
    assetId?: number
    metadata?: NFTMetadata
  } {
    return {
      tokenId: this._tokenId.value,
      owner: this._owner.value,
      tokenURI: this._tokenURI.value,
      assetId: this._assetId?.value,
      metadata: this._metadata
    }
  }

  /**
   * Creates a new NFT instance with a different owner.
   * Used to represent ownership transfer.
   * @param newOwner - The new owner's address
   * @returns A new NFT instance with updated owner
   */
  transferTo(newOwner: Address): NFT {
    return new NFT(this._tokenId, newOwner, this._tokenURI, this._assetId, this._metadata)
  }

  /**
   * Compares two NFTs for equality based on token ID.
   * @param other - The NFT to compare against
   * @returns True if the token IDs match
   */
  equals(other: NFT): boolean {
    return this._tokenId.equals(other._tokenId)
  }
}
