import type { Address } from '@core/value-objects/address.vo'

/**
 * Represents a blockchain transaction record.
 * Contains all relevant data for displaying transaction history.
 */
export interface BlockchainTransaction {
  /** Transaction hash (unique identifier) */
  hash: `0x${string}`
  /** Sender address */
  from: string
  /** Recipient address, or null for contract creation */
  to: string | null
  /** Transaction value in Wei */
  value: bigint
  /** Unix timestamp of the transaction */
  timestamp: number
  /** Transaction execution status */
  status: 'success' | 'failed'
  /** True if this transaction created a contract */
  isContractCreation: boolean
}

/**
 * Repository interface for querying blockchain transaction history.
 *
 * Provides methods for fetching historical transactions for a given address.
 */
export interface ITransactionHistoryRepository {
  /**
   * Retrieves recent transactions for a wallet address.
   * @param address - The wallet address to query
   * @param maxBlocks - Optional maximum number of blocks to search (defaults to implementation-specific limit)
   * @returns Promise resolving to an array of transactions
   */
  getRecentTransactions(address: Address, maxBlocks?: number): Promise<BlockchainTransaction[]>
}
