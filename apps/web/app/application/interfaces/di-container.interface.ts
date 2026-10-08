/**
 * Dependency Injection Container interfaces for the application layer.
 *
 * Defines the structure of use case containers, service containers,
 * and the main DI container that wires together all application dependencies.
 * @module
 */

import type { INotificationService } from '@application/services/interfaces/notification.service.interface'
import type { GetEthPriceUseCase } from '@application/use-cases/dashboard/get-eth-price.uc'
import type { GetRecentTransactionsUseCase } from '@application/use-cases/dashboard/get-recent-transactions.uc'
import type { GetWalletStatsUseCase } from '@application/use-cases/dashboard/get-wallet-stats.uc'
import type { ExportNFTUseCase } from '@application/use-cases/inventory/export-nft.uc'
import type { GetUserInventoryUseCase } from '@application/use-cases/inventory/get-user-inventory.uc'
import type { SyncExportToGameUseCase } from '@application/use-cases/inventory/sync-export-to-game.uc'
import type { BuyNFTUseCase } from '@application/use-cases/marketplace/buy-nft.uc'
import type { CancelListingUseCase } from '@application/use-cases/marketplace/cancel-listing.uc'
import type { ExtractMarketplaceFiltersUseCase } from '@application/use-cases/marketplace/extract-marketplace-filters.uc'
import type { FilterMarketplaceListingsUseCase } from '@application/use-cases/marketplace/filter-marketplace-listings.uc'
import type { GetListingDetailsUseCase } from '@application/use-cases/marketplace/get-listing-details.uc'
import type { GetMarketplaceListingsUseCase } from '@application/use-cases/marketplace/get-marketplace-listings.uc'
import type { ListNFTWithApprovalUseCase } from '@application/use-cases/marketplace/list-nft-with-approval.uc'
import type { SortMarketplaceListingsUseCase } from '@application/use-cases/marketplace/sort-marketplace-listings.uc'
import type { EnrichNFTMetadataUseCase } from '@application/use-cases/nft/enrich-nft-metadata.uc'
import type { GetUserNFTsUseCase } from '@application/use-cases/nft/get-user-nfts.uc'
import type { MintNFTFromAssetUseCase } from '@application/use-cases/nft/mint-nft-from-asset.uc'
import type { ConnectWalletUseCase } from '@application/use-cases/wallet/connect-wallet.uc'
import type { DisconnectWalletUseCase } from '@application/use-cases/wallet/disconnect-wallet.uc'
import type { AppConfig } from '@config/app-config'
import type { RepositoryContainer } from '@core/interfaces/repository-container.interface'
import type { Config } from '@wagmi/core'

/**
 * Container for NFT-related use cases.
 */
export interface NFTUseCases {
  readonly mintNFTFromAsset: MintNFTFromAssetUseCase
  readonly getUserNFTs: GetUserNFTsUseCase
  readonly enrichNFTMetadata: EnrichNFTMetadataUseCase
}

/**
 * Container for inventory management use cases.
 */
export interface InventoryUseCases {
  readonly exportNFT: ExportNFTUseCase
  readonly getUserInventory: GetUserInventoryUseCase
  readonly syncExportToGame: SyncExportToGameUseCase
}

/**
 * Container for marketplace trading use cases.
 */
export interface MarketplaceUseCases {
  readonly listNFTWithApproval: ListNFTWithApprovalUseCase
  readonly buyNFT: BuyNFTUseCase
  readonly cancelListing: CancelListingUseCase
  readonly getListings: GetMarketplaceListingsUseCase
  readonly getListingDetails: GetListingDetailsUseCase
  readonly filterMarketplaceListings: FilterMarketplaceListingsUseCase
  readonly sortMarketplaceListings: SortMarketplaceListingsUseCase
  readonly extractMarketplaceFilters: ExtractMarketplaceFiltersUseCase
}

/**
 * Container for wallet connection use cases.
 */
export interface WalletUseCases {
  readonly connect: ConnectWalletUseCase
  readonly disconnect: DisconnectWalletUseCase
}

/**
 * Container for dashboard statistics use cases.
 */
export interface DashboardUseCases {
  readonly getStats: GetWalletStatsUseCase
  readonly getRecentTransactions: GetRecentTransactionsUseCase
  readonly getEthPrice: GetEthPriceUseCase
}

/**
 * Main container grouping all use case categories.
 */
export interface UseCaseContainer {
  readonly nft: NFTUseCases
  readonly inventory: InventoryUseCases
  readonly marketplace: MarketplaceUseCases
  readonly wallet: WalletUseCases
  readonly dashboard: DashboardUseCases
}

/**
 * Container for application services (non-use-case dependencies).
 */
export interface ServiceContainer {
  readonly notification: INotificationService
}

/**
 * Root dependency injection container.
 *
 * Provides access to all repositories, use cases, and services
 * needed by the application. Created at application startup.
 */
export interface DIContainer {
  readonly repositories: RepositoryContainer
  readonly useCases: UseCaseContainer
  readonly services: ServiceContainer
}

/**
 * Configuration options for creating the DI container.
 */
export interface DIContainerConfig {
  readonly appConfig: AppConfig
  readonly wagmiConfig: Config
  readonly repositoryOverrides?: Partial<RepositoryContainer>
  readonly serviceOverrides?: Partial<ServiceContainer>
}
