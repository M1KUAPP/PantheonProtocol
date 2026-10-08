/**
 * Wallet display view model for showing connected wallet information.
 *
 * Provides wallet address display with toggle functionality for
 * showing or hiding the full address for privacy.
 * @module
 */

import { useWalletState } from '@shared/hooks/use-wallet-state'
import { useState } from 'react'

/** Return type for the wallet display view model hook. */
export interface MyWalletsViewModelReturn {
  address?: string
  isConnected: boolean
  displayAddress: string
  isAddressHidden: boolean
  toggleAddressVisibility: () => void
}

/**
 * Hook that manages wallet address display state.
 *
 * Provides the connected wallet address and a toggle for hiding
 * the address for privacy when needed.
 * @returns Wallet state and visibility toggle.
 */
export function useMyWalletsViewModel(): MyWalletsViewModelReturn {
  const { address, isConnected } = useWalletState()
  const [isAddressHidden, setIsAddressHidden] = useState(false)
  const toggleAddressVisibility = () => {
    setIsAddressHidden(!isAddressHidden)
  }
  const displayAddress = address || ''
  return {
    address,
    isConnected,
    displayAddress,
    isAddressHidden,
    toggleAddressVisibility
  }
}
