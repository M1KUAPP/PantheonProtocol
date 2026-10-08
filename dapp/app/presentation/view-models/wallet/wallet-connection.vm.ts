/**
 * Wallet connection view model for managing Web3 wallet state.
 *
 * Provides connect/disconnect functionality with confirmation flow
 * and address formatting for display.
 * @module
 */

import { createAppConfig } from '@config/app-config'
import { useWalletUseCases } from '@presentation/providers/app-provider'
import { useWalletState } from '@shared/hooks/use-wallet-state'
import { useCallback, useState } from 'react'

/**
 * Formats a wallet address for display by truncating the middle.
 * @param address - The full wallet address.
 * @param chars - Number of characters to show on each end.
 * @returns The truncated address string.
 */
function formatAddressHelper(address: string, chars: number = 6): string {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/** Internal state interface for wallet connection. */
interface WalletConnectionState {
  readonly address?: `0x${string}`
  readonly isConnected: boolean
  readonly isProperlyConnected: boolean
  readonly isConfirming: boolean
  readonly chainId?: number
  readonly chainName?: string
  readonly isLoading: boolean
  readonly error: string | null
}

/**
 * Hook that manages wallet connection state and actions.
 *
 * Provides connect and disconnect functions with a confirmation step
 * for disconnect, plus address formatting utilities.
 * @returns Wallet state, connection handlers, and format utilities.
 */
export function useWalletConnectionViewModel() {
  const { address, isConnected, chainId, chainName } = useWalletState()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { connect: connectUseCase, disconnect: disconnectUseCase } = useWalletUseCases()
  const appConfig = createAppConfig()
  const isProperlyConnected = isConnected && chainId === appConfig.getNetwork().id
  const connect = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await connectUseCase.execute()
      if (result.success) {
        setIsLoading(false)
        return true
      } else {
        setError(result.error?.message || 'Failed to connect wallet')
        setIsLoading(false)
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [connectUseCase])
  const disconnect = useCallback(async (): Promise<void> => {
    if (isConfirming) {
      try {
        setIsLoading(true)
        await disconnectUseCase.execute()
        setIsConfirming(false)
        setIsLoading(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet'
        setError(errorMessage)
        setIsLoading(false)
      }
    } else {
      setIsConfirming(true)
    }
  }, [isConfirming, disconnectUseCase])
  const formatAddress = useCallback((addr: `0x${string}`): string => {
    return formatAddressHelper(addr)
  }, [])
  const state: WalletConnectionState = {
    address,
    isConnected,
    isProperlyConnected,
    isConfirming,
    chainId,
    chainName,
    isLoading,
    error
  }
  return {
    ...state,
    connect,
    disconnect,
    formatAddress
  }
}
