import type { NFTMetadata } from '@core/entities/nft.entity'
import { Address } from '@core/value-objects/address.vo'
import { ListingId } from '@core/value-objects/listing-id.vo'
import { TokenId } from '@core/value-objects/token-id.vo'
import { WeiAmount } from '@core/value-objects/wei-amount.vo'

/**
 * Enumeration of possible marketplace listing states.
 */
export enum ListingStatus {
  /** Listing is available for purchase */
  Active = 'active',
  /** Listing was cancelled by the seller */
  Cancelled = 'cancelled',
  /** Listing was purchased by a buyer */
  Sold = 'sold'
}

/**
 * Domain entity representing an NFT marketplace listing.
 *
 * A Listing represents an NFT that has been put up for sale on the marketplace.
 * It tracks the listing ID, the NFT being sold, the seller, price, and current status.
 * This entity follows immutable patterns - state changes return new instances.
 *
 * @example
 * ```typescript
 * const listing = Listing.fromPrimitives({
 *   listingId: 1,
 *   tokenId: 42,
 *   seller: '0x742d35Cc6634C0532925a3b844Bc9e7595f1934F',
 *   priceWei: '1000000000000000000' // 1 ETH
 * });
 *
 * if (listing.canBuyWith(buyerBalance)) {
 *   // Proceed with purchase
 * }
 * ```
 */
export class Listing {
  /** Unique identifier for this marketplace listing */
  private readonly _listingId: ListingId
  /** Token ID of the NFT being sold */
  private readonly _tokenId: TokenId
  /** Address of the NFT seller */
  private readonly _seller: Address
  /** Listing price in Wei */
  private readonly _price: WeiAmount
  /** Current status of the listing */
  private _status: ListingStatus
  /** Optional NFT metadata for display purposes */
  private _metadata?: NFTMetadata

  /**
   * Creates a new Listing instance.
   * @param listingId - Unique marketplace listing identifier
   * @param tokenId - Token ID of the NFT
   * @param seller - Seller's Ethereum address
   * @param price - Listing price in Wei
   * @param status - Current listing status (defaults to Active)
   * @param metadata - Optional NFT metadata
   */
  private constructor(
    listingId: ListingId,
    tokenId: TokenId,
    seller: Address,
    price: WeiAmount,
    status: ListingStatus = ListingStatus.Active,
    metadata?: NFTMetadata
  ) {
    this._listingId = listingId
    this._tokenId = tokenId
    this._seller = seller
    this._price = price
    this._status = status
    this._metadata = metadata
  }

  /**
   * Factory method to create a Listing from value objects.
   * @param params - Listing parameters with value object types
   * @returns A new Listing instance
   */
  static create(params: {
    listingId: ListingId
    tokenId: TokenId
    seller: Address
    price: WeiAmount
    status?: ListingStatus
    metadata?: NFTMetadata
  }): Listing {
    return new Listing(params.listingId, params.tokenId, params.seller, params.price, params.status, params.metadata)
  }

  /**
   * Factory method to create a Listing from primitive values.
   * Useful for hydrating entities from smart contract responses or database records.
   * @param params - Listing parameters with primitive types
   * @returns A new Listing instance
   */
  static fromPrimitives(params: {
    listingId: number
    tokenId: number
    seller: string
    priceWei: bigint | string
    status?: ListingStatus
    metadata?: NFTMetadata
  }): Listing {
    const price =
      typeof params.priceWei === 'string' ? WeiAmount.fromString(params.priceWei) : WeiAmount.create(params.priceWei)
    return new Listing(
      ListingId.create(params.listingId),
      TokenId.create(params.tokenId),
      Address.create(params.seller),
      price,
      params.status || ListingStatus.Active,
      params.metadata
    )
  }

  /** Gets the unique listing identifier */
  get listingId(): ListingId {
    return this._listingId
  }

  /** Gets the token ID of the listed NFT */
  get tokenId(): TokenId {
    return this._tokenId
  }

  /** Gets the seller's address */
  get seller(): Address {
    return this._seller
  }

  /** Gets the listing price in Wei */
  get price(): WeiAmount {
    return this._price
  }

  /** Gets the current listing status */
  get status(): ListingStatus {
    return this._status
  }

  /** Gets the NFT metadata if loaded */
  get metadata(): NFTMetadata | undefined {
    return this._metadata
  }

  /**
   * Checks if the listing is currently active and available for purchase.
   * @returns True if the listing status is Active
   */
  isActive(): boolean {
    return this._status === ListingStatus.Active
  }

  /**
   * Checks if the listing has been cancelled.
   * @returns True if the listing status is Cancelled
   */
  isCancelled(): boolean {
    return this._status === ListingStatus.Cancelled
  }

  /**
   * Checks if the listing has been sold.
   * @returns True if the listing status is Sold
   */
  isSold(): boolean {
    return this._status === ListingStatus.Sold
  }

  /**
   * Checks if the given address is the seller of this listing.
   * @param address - The address to check
   * @returns True if the address matches the seller
   */
  isSellerAddress(address: Address): boolean {
    return this._seller.equals(address)
  }

  /**
   * Determines if a buyer can purchase this listing with their balance.
   * @param buyerBalance - The buyer's available balance in Wei
   * @returns True if the listing is active and buyer has sufficient funds
   */
  canBuyWith(buyerBalance: WeiAmount): boolean {
    return (this.isActive() && buyerBalance.isGreaterThan(this._price)) || buyerBalance.equals(this._price)
  }

  /**
   * Creates a new Listing with Cancelled status.
   * @returns A new Listing instance with Cancelled status
   * @throws Error if the listing is not currently active
   */
  cancel(): Listing {
    if (!this.isActive()) {
      throw new Error('Cannot cancel a listing that is not active')
    }
    return new Listing(
      this._listingId,
      this._tokenId,
      this._seller,
      this._price,
      ListingStatus.Cancelled,
      this._metadata
    )
  }

  /**
   * Creates a new Listing with Sold status.
   * @returns A new Listing instance with Sold status
   * @throws Error if the listing is not currently active
   */
  markAsSold(): Listing {
    if (!this.isActive()) {
      throw new Error('Cannot mark as sold a listing that is not active')
    }
    return new Listing(this._listingId, this._tokenId, this._seller, this._price, ListingStatus.Sold, this._metadata)
  }

  /**
   * Creates a new Listing with attached metadata.
   * @param metadata - The NFT metadata to attach
   * @returns A new Listing instance with metadata
   */
  withMetadata(metadata: NFTMetadata): Listing {
    return new Listing(this._listingId, this._tokenId, this._seller, this._price, this._status, metadata)
  }

  /**
   * Gets the listing price converted to Ether.
   * @returns The price as a floating-point number in Ether
   */
  getPriceInEther(): number {
    return this._price.toEther()
  }

  /**
   * Gets a formatted price string in Ether.
   * @param decimals - Number of decimal places (defaults to 4)
   * @returns Formatted price string
   */
  getFormattedPrice(decimals: number = 4): string {
    return this._price.toEtherString(decimals)
  }

  /**
   * Converts the entity to a plain object with primitive values.
   * Useful for serialization and storage.
   * @returns Plain object representation
   */
  toPrimitives(): {
    listingId: number
    tokenId: number
    seller: string
    priceWei: string
    status: ListingStatus
    metadata?: NFTMetadata
  } {
    return {
      listingId: this._listingId.value,
      tokenId: this._tokenId.value,
      seller: this._seller.value,
      priceWei: this._price.toString(),
      status: this._status,
      metadata: this._metadata
    }
  }

  /**
   * Compares two listings for equality based on listing ID.
   * @param other - The listing to compare against
   * @returns True if the listing IDs match
   */
  equals(other: Listing): boolean {
    return this._listingId.equals(other._listingId)
  }
}
