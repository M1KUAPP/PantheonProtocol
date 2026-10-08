/**
 * Dashboard view model for orchestrating the main dashboard data.
 *
 * Combines wallet connection state, NFT inventory, and financial stats
 * to provide a unified view of the user's dashboard.
 * @module
 */

import type { EnrichedNFTDisplayItem } from '@application/use-cases/nft/enrich-nft-metadata.uc'
import { createAppConfig } from '@config/app-config'
import { isFailure, isSuccess } from '@core/interfaces/result.type'
import { useNFTUseCases } from '@presentation/providers/app-provider'
import { useFinanceViewModel } from '@presentation/view-models/dashboard/wallet-stats.vm'
import { useWalletState } from '@shared/hooks/use-wallet-state'
import { useEffect, useState } from 'react'

/** Re-export for convenience in dashboard context. */
export type { EnrichedNFTDisplayItem as RecentlyAddedNFTDisplayItem }

/**
 * Hook that provides dashboard state and data.
 *
 * Fetches and enriches the user's NFT inventory, combines it with
 * financial statistics, and tracks loading states for the full page.
 * @returns Dashboard state including inventory, stats, and loading indicators.
 */
export function useDashboardViewModel() {
  const [inventory, setInventory] = useState<EnrichedNFTDisplayItem[]>([])
  const [isInventoryLoading, setIsInventoryLoading] = useState(true)
  const [inventoryError, setInventoryError] = useState<string | null>(null)
  const { address, isConnected, chainId } = useWalletState()
  const appConfig = createAppConfig()
  const isProperlyConnected = isConnected && chainId === appConfig.getNetwork().id
  const { getUserNFTs, enrichNFTMetadata } = useNFTUseCases()
  useEffect(() => {
    const fetchInventory = async () => {
      if (!isConnected || !address) {
        setInventory([])
        setIsInventoryLoading(false)
        setInventoryError(null)
        return
      }
      setIsInventoryLoading(true)
      setInventoryError(null)
      try {
        const result = await getUserNFTs.execute(address)
        if (isSuccess(result)) {
          const enrichedResult = await enrichNFTMetadata.executeMany(result.value)
          if (isSuccess(enrichedResult)) {
            setInventory(enrichedResult.value)
          } else {
            setInventoryError('Failed to enrich NFT metadata')
            setInventory([])
          }
        } else if (isFailure(result)) {
          setInventoryError('Failed to fetch NFT inventory')
          setInventory([])
        }
      } catch {
        setInventoryError('An unexpected error occurred while fetching inventory')
        setInventory([])
      } finally {
        setIsInventoryLoading(false)
      }
    }
    fetchInventory()
  }, [address, isConnected, getUserNFTs, enrichNFTMetadata])
  const { stats, isLoading: isStatsLoading } = useFinanceViewModel()
  const isPageLoading = isInventoryLoading || isStatsLoading
  return {
    isProperlyConnected,
    isPageLoading,
    inventory,
    inventoryError,
    stats
  }
}
