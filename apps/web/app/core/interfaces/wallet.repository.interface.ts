import type { Wallet } from '@core/entities/wallet.entity'
import type { Address } from '@core/value-objects/address.vo'
import type { WeiAmount } from '@core/value-objects/wei-amount.vo'

/**
 * Repository interface for wallet connection and management.
 *
 * Provides methods for connecting to Web3 wallets (MetaMask, etc.),
 * querying account information, and managing chain switching.
 */
export interface IWalletRepository {
  /**
   * Gets the current wallet state.
   * @returns Promise resolving to the current Wallet entity
   */
  getCurrent(): Promise<Wallet>

  /**
   * Initiates a wallet connection.
   * Opens the wallet extension's connection prompt.
   * @returns Promise resolving to the connected Wallet entity
   */
  connect(): Promise<Wallet>

  /**
   * Disconnects the current wallet.
   */
  disconnect(): Promise<void>

  /**
   * Gets the balance for a specific address.
   * @param address - The address to query
   * @returns Promise resolving to the balance in Wei
   */
  getBalance(address: Address): Promise<WeiAmount>

  /**
   * Gets the current chain ID the wallet is connected to.
   * @returns Promise resolving to the chain ID
   */
  getChainId(): Promise<number>

  /**
   * Requests the wallet to switch to a different chain.
   * @param chainId - The target chain ID to switch to
   */
  switchChain(chainId: number): Promise<void>

  /**
   * Checks if a wallet is currently connected.
   * @returns Promise resolving to true if connected
   */
  isConnected(): Promise<boolean>

  /**
   * Gets the currently connected wallet address.
   * @returns Promise resolving to the address or null if not connected
   */
  getAddress(): Promise<Address | null>
}
