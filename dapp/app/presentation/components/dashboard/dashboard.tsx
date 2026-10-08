/**
 * @module Dashboard
 * Main dashboard page component that orchestrates all dashboard sections.
 * Displays wallet information, NFT inventory, transaction history, and financial stats.
 */

import { DashboardGrid, MainContent, SideContent } from '@presentation/components/dashboard/dashboard-layout.styles'
import {
  ConnectPrompt,
  ConnectPromptText,
  EmptyStateIcon,
  LoadingSpinner,
  LoadingText,
  PageLoadingContainer
} from '@presentation/components/dashboard/dashboard.styles'
import { RecentlyAddedNFTs } from '@presentation/components/dashboard/recently-added-nfts'
import { TransactionHistory } from '@presentation/components/dashboard/transaction-history'
import { WalletDisplay } from '@presentation/components/dashboard/wallet-display'
import { WalletStats } from '@presentation/components/dashboard/wallet-stats'
import { useDashboardViewModel } from '@presentation/view-models/dashboard/dashboard.vm'

/**
 * Main dashboard container that displays user wallet stats, NFTs, and transaction history.
 * Shows connection prompt if wallet is not connected, and loading state while fetching data.
 */
export const Dashboard = () => {
  const { isProperlyConnected, isPageLoading, inventory, inventoryError, stats } = useDashboardViewModel()
  if (!isProperlyConnected) {
    return (
      <ConnectPrompt>
        <EmptyStateIcon>🔐</EmptyStateIcon>
        <ConnectPromptText>Please connect your wallet to view your dashboard</ConnectPromptText>
      </ConnectPrompt>
    )
  }
  if (isPageLoading) {
    return (
      <PageLoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading your stats...</LoadingText>
      </PageLoadingContainer>
    )
  }
  return (
    <DashboardGrid>
      <MainContent>
        <RecentlyAddedNFTs inventory={inventory} error={inventoryError} />
        <TransactionHistory />
      </MainContent>
      <SideContent>
        <WalletDisplay />
        <WalletStats stats={stats} />
      </SideContent>
    </DashboardGrid>
  )
}
