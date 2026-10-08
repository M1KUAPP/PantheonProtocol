import type { Address } from '@core/value-objects/address.vo'
import type { TokenId } from '@core/value-objects/token-id.vo'

/**
 * Repository interface for cross-chain NFT export operations.
 *
 * Manages the export of NFTs to other blockchain networks,
 * including tracking export counts and user-specific export history.
 */
export interface IExportManagerRepository {
  /**
   * Initiates an export of an NFT to another blockchain.
   * @param params - Export parameters
   * @param params.tokenId - The token ID of the NFT to export
   * @param params.targetChainId - The chain ID of the destination blockchain
   * @returns Promise resolving to the transaction hash
   */
  exportToChain(params: { tokenId: TokenId; targetChainId: number }): Promise<{ hash: `0x${string}` }>

  /**
   * Gets the total number of exports across all users.
   * @returns Promise resolving to the total export count
   */
  getExportCount(): Promise<number>

  /**
   * Gets the number of exports for a specific user.
   * @param address - The user's wallet address
   * @returns Promise resolving to the user's export count
   */
  getUserExportCount(address: Address): Promise<number>
}
