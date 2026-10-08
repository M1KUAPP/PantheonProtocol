/**
 * Use case factories for creating properly-wired use case instances.
 *
 * These factories encapsulate the dependency injection logic for each
 * use case category, ensuring consistent instantiation throughout the app.
 * @module
 */

import { GetEthPriceUseCase } from '@application/use-cases/dashboard/get-eth-price.uc'
import { GetRecentTransactionsUseCase } from '@application/use-cases/dashboard/get-recent-transactions.uc'
import { GetWalletStatsUseCase } from '@application/use-cases/dashboard/get-wallet-stats.uc'
import { ExportNFTUseCase } from '@application/use-cases/inventory/export-nft.uc'
import { GetUserInventoryUseCase } from '@application/use-cases/inventory/get-user-inventory.uc'
import { SyncExportToGameUseCase } from '@application/use-cases/inventory/sync-export-to-game.uc'
import { BuyNFTUseCase } from '@application/use-cases/marketplace/buy-nft.uc'
import { CancelListingUseCase } from '@application/use-cases/marketplace/cancel-listing.uc'
import { ExtractMarketplaceFiltersUseCase } from '@application/use-cases/marketplace/extract-marketplace-filters.uc'
import { FilterMarketplaceListingsUseCase } from '@application/use-cases/marketplace/filter-marketplace-listings.uc'
import { GetListingDetailsUseCase } from '@application/use-cases/marketplace/get-listing-details.uc'
import { GetMarketplaceListingsUseCase } from '@application/use-cases/marketplace/get-marketplace-listings.uc'
import { ListNFTWithApprovalUseCase } from '@application/use-cases/marketplace/list-nft-with-approval.uc'
import { SortMarketplaceListingsUseCase } from '@application/use-cases/marketplace/sort-marketplace-listings.uc'
import { EnrichNFTMetadataUseCase } from '@application/use-cases/nft/enrich-nft-metadata.uc'
import { GetUserNFTsUseCase } from '@application/use-cases/nft/get-user-nfts.uc'
import { MintNFTFromAssetUseCase } from '@application/use-cases/nft/mint-nft-from-asset.uc'
import { ConnectWalletUseCase } from '@application/use-cases/wallet/connect-wallet.uc'
import { DisconnectWalletUseCase } from '@application/use-cases/wallet/disconnect-wallet.uc'
import type { RepositoryContainer } from '@core/interfaces/repository-container.interface'

/**
 * Factory for NFT-related use cases (minting, querying, metadata).
 */
export const NFTUseCaseFactory = {
  createMintNFTFromAsset(repositories: RepositoryContainer): MintNFTFromAssetUseCase {
    return new MintNFTFromAssetUseCase(repositories.nft, repositories.ipfs, repositories.api, repositories.wallet)
  },
  createGetUserNFTs(repositories: RepositoryContainer): GetUserNFTsUseCase {
    return new GetUserNFTsUseCase(repositories.nft)
  },
  createEnrichNFTMetadata(repositories: RepositoryContainer): EnrichNFTMetadataUseCase {
    return new EnrichNFTMetadataUseCase(repositories.ipfs)
  }
}

/**
 * Factory for inventory management use cases (export, inventory viewing).
 */
export const InventoryUseCaseFactory = {
  createExportNFT(repositories: RepositoryContainer): ExportNFTUseCase {
    return new ExportNFTUseCase(repositories.nft, repositories.exportManager, repositories.wallet)
  },
  createGetUserInventory(repositories: RepositoryContainer): GetUserInventoryUseCase {
    return new GetUserInventoryUseCase(
      repositories.nft,
      repositories.marketplace,
      repositories.exportManager,
      repositories.ipfs
    )
  },
  createSyncExportToGame(repositories: RepositoryContainer): SyncExportToGameUseCase {
    return new SyncExportToGameUseCase(repositories.api)
  }
}

/**
 * Factory for marketplace use cases (listing, buying, filtering, sorting).
 */
export const MarketplaceUseCaseFactory = {
  createListNFTWithApproval(repositories: RepositoryContainer): ListNFTWithApprovalUseCase {
    return new ListNFTWithApprovalUseCase(repositories.nft, repositories.marketplace)
  },
  createBuyNFT(repositories: RepositoryContainer): BuyNFTUseCase {
    return new BuyNFTUseCase(repositories.marketplace)
  },
  createCancelListing(repositories: RepositoryContainer): CancelListingUseCase {
    return new CancelListingUseCase(repositories.marketplace)
  },
  createGetListings(repositories: RepositoryContainer): GetMarketplaceListingsUseCase {
    return new GetMarketplaceListingsUseCase(repositories.marketplace, repositories.ipfs)
  },
  createGetListingDetails(repositories: RepositoryContainer): GetListingDetailsUseCase {
    return new GetListingDetailsUseCase(repositories.marketplace, repositories.nft)
  },
  createFilterMarketplaceListings(): FilterMarketplaceListingsUseCase {
    return new FilterMarketplaceListingsUseCase()
  },
  createSortMarketplaceListings(): SortMarketplaceListingsUseCase {
    return new SortMarketplaceListingsUseCase()
  },
  createExtractMarketplaceFilters(): ExtractMarketplaceFiltersUseCase {
    return new ExtractMarketplaceFiltersUseCase()
  }
}

/**
 * Factory for wallet connection use cases.
 */
export const WalletUseCaseFactory = {
  createConnect(repositories: RepositoryContainer): ConnectWalletUseCase {
    return new ConnectWalletUseCase(repositories.wallet)
  },
  createDisconnect(repositories: RepositoryContainer): DisconnectWalletUseCase {
    return new DisconnectWalletUseCase(repositories.wallet)
  }
}

/**
 * Factory for dashboard statistics use cases.
 */
export const DashboardUseCaseFactory = {
  createGetStats(repositories: RepositoryContainer): GetWalletStatsUseCase {
    return new GetWalletStatsUseCase(repositories.wallet, repositories.nft, repositories.marketplace)
  },
  createGetRecentTransactions(repositories: RepositoryContainer): GetRecentTransactionsUseCase {
    return new GetRecentTransactionsUseCase(repositories.transactionHistory)
  },
  createGetEthPrice(repositories: RepositoryContainer): GetEthPriceUseCase {
    return new GetEthPriceUseCase(repositories.price)
  }
}
