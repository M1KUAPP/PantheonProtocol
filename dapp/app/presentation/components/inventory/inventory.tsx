/**
 * @module Inventory
 * Main inventory container component that displays user's NFT collection with statistics.
 * Handles wallet connection state, loading states, and empty states.
 */

import {
  ConnectPrompt,
  ConnectPromptText,
  Container,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateTitle,
  GridContainer,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  Section,
  StatCard,
  StatLabel,
  StatsContainer,
  StatValue
} from '@presentation/components/inventory/inventory.styles'
import { InventoryNFTCard } from '@presentation/components/inventory/nft-card'
import { useInventoryViewModel } from '@presentation/view-models/inventory/inventory.vm'

/**
 * Displays the user's NFT inventory with statistics and grid layout.
 * Shows appropriate states for disconnected wallet, loading, or empty inventory.
 */
export const Inventory = () => {
  const { isProperlyConnected, isLoading, inventory, stats, handleActionComplete } = useInventoryViewModel()
  return (
    <Section>
      <Container>
        {!isProperlyConnected ? (
          <ConnectPrompt>
            <EmptyStateIcon>🔐</EmptyStateIcon>
            <ConnectPromptText>Please connect your wallet to view your inventory</ConnectPromptText>
          </ConnectPrompt>
        ) : isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading your NFTs...</LoadingText>
          </LoadingContainer>
        ) : inventory.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>📦</EmptyStateIcon>
            <EmptyStateTitle>No NFTs Found</EmptyStateTitle>
            <EmptyStateText>You don't have any NFTs yet. Create your first NFT to get started!</EmptyStateText>
          </EmptyState>
        ) : (
          <>
            <StatsContainer>
              <StatCard>
                <StatValue>{stats.total}</StatValue>
                <StatLabel>Total NFTs</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.exported}</StatValue>
                <StatLabel>Exported</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.listed}</StatValue>
                <StatLabel>Listed for Sale</StatLabel>
              </StatCard>
            </StatsContainer>
            <GridContainer>
              {inventory.map((nft) => (
                <InventoryNFTCard
                  key={nft.tokenId}
                  tokenId={nft.tokenId}
                  name={nft.name}
                  imageUrl={nft.imageUrl}
                  assetId={nft.assetId}
                  owner={nft.owner}
                  listingId={nft.listingId}
                  listingPrice={nft.listingPrice}
                  formattedListingPrice={nft.formattedListingPrice}
                  isLocked={nft.isLocked}
                  metadata={nft.metadata}
                  onActionComplete={handleActionComplete}
                />
              ))}
            </GridContainer>
          </>
        )}
      </Container>
    </Section>
  )
}
