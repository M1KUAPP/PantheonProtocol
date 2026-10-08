import { SECONDS_TO_MILLISECONDS, WEI_PER_ETHER } from '@core/constants/blockchain.constants'
import type { Result } from '@core/interfaces/result.type'
import { executeAsync } from '@core/interfaces/result.type'
import type {
  BlockchainTransaction,
  ITransactionHistoryRepository
} from '@core/interfaces/transaction-history.repository.interface'
import { Address } from '@core/value-objects/address.vo'

/**
 * Display-ready transaction data for the dashboard.
 */
export interface FormattedTransaction {
  readonly hash: string
  readonly recipient: string
  readonly subtext: string
  readonly date: string
  readonly time: string
  readonly status: 'Success' | 'Failed' | 'Pending'
  readonly amount: string
}

/**
 * Use case for fetching and formatting recent wallet transactions.
 *
 * Retrieves blockchain transactions for a wallet address and transforms
 * them into a display-friendly format with human-readable dates, amounts,
 * and transaction types.
 */
export class GetRecentTransactionsUseCase {
  constructor(private readonly transactionHistoryRepository: ITransactionHistoryRepository) {}
  async execute(walletAddress: string, maxBlocks: number = 100): Promise<Result<FormattedTransaction[]>> {
    return executeAsync(async () => {
      const address = Address.create(walletAddress)
      const transactions = await this.transactionHistoryRepository.getRecentTransactions(address, maxBlocks)
      const formattedTransactions = transactions.map((tx: BlockchainTransaction) =>
        this.formatTransaction(tx, walletAddress)
      )
      formattedTransactions.sort((a: FormattedTransaction, b: FormattedTransaction) => {
        const dateA = new Date(`${a.date} ${a.time}`).getTime()
        const dateB = new Date(`${b.date} ${b.time}`).getTime()
        return dateB - dateA
      })
      return formattedTransactions
    })
  }
  private formatTransaction(tx: BlockchainTransaction, userAddress: string): FormattedTransaction {
    const isSender = tx.from.toLowerCase() === userAddress.toLowerCase()
    const recipient = isSender
      ? `To: ${this.formatDisplayAddress(tx.to)}`
      : `From: ${this.formatDisplayAddress(tx.from)}`
    const subtext = tx.isContractCreation ? 'Contract Creation' : isSender ? 'Send' : 'Receive'
    const txDate = new Date(tx.timestamp * SECONDS_TO_MILLISECONDS)
    const date = txDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    const time = txDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    const status = tx.status === 'success' ? 'Success' : tx.status === 'failed' ? 'Failed' : 'Pending'
    const valueInEth = Number(tx.value) / WEI_PER_ETHER
    const prefix = isSender && !tx.isContractCreation ? '-' : '+'
    const amount = `${prefix}${valueInEth.toFixed(2)} ETH`
    return {
      hash: tx.hash,
      recipient,
      subtext,
      date,
      time,
      status,
      amount
    }
  }
  private formatDisplayAddress(address: string | null | undefined): string {
    if (!address) {
      return 'Unknown'
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }
}
