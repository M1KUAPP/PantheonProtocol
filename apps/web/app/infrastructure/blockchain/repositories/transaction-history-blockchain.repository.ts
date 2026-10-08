import { BlockchainError } from '@core/errors/domain-error'
import type {
  BlockchainTransaction,
  ITransactionHistoryRepository
} from '@core/interfaces/transaction-history.repository.interface'
import type { Address } from '@core/value-objects/address.vo'
import { getBlock, getBlockNumber, getTransactionReceipt } from '@wagmi/core'

/** Default number of recent blocks to scan for transaction history */
const DEFAULT_BLOCKS_TO_SCAN = 100

/**
 * Implementation of ITransactionHistoryRepository using direct blockchain queries.
 *
 * Retrieves transaction history by scanning recent blocks and filtering
 * for transactions involving a specific address. Note that this approach
 * is limited by block range and may not capture all historical transactions.
 */
export class TransactionHistoryBlockchainRepository implements ITransactionHistoryRepository {
  constructor(private readonly config: any) {}
  async getRecentTransactions(
    address: Address,
    maxBlocks: number = DEFAULT_BLOCKS_TO_SCAN
  ): Promise<BlockchainTransaction[]> {
    try {
      const addressValue = address.value.toLowerCase()
      const transactions: BlockchainTransaction[] = []
      const latestBlockNumber = await getBlockNumber(this.config)
      const fromBlock = latestBlockNumber > BigInt(maxBlocks) ? latestBlockNumber - BigInt(maxBlocks) : BigInt(0)
      const blockNumbers: bigint[] = []
      for (let i = latestBlockNumber; i >= fromBlock; i--) {
        blockNumbers.push(i)
      }
      const blocks = await Promise.all(
        blockNumbers.map((num) =>
          getBlock(this.config, {
            blockNumber: num,
            includeTransactions: true
          })
        )
      )
      for (const block of blocks) {
        if (!block || !block.transactions) continue
        for (const tx of block.transactions) {
          if (typeof tx === 'string') continue
          const isSender = tx.from.toLowerCase() === addressValue
          const isReceiver = tx.to?.toLowerCase() === addressValue
          if (isSender || isReceiver) {
            const receipt = await getTransactionReceipt(this.config, {
              hash: tx.hash
            })
            transactions.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to || null,
              value: tx.value,
              timestamp: Number(block.timestamp),
              status: receipt.status === 'success' ? 'success' : 'failed',
              isContractCreation: !tx.to
            })
          }
        }
      }
      return transactions
    } catch (error) {
      throw new BlockchainError(
        error instanceof Error
          ? `Failed to fetch transaction history: ${error.message}`
          : 'Failed to fetch transaction history'
      )
    }
  }
}
