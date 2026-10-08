import type { IAPIRepository } from '@core/interfaces/api.repository.interface'
import type { IExportManagerRepository } from '@core/interfaces/export-manager.repository.interface'
import type { IIPFSRepository } from '@core/interfaces/ipfs.repository.interface'
import type { IMarketplaceRepository } from '@core/interfaces/marketplace.repository.interface'
import type { INFTRepository } from '@core/interfaces/nft.repository.interface'
import type { IPriceRepository } from '@core/interfaces/price.repository.interface'
import type { ITransactionHistoryRepository } from '@core/interfaces/transaction-history.repository.interface'
import type { IWalletRepository } from '@core/interfaces/wallet.repository.interface'

/**
 * Dependency injection container for all repository interfaces.
 *
 * Aggregates all repository dependencies into a single container that can be
 * passed to use cases and services. This pattern supports testability by
 * allowing mock implementations to be injected.
 *
 * @example
 * ```typescript
 * const repositories: RepositoryContainer = {
 *   nft: new NFTRepository(),
 *   marketplace: new MarketplaceRepository(),
 *   // ... other repositories
 * };
 *
 * const useCase = new MintNFTUseCase(repositories);
 * ```
 */
export interface RepositoryContainer {
  /** Repository for NFT smart contract operations */
  readonly nft: INFTRepository
  /** Repository for marketplace listing operations */
  readonly marketplace: IMarketplaceRepository
  /** Repository for cross-chain export operations */
  readonly exportManager: IExportManagerRepository
  /** Repository for wallet connection and management */
  readonly wallet: IWalletRepository
  /** Repository for transaction history queries */
  readonly transactionHistory: ITransactionHistoryRepository
  /** Repository for IPFS storage operations */
  readonly ipfs: IIPFSRepository
  /** Repository for game API interactions */
  readonly api: IAPIRepository
  /** Repository for cryptocurrency price data */
  readonly price: IPriceRepository
}
