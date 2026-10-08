/**
 * Inventory view model for managing the user's NFT collection.
 *
 * Fetches and displays all NFTs owned by the connected wallet,
 * including listing status and export state for each item.
 * @module
 */

import { createAppConfig } from '@config/app-config'
import type { NFTMetadata } from '@core/entities/nft.entity'
import { isSuccess } from '@core/interfaces/result.type'
import { useUseCases } from '@presentation/providers/app-provider'
import { useWalletState } from '@shared/hooks/use-wallet-state'
import { useCallback, useEffect, useState } from 'react'

/** Represents an NFT item in the user's inventory with display properties. */
export interface InventoryNFTItem {
  tokenId: number
  name: string
  description: string
  imageUrl: string
  tokenURI: string
  assetId?: number
  owner: string
  isListed: boolean
  listingId?: number
  listingPrice?: bigint
  formattedListingPrice?: string
  isLocked: boolean
  metadata?: NFTMetadata
}

/** Summary statistics for the user's NFT inventory. */
export interface InventoryStats {
  total: number
  exported: number
  listed: number
}

/** Return type for the inventory view model hook. */
export interface InventoryViewModelReturn {
  isProperlyConnected: boolean
  isLoading: boolean
  inventory: InventoryNFTItem[]
  stats: InventoryStats
  error: string | null
  handleActionComplete: () => void
}

/**
 * Hook that manages the inventory page state.
 *
 * Fetches NFTs from the blockchain, tracks listing and export status,
 * and provides a callback to refresh after actions complete.
 * @returns Inventory data, stats, loading state, and action handlers.
 */
export function useInventoryViewModel(): InventoryViewModelReturn {
  const { address, isConnected, chainId } = useWalletState()
  const appConfig = createAppConfig()
  const isProperlyConnected = isConnected && chainId === appConfig.getNetwork().id
  const useCases = useUseCases()
  const [inventory, setInventory] = useState<InventoryNFTItem[]>([])
  const [stats, setStats] = useState<InventoryStats>({ total: 0, exported: 0, listed: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchInventory = useCallback(async () => {
    if (!isConnected || !address) {
      setInventory([])
      setStats({ total: 0, exported: 0, listed: 0 })
      setIsLoading(false)
      setError(null)
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      const result = await useCases.inventory.getUserInventory.execute(address)
      if (isSuccess(result)) {
        setInventory(result.value.inventory)
        setStats(result.value.stats)
      } else {
        setError('Failed to fetch inventory')
        setInventory([])
        setStats({ total: 0, exported: 0, listed: 0 })
      }
    } catch {
      setError('An unexpected error occurred while fetching inventory')
      setInventory([])
      setStats({ total: 0, exported: 0, listed: 0 })
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected, useCases.inventory.getUserInventory])
  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])
  const handleActionComplete = () => {
    fetchInventory()
  }
  return {
    isProperlyConnected,
    isLoading,
    inventory,
    stats,
    error,
    handleActionComplete
  }
}
