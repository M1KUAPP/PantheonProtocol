/**
 * @module ConnectWallet
 * Wallet connection component for Web3 authentication and account management.
 * Provides wallet connect/disconnect functionality and navigation to the user dashboard.
 */

import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { Btn, ButtonContainer, DashboardButton } from '@presentation/components/wallet/connect-wallet.styles'
import { useWalletConnectionViewModel } from '@presentation/view-models/wallet/wallet-connection.vm'
import { useNavigate } from 'react-router'

/**
 * Wallet connection button component that handles Web3 wallet authentication.
 * Displays connection status, wallet address, and provides access to the dashboard when connected.
 */
export const ConnectWallet = () => {
  const navigate = useNavigate()
  const { address, isProperlyConnected, isConfirming, connect, disconnect, formatAddress } =
    useWalletConnectionViewModel()
  const handleWalletClick = () => {
    if (isProperlyConnected) {
      disconnect()
    } else {
      connect()
    }
  }
  const handleDashboardClick = () => {
    navigate('/dashboard')
  }
  const getButtonText = () => {
    if (!isProperlyConnected) {
      return 'Connect Wallet'
    }
    if (isConfirming) {
      return 'Logout'
    }
    return address ? formatAddress(address) : 'Connected'
  }
  return (
    <ButtonContainer>
      <DashboardButton onClick={handleDashboardClick} $isVisible={isProperlyConnected} title="Go to Dashboard">
        <Squares2X2Icon width={25} height={25} />
      </DashboardButton>
      <Btn onClick={handleWalletClick} $isConfirming={isConfirming}>
        {getButtonText()}
      </Btn>
    </ButtonContainer>
  )
}
