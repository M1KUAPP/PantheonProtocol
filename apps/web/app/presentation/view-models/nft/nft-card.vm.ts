/**
 * NFT card view model for individual NFT actions.
 *
 * Manages export, listing, and cancel operations for a single NFT,
 * with wallet transaction handling and status notifications.
 * @module
 */

import { ContractName, createAppConfig } from '@config/app-config'
import type { NFTMetadata } from '@core/entities/nft.entity'
import { UserRejectedError } from '@core/errors/domain-error'
import { useServices, useUseCases } from '@presentation/providers/app-provider'
import { useWalletState } from '@shared/hooks/use-wallet-state'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'

/** Props for the NFT card view model hook. */
interface NFTCardViewModelProps {
  tokenId: number
  listingId?: number
  metadata?: NFTMetadata
  onActionComplete?: () => void
}

/** Return type for the NFT card view model hook. */
interface NFTCardViewModelReturn {
  showListInput: boolean
  priceInput: string
  isPending: boolean
  hasListing: boolean
  handleExport: () => Promise<void>
  handleList: () => Promise<void>
  handleCancel: () => Promise<void>
  setShowListInput: (show: boolean) => void
  setPriceInput: (price: string) => void
}

/**
 * Hook that manages NFT card actions for a single NFT.
 *
 * Provides handlers for exporting to game, listing on marketplace,
 * and cancelling existing listings with transaction management.
 * @param props - The NFT properties including tokenId and metadata.
 * @returns Action handlers and UI state for the NFT card.
 */
export function useNFTCardViewModel({
  tokenId,
  listingId,
  metadata,
  onActionComplete
}: NFTCardViewModelProps): NFTCardViewModelReturn {
  const { address: walletAddress } = useWalletState()
  const [showListInput, setShowListInput] = useState(false)
  const [priceInput, setPriceInput] = useState('')
  const toastIdRef = useRef<string | null>(null)
  const appConfig = createAppConfig()
  const exportManagerAddr = appConfig.getContractAddress(ContractName.EXPORT_MANAGER)
  const marketplaceAddr = appConfig.getContractAddress(ContractName.MARKETPLACE)
  const useCases = useUseCases()
  const { notification: notificationService } = useServices()
  const dismissToast = () => {
    if (toastIdRef.current) {
      notificationService.dismiss(toastIdRef.current)
      toastIdRef.current = null
    }
  }
  const exportNFTMutation = useMutation({
    mutationFn: () =>
      useCases.inventory.exportNFT.execute({
        tokenId,
        userAddress: walletAddress!,
        exportManagerAddress: exportManagerAddr,
        assetId: metadata?.uid
      }),
    onMutate: () => {
      const toastId = notificationService.loading('Exporting NFT... Please confirm in your wallet')
      toastIdRef.current = toastId
    },
    onSuccess: async (result) => {
      dismissToast()
      if (!result.success) {
        if (result.error instanceof UserRejectedError) {
          notificationService.info('Export cancelled. Your NFT remains in your inventory.')
          return
        }
        notificationService.error(result.error?.message || 'Failed to export NFT')
        return
      }
      notificationService.success('NFT successfully exported!')
      if (metadata && result.value.auth) {
        const syncResult = await useCases.inventory.syncExportToGame.execute({
          uid: metadata.uid,
          tokenId: Number(tokenId),
          auth: result.value.auth,
          name: metadata.name,
          description: metadata.description,
          item_type: metadata.item_type,
          rarity: metadata.rarity,
          imagePath: metadata.image_path,
          attributes: metadata.attributes.map((attr) => ({
            trait_type: attr.trait_type,
            value: typeof attr.value === 'boolean' ? String(attr.value) : attr.value
          }))
        })
        if (!syncResult.success) {
          notificationService.error('NFT exported but database sync failed')
        }
      }
      onActionComplete?.()
    },
    onError: (error: Error) => {
      dismissToast()
      if (error instanceof UserRejectedError) {
        notificationService.info('Export cancelled. Your NFT remains in your inventory.')
        return
      }
      notificationService.error(`Export failed: ${error.message}`)
    }
  })
  const listNFTMutation = useMutation({
    mutationFn: () =>
      useCases.marketplace.listNFTWithApproval.execute({
        tokenId,
        priceInEther: priceInput,
        seller: walletAddress!,
        marketplaceAddress: marketplaceAddr
      }),
    onMutate: () => {
      const toastId = notificationService.loading('Listing NFT for sale... Please confirm in your wallet')
      toastIdRef.current = toastId
    },
    onSuccess: (result) => {
      dismissToast()
      if (!result.success) {
        if (result.error instanceof UserRejectedError) {
          notificationService.info('Listing cancelled. No changes were made.')
          return
        }
        notificationService.error(result.error?.message || 'Failed to list NFT')
        return
      }
      notificationService.success('NFT successfully listed for sale!')
      setShowListInput(false)
      setPriceInput('')
      onActionComplete?.()
    },
    onError: (error: Error) => {
      dismissToast()
      if (error instanceof UserRejectedError) {
        notificationService.info('Listing cancelled. No changes were made.')
        return
      }
      notificationService.error(`Listing failed: ${error.message}`)
    }
  })
  const cancelListingMutation = useMutation({
    mutationFn: () =>
      useCases.marketplace.cancelListing.execute({
        listingId: listingId!,
        sellerAddress: walletAddress!
      }),
    onMutate: () => {
      const toastId = notificationService.loading('Cancelling listing... Please confirm in your wallet')
      toastIdRef.current = toastId
    },
    onSuccess: (result) => {
      dismissToast()
      if (!result.success) {
        if (result.error instanceof UserRejectedError) {
          notificationService.info('Cancellation aborted. Listing remains active.')
          return
        }
        notificationService.error(result.error?.message || 'Failed to cancel listing')
        return
      }
      notificationService.success('Listing successfully cancelled!')
      onActionComplete?.()
    },
    onError: (error: Error) => {
      dismissToast()
      if (error instanceof UserRejectedError) {
        notificationService.info('Cancellation aborted. Listing remains active.')
        return
      }
      notificationService.error(`Cancel failed: ${error.message}`)
    }
  })
  const handleExport = async () => {
    if (!walletAddress) {
      notificationService.error('Please connect your wallet')
      return
    }
    exportNFTMutation.mutate()
  }
  const handleList = async () => {
    if (!walletAddress) {
      notificationService.error('Please connect your wallet')
      return
    }
    if (!priceInput || parseFloat(priceInput) <= 0) {
      notificationService.error('Please enter a valid price')
      return
    }
    listNFTMutation.mutate()
  }
  const handleCancel = async () => {
    if (!listingId) {
      notificationService.error('No listing ID found')
      return
    }
    cancelListingMutation.mutate()
  }
  const isPending = exportNFTMutation.isPending || listNFTMutation.isPending || cancelListingMutation.isPending
  const hasListing = !!listingId
  return {
    showListInput,
    priceInput,
    isPending,
    hasListing,
    handleExport,
    handleList,
    handleCancel,
    setShowListInput,
    setPriceInput
  }
}
