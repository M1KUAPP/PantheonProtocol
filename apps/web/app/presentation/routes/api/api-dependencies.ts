import type { AppConfig } from '@config/app-config.js'
import type { IAssetChainReader } from '@core/interfaces/asset-chain-reader.interface'
import type { IDatabaseRepository } from '@core/interfaces/database.repository.interface'

/**
 * Everything the API routes reach outside the process, injected so tests can swap in fakes.
 */
export interface ApiDependencies {
  readonly appConfig: AppConfig
  /** Returns the game-asset database; throws ConfigurationError when Supabase isn't configured. */
  readonly getDatabase: () => IDatabaseRepository
  /** Signs a short-lived Pinata upload URL; throws ConfigurationError when PINATA_JWT isn't set. */
  readonly createUploadUrl: () => Promise<string>
  /** Token ownership and export records, to check that a signer may change an item. */
  readonly chain: IAssetChainReader
  /** The current time in milliseconds; injectable so tests can pin it. */
  readonly now?: () => number
}
