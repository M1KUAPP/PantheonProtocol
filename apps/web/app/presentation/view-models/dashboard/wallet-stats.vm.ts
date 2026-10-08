/**
 * Wallet statistics view model for displaying financial metrics.
 *
 * Fetches and formats wallet balance, ETH price, gas prices, and
 * transaction counts for display in the dashboard.
 * @module
 */

import { isSuccess } from '@core/interfaces/result.type'
import { useDashboardUseCases } from '@presentation/providers/app-provider'
import { useNetworkGasPrice, useWalletBalance, useWalletState } from '@shared/hooks/use-wallet-state'
import { useCallback, useEffect, useRef, useState } from 'react'
import { formatUnits } from 'viem'

/** Polling interval for ETH price updates in milliseconds. */
const CONVERSION_POLLING_INTERVAL_MS = 10000

/** Maximum number of recent blocks to scan for transaction count. */
const MAX_BLOCKS = 100

/** Gas price threshold (gwei) above which is considered high. */
const GAS_THRESHOLD_HIGH = 50

/** Gas price threshold (gwei) above which is considered medium. */
const GAS_THRESHOLD_MEDIUM = 20

/** Gas price severity level indicator. */
export type GasLevel = 'low' | 'medium' | 'high'

/** Financial statistics for the connected wallet. */
export interface FinanceStats {
  balance: string
  usdValue: string
  gasPrice: string
  gasLevel: GasLevel
  transactionCount: string
  networkName: string
  rawBalanceEth: number
}

/** Return type for the finance view model hook. */
export interface FinanceViewModelReturn {
  stats: FinanceStats
  isLoading: boolean
}

/**
 * Determines the gas level indicator based on gwei price.
 * @param gwei - Current gas price in gwei.
 * @returns The gas level category.
 */
const getGasLevel = (gwei: number): GasLevel => {
  if (gwei > GAS_THRESHOLD_HIGH) return 'high'
  if (gwei > GAS_THRESHOLD_MEDIUM) return 'medium'
  return 'low'
}

/**
 * Hook that provides wallet financial statistics.
 *
 * Fetches ETH balance, USD conversion, gas prices, and transaction count,
 * with periodic polling for price updates.
 * @returns Financial stats and loading state.
 */
export function useFinanceViewModel(): FinanceViewModelReturn {
  const { address, chainName, isConnected } = useWalletState()
  const { balance, isLoading: isBalanceLoading } = useWalletBalance(address)
  const { gasPrice: gasPriceData, isLoading: isGasPriceLoading } = useNetworkGasPrice()
  const { getRecentTransactions, getEthPrice } = useDashboardUseCases()
  const [ethPrice, setEthPrice] = useState<number>(0)
  const [transactionCount, setTransactionCount] = useState<string>('0')
  const [isTxHistoryLoading, setIsTxHistoryLoading] = useState(true)
  const isMounted = useRef(true)
  const fetchEthPrice = useCallback(async () => {
    const result = await getEthPrice.execute()
    if (result.success && isMounted.current) {
      setEthPrice(result.value)
    }
  }, [getEthPrice])
  const fetchTransactions = useCallback(async () => {
    if (!isConnected || !address) {
      setTransactionCount('0')
      setIsTxHistoryLoading(false)
      return
    }
    try {
      setIsTxHistoryLoading(true)
      const result = await getRecentTransactions.execute(address, MAX_BLOCKS)
      if (isSuccess(result) && isMounted.current) {
        setTransactionCount(result.value.length.toString())
      } else {
        setTransactionCount('0')
      }
    } catch {
      setTransactionCount('0')
    } finally {
      if (isMounted.current) {
        setIsTxHistoryLoading(false)
      }
    }
  }, [address, isConnected, getRecentTransactions])
  useEffect(() => {
    isMounted.current = true
    fetchTransactions()
    fetchEthPrice()
    const intervalId = setInterval(() => {
      fetchEthPrice()
    }, CONVERSION_POLLING_INTERVAL_MS)
    return () => {
      isMounted.current = false
      clearInterval(intervalId)
    }
  }, [fetchTransactions, fetchEthPrice])
  const rawBalanceEth = !isConnected || (!isBalanceLoading && balance) ? parseFloat(balance?.formatted || '0') : 0
  const ethBalance = rawBalanceEth.toFixed(4)
  const usdValue =
    !isConnected || (!isBalanceLoading && balance)
      ? `$${(rawBalanceEth * ethPrice).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
      : '$0.00'
  const networkName = chainName ?? 'Unknown'
  const gasPriceInGwei =
    !isConnected || (!isGasPriceLoading && gasPriceData) ? parseFloat(formatUnits(gasPriceData || BigInt(0), 9)) : 0
  const formattedGasPrice = gasPriceInGwei.toFixed(0)
  const gasLevel = getGasLevel(gasPriceInGwei)
  const stats: FinanceStats = {
    balance: ethBalance,
    usdValue,
    gasPrice: formattedGasPrice,
    gasLevel,
    transactionCount: !isConnected || !isTxHistoryLoading ? transactionCount : '0',
    networkName,
    rawBalanceEth
  }
  return {
    stats,
    isLoading: isBalanceLoading || isGasPriceLoading || isTxHistoryLoading
  }
}
