/**
 * Client-side dependency injection container factory.
 *
 * Creates and manages the DI container for the browser environment,
 * wiring up repositories, services, and use cases for the application.
 * @module
 */

import type {
  DashboardUseCases,
  DIContainer,
  DIContainerConfig,
  InventoryUseCases,
  MarketplaceUseCases,
  NFTUseCases,
  ServiceContainer,
  UseCaseContainer,
  WalletUseCases
} from '@application/interfaces/di-container.interface'
import type { INotificationService } from '@application/services/interfaces/notification.service.interface'
import {
  DashboardUseCaseFactory,
  InventoryUseCaseFactory,
  MarketplaceUseCaseFactory,
  NFTUseCaseFactory,
  WalletUseCaseFactory
} from '@application/use-case-factory'
import { ConfigurationError } from '@core/errors/domain-error'
import type { RepositoryContainer } from '@core/interfaces/repository-container.interface'
import { createRepositories } from '@infrastructure/repository-factory'

export type {
  DashboardUseCases,
  DIContainer,
  DIContainerConfig,
  InventoryUseCases,
  MarketplaceUseCases,
  NFTUseCases,
  ServiceContainer,
  UseCaseContainer,
  WalletUseCases
}

/** Services required for DI container initialization. */
export interface DIContainerServices {
  readonly notification: INotificationService
}

/**
 * Creates a new DI container with all dependencies wired up.
 * @param config - Configuration including app config and wagmi config.
 * @param injectedServices - External services to inject into the container.
 * @returns Fully configured DI container with repositories, services, and use cases.
 */
export function createDIContainer(config: DIContainerConfig, injectedServices: DIContainerServices): DIContainer {
  const { appConfig, wagmiConfig, repositoryOverrides, serviceOverrides } = config
  const repositories: RepositoryContainer = {
    ...createRepositories({ appConfig, wagmiConfig }),
    ...repositoryOverrides
  }
  const services: ServiceContainer = {
    notification: injectedServices.notification,
    ...serviceOverrides
  }
  const nftUseCases: NFTUseCases = {
    mintNFTFromAsset: NFTUseCaseFactory.createMintNFTFromAsset(repositories),
    getUserNFTs: NFTUseCaseFactory.createGetUserNFTs(repositories),
    enrichNFTMetadata: NFTUseCaseFactory.createEnrichNFTMetadata(repositories)
  }
  const inventoryUseCases: InventoryUseCases = {
    exportNFT: InventoryUseCaseFactory.createExportNFT(repositories),
    getUserInventory: InventoryUseCaseFactory.createGetUserInventory(repositories),
    syncExportToGame: InventoryUseCaseFactory.createSyncExportToGame(repositories)
  }
  const marketplaceUseCases: MarketplaceUseCases = {
    listNFTWithApproval: MarketplaceUseCaseFactory.createListNFTWithApproval(repositories),
    buyNFT: MarketplaceUseCaseFactory.createBuyNFT(repositories),
    cancelListing: MarketplaceUseCaseFactory.createCancelListing(repositories),
    getListings: MarketplaceUseCaseFactory.createGetListings(repositories),
    getListingDetails: MarketplaceUseCaseFactory.createGetListingDetails(repositories),
    filterMarketplaceListings: MarketplaceUseCaseFactory.createFilterMarketplaceListings(),
    sortMarketplaceListings: MarketplaceUseCaseFactory.createSortMarketplaceListings(),
    extractMarketplaceFilters: MarketplaceUseCaseFactory.createExtractMarketplaceFilters()
  }
  const walletUseCases: WalletUseCases = {
    connect: WalletUseCaseFactory.createConnect(repositories),
    disconnect: WalletUseCaseFactory.createDisconnect(repositories)
  }
  const dashboardUseCases: DashboardUseCases = {
    getStats: DashboardUseCaseFactory.createGetStats(repositories),
    getRecentTransactions: DashboardUseCaseFactory.createGetRecentTransactions(repositories),
    getEthPrice: DashboardUseCaseFactory.createGetEthPrice(repositories)
  }
  const useCases: UseCaseContainer = {
    nft: nftUseCases,
    inventory: inventoryUseCases,
    marketplace: marketplaceUseCases,
    wallet: walletUseCases,
    dashboard: dashboardUseCases
  }
  return {
    repositories,
    useCases,
    services
  }
}

/** Singleton instance of the DI container. */
let container: DIContainer | null = null

/**
 * Gets or creates the singleton DI container.
 * @param config - Configuration required on first call.
 * @param services - Services required on first call.
 * @returns The singleton DI container instance.
 * @throws ConfigurationError if called without config/services before initialization.
 */
export function getDIContainer(config?: DIContainerConfig, services?: DIContainerServices): DIContainer {
  if (!container) {
    if (!config || !services) {
      throw new ConfigurationError(
        'DI container not initialized. Provide config and services on first call to getDIContainer().'
      )
    }
    container = createDIContainer(config, services)
  }
  return container
}
