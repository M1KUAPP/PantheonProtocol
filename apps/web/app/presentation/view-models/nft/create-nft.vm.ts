/**
 * Create NFT view model for minting NFTs from game assets.
 *
 * Orchestrates the minting flow including asset validation,
 * wallet confirmation, and transaction status notifications.
 * @module
 */

import { createAppConfig } from '@config/app-config'
import { UserRejectedError } from '@core/errors/domain-error'
import { useServices, useUseCases } from '@presentation/providers/app-provider'
import { useWalletState } from '@shared/hooks/use-wallet-state'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'

/** Return type for the create NFT view model hook. */
export interface CreateNFTViewModelReturn {
  assetId: string
  isProcessing: boolean
  isProperlyConnected: boolean
  isPending: boolean
  isConfirming: boolean
  setAssetId: (assetId: string) => void
  handleCreateNFT: () => Promise<void>
}

/**
 * Hook that manages the NFT creation/minting flow.
 *
 * Handles asset ID input, wallet connection validation, and the
 * full minting transaction with loading states and notifications.
 * @returns Form state, processing flags, and mint handler.
 */
export function useCreateNFTViewModel(): CreateNFTViewModelReturn {
  const [assetId, setAssetId] = useState('')
  const { address, isConnected, chainId } = useWalletState()
  const appConfig = createAppConfig()
  const isProperlyConnected = isConnected && chainId === appConfig.getNetwork().id
  const useCases = useUseCases()
  const { notification: notificationService } = useServices()
  const loadingToastIdRef = useRef<string | null>(null)
  const mintNFTMutation = useMutation({
    mutationFn: ({ assetId, recipient }: { assetId: string; recipient: string }) =>
      useCases.nft.mintNFTFromAsset.execute({ assetId, recipient }),
    onMutate: () => {
      loadingToastIdRef.current = notificationService.loading('Minting NFT... This may take a moment')
    },
    onSuccess: (result) => {
      if (loadingToastIdRef.current) {
        notificationService.dismiss(loadingToastIdRef.current)
        loadingToastIdRef.current = null
      }
      if (!result.success) {
        if (result.error instanceof UserRejectedError) {
          notificationService.info('Transaction cancelled. No charges were made.')
          return
        }
        notificationService.error(result.error?.message || 'Failed to mint NFT')
        return
      }
      const tokenId = result.value.tokenId.value
      notificationService.success(`NFT Minted Successfully! Token ID: #${tokenId}`, 6000)
      setTimeout(() => {
        notificationService.info('Your NFT is on the blockchain! Check your inventory to see it.', 4000)
      }, 500)
    },
    onError: (error: Error) => {
      if (loadingToastIdRef.current) {
        notificationService.dismiss(loadingToastIdRef.current)
        loadingToastIdRef.current = null
      }
      if (error instanceof UserRejectedError) {
        notificationService.info('Transaction cancelled. No charges were made.')
        return
      }
      const isAssetNotFound = error.message.includes('Failed to fetch asset data')
      if (isAssetNotFound) {
        notificationService.error('Asset not found')
      } else {
        notificationService.error(`Failed to mint NFT: ${error.message}`)
      }
    }
  })
  const handleCreateNFT = async () => {
    if (!assetId.trim()) {
      notificationService.error('Please enter a game asset ID')
      return
    }
    if (!isProperlyConnected || !address) {
      notificationService.error('Please connect your wallet first')
      return
    }
    const assetIdToMint = assetId
    setAssetId('')
    mintNFTMutation.mutate({ assetId: assetIdToMint, recipient: address })
  }
  return {
    assetId,
    isProcessing: mintNFTMutation.isPending,
    isProperlyConnected,
    isPending: mintNFTMutation.isPending,
    isConfirming: mintNFTMutation.isPending,
    setAssetId,
    handleCreateNFT
  }
}
