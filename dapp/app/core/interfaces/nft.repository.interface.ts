import type { NFT } from '@core/entities/nft.entity'
import type { Address } from '@core/value-objects/address.vo'
import type { AssetId } from '@core/value-objects/asset-id.vo'
import type { TokenId } from '@core/value-objects/token-id.vo'
import type { Uri } from '@core/value-objects/uri.vo'

/**
 * Repository interface for ERC-721 NFT smart contract operations.
 *
 * Provides methods for minting, querying, and managing NFTs
 * on the blockchain.
 */
export interface INFTRepository {
  /**
   * Mints a new NFT to a specified address.
   * @param params - Minting parameters
   * @param params.assetId - The game asset ID to link to the NFT
   * @param params.tokenURI - The metadata URI for the NFT
   * @param params.to - The recipient address
   * @returns Promise resolving to the new token ID and transaction hash
   */
  mint(params: { assetId: AssetId; tokenURI: Uri; to: Address }): Promise<{ tokenId: TokenId; hash: `0x${string}` }>

  /**
   * Retrieves an NFT by its token ID.
   * @param tokenId - The unique token identifier
   * @returns Promise resolving to the NFT entity
   */
  getById(tokenId: TokenId): Promise<NFT>

  /**
   * Gets the total number of minted NFTs.
   * @returns Promise resolving to the total supply
   */
  getTotalSupply(): Promise<number>

  /**
   * Gets the current owner of an NFT.
   * @param tokenId - The token ID to query
   * @returns Promise resolving to the owner's address
   */
  getOwner(tokenId: TokenId): Promise<Address>

  /**
   * Approves an address to transfer a specific NFT.
   * Required before listing on the marketplace.
   * @param params - Approval parameters
   * @param params.to - The address to approve (typically marketplace contract)
   * @param params.tokenId - The token ID to approve
   * @returns Promise resolving to the transaction hash
   */
  approve(params: { to: Address; tokenId: TokenId }): Promise<{ hash: `0x${string}` }>

  /**
   * Gets the approved address for an NFT.
   * @param tokenId - The token ID to query
   * @returns Promise resolving to the approved address or null
   */
  getApproved(tokenId: TokenId): Promise<Address | null>

  /**
   * Retrieves all NFTs owned by a specific address.
   * @param address - The owner's address
   * @returns Promise resolving to an array of NFTs
   */
  getUserInventory(address: Address): Promise<NFT[]>

  /**
   * Retrieves multiple NFTs by their token IDs.
   * @param tokenIds - Array of token IDs to fetch
   * @returns Promise resolving to an array of NFTs
   */
  getBatch(tokenIds: TokenId[]): Promise<NFT[]>
}
