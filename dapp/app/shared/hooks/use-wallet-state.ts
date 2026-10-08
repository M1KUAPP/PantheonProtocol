/**
 * Wallet state hooks for Web3 integration.
 *
 * Provides React hooks for accessing wallet connection state,
 * balance information, and network gas prices via wagmi.
 * @module
 */

import { useAccount, useBalance, useGasPrice } from 'wagmi'

/** Current wallet connection state. */
export interface WalletState {
  readonly address?: `0x${string}`
  readonly isConnected: boolean
  readonly chainId?: number
  readonly chainName?: string
}

/** Wallet balance information with loading state. */
export interface WalletBalanceState {
  readonly balance?: {
    readonly formatted: string
    readonly symbol: string
    readonly value: bigint
  }
  readonly isLoading: boolean
}

/** Network gas price information with loading state. */
export interface GasPriceState {
  readonly gasPrice?: bigint
  readonly isLoading: boolean
}

/**
 * Hook to access current wallet connection state.
 * @returns Wallet address, connection status, and chain information.
 */
export function useWalletState(): WalletState {
  const { address, isConnected, chain } = useAccount()
  return {
    address,
    isConnected,
    chainId: chain?.id,
    chainName: chain?.name
  }
}

/**
 * Hook to fetch wallet balance for an address.
 * @param address - Ethereum address to query balance for.
 * @returns Balance data with formatted value, symbol, and loading state.
 */
export function useWalletBalance(address?: `0x${string}`): WalletBalanceState {
  const { data, isLoading } = useBalance({ address })
  return {
    balance: data
      ? {
          formatted: data.formatted,
          symbol: data.symbol,
          value: data.value
        }
      : undefined,
    isLoading
  }
}

/**
 * Hook to fetch current network gas price.
 * @returns Current gas price in wei with loading state.
 */
export function useNetworkGasPrice(): GasPriceState {
  const { data, isLoading } = useGasPrice()
  return {
    gasPrice: data,
    isLoading
  }
}
