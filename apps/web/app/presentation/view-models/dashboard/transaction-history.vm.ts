/**
 * Transaction history view model for displaying recent blockchain transactions.
 *
 * Fetches and paginates the user's transaction history with modal support
 * for viewing detailed transaction lists.
 * @module
 */

import type { FormattedTransaction } from '@application/use-cases/dashboard/get-recent-transactions.uc'
import { isSuccess } from '@core/interfaces/result.type'
import { useDashboardUseCases } from '@presentation/providers/app-provider'
import { useWalletState } from '@shared/hooks/use-wallet-state'
import { useCallback, useEffect, useMemo, useState } from 'react'

/** Number of transactions displayed per page. */
const ROWS_PER_PAGE = 5

/** Maximum number of recent blocks to scan for transactions. */
const MAX_BLOCKS = 100

/** Return type for the transaction history view model hook. */
export interface TransactionHistoryViewModelReturn {
  transactions: FormattedTransaction[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  paginatedData: FormattedTransaction[]
  isModalOpen: boolean
  setCurrentPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  openModal: () => void
  closeModal: () => void
}

/**
 * Hook that manages transaction history state and pagination.
 *
 * Fetches transactions from the blockchain, provides pagination controls,
 * and manages a modal for viewing the full transaction list.
 * @returns Transaction data, pagination state, and modal controls.
 */
export function useTransactionHistoryViewModel(): TransactionHistoryViewModelReturn {
  const { address, isConnected } = useWalletState()
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { getRecentTransactions } = useDashboardUseCases()
  const fetchTransactions = useCallback(async () => {
    if (!isConnected || !address) {
      setTransactions([])
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      const result = await getRecentTransactions.execute(address, MAX_BLOCKS)
      if (isSuccess(result)) {
        setTransactions(result.value)
      } else {
        setTransactions([])
      }
    } catch (err) {
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected, getRecentTransactions])
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])
  const totalPages = Math.max(1, Math.ceil(transactions.length / ROWS_PER_PAGE))
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE
    const endIndex = startIndex + ROWS_PER_PAGE
    return transactions.slice(startIndex, endIndex)
  }, [currentPage, transactions])
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  return {
    transactions,
    isLoading,
    currentPage,
    totalPages,
    paginatedData,
    isModalOpen,
    setCurrentPage,
    nextPage,
    prevPage,
    openModal,
    closeModal
  }
}
