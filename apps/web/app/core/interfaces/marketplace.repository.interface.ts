import type { Listing } from '@core/entities/listing.entity'
import type { NFT } from '@core/entities/nft.entity'
import type { Address } from '@core/value-objects/address.vo'
import type { ListingId } from '@core/value-objects/listing-id.vo'
import type { TokenId } from '@core/value-objects/token-id.vo'
import type { WeiAmount } from '@core/value-objects/wei-amount.vo'

/**
 * Combined listing and NFT data for display purposes.
 * Provides all information needed to render a marketplace listing.
 */
export interface ListingWithNFT {
  /** The marketplace listing data */
  readonly listing: Listing
  /** The associated NFT with metadata */
  readonly nft: NFT
}

/**
 * Repository interface for NFT marketplace operations.
 *
 * Provides methods for creating, purchasing, and cancelling listings,
 * as well as querying marketplace data.
 */
export interface IMarketplaceRepository {
  /**
   * Creates a new marketplace listing for an NFT.
   * @param params - Listing parameters
   * @param params.tokenId - The token ID of the NFT to list
   * @param params.price - The listing price in Wei
   * @param params.seller - The seller's address
   * @returns Promise resolving to the listing ID and transaction hash
   */
  createListing(params: {
    tokenId: TokenId
    price: WeiAmount
    seller: Address
  }): Promise<{ listingId: ListingId; hash: `0x${string}` }>

  /**
   * Purchases an NFT from a marketplace listing.
   * @param params - Purchase parameters
   * @param params.listingId - The ID of the listing to purchase
   * @param params.buyer - The buyer's address
   * @param params.price - The purchase price in Wei
   * @returns Promise resolving to the transaction hash
   */
  buyListing(params: { listingId: ListingId; buyer: Address; price: WeiAmount }): Promise<{ hash: `0x${string}` }>

  /**
   * Cancels an active marketplace listing.
   * Only the seller can cancel their own listings.
   * @param params - Cancellation parameters
   * @param params.listingId - The ID of the listing to cancel
   * @param params.seller - The seller's address (for verification)
   * @returns Promise resolving to the transaction hash
   */
  cancelListing(params: { listingId: ListingId; seller: Address }): Promise<{ hash: `0x${string}` }>

  /**
   * Retrieves a listing by its ID.
   * @param listingId - The unique listing identifier
   * @returns Promise resolving to the listing data
   */
  getById(listingId: ListingId): Promise<Listing>

  /**
   * Checks if an NFT is currently listed on the marketplace.
   * @param tokenId - The token ID to check
   * @returns Promise resolving to true if listed
   */
  isListed(tokenId: TokenId): Promise<boolean>

  /**
   * Gets the total count of active listings.
   * @returns Promise resolving to the count
   */
  getActiveListingCount(): Promise<number>

  /**
   * Retrieves all active listings with their NFT data.
   * @returns Promise resolving to an array of listings with NFT data
   */
  getAllActiveListingsWithNFTData(): Promise<ListingWithNFT[]>

  /**
   * Retrieves all active listings for a specific seller.
   * @param seller - The seller's address
   * @returns Promise resolving to an array of the user's listings
   */
  getUserListingsWithNFTData(seller: Address): Promise<ListingWithNFT[]>
}
