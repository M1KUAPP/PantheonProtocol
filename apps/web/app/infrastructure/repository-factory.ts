import type { AppConfig } from '@config/app-config'
import { ContractName } from '@config/app-config'
import { ConfigurationError } from '@core/errors/domain-error'
import type { RepositoryContainer } from '@core/interfaces/repository-container.interface'
import { getHttpClient } from '@infrastructure/api/http-client'
import { APIRepository } from '@infrastructure/api/repositories/api.repository'
import { CoinbasePriceRepository } from '@infrastructure/api/repositories/coinbase-price.repository'
import { ExportManagerContractRepository } from '@infrastructure/blockchain/repositories/export-manager-contract.repository'
import { MarketplaceContractRepository } from '@infrastructure/blockchain/repositories/marketplace-contract.repository'
import { NFTContractRepository } from '@infrastructure/blockchain/repositories/nft-contract.repository'
import { TransactionHistoryBlockchainRepository } from '@infrastructure/blockchain/repositories/transaction-history-blockchain.repository'
import { WalletRepository } from '@infrastructure/blockchain/repositories/wallet.repository'
import { PinataIPFSRepository } from '@infrastructure/ipfs/repositories/pinata-ipfs.repository'
import type { Config } from '@wagmi/core'

/**
 * Configuration required for creating the repository container.
 */
interface RepositoryFactoryConfig {
  readonly appConfig: AppConfig
  readonly wagmiConfig: Config
}

/**
 * Factory function that creates and wires all repository implementations.
 *
 * Instantiates concrete repository implementations for each domain interface,
 * configuring them with contract addresses, API keys, and blockchain settings.
 * This is the composition root for the infrastructure layer.
 *
 * @param config - Factory configuration with app settings and wagmi config
 * @returns A RepositoryContainer with all repository instances
 * @throws ConfigurationError if required configuration (e.g., the Pinata gateway) is missing
 */
export function createRepositories(config: RepositoryFactoryConfig): RepositoryContainer {
  const { appConfig, wagmiConfig } = config
  const nftContractAddress = appConfig.getContractAddress(ContractName.ASSET_NFT) as `0x${string}`
  const marketplaceContractAddress = appConfig.getContractAddress(ContractName.MARKETPLACE) as `0x${string}`
  const exportManagerContractAddress = appConfig.getContractAddress(ContractName.EXPORT_MANAGER) as `0x${string}`
  const chainId = appConfig.getNetwork().id
  const nft = new NFTContractRepository(nftContractAddress, wagmiConfig)
  const marketplace = new MarketplaceContractRepository(marketplaceContractAddress, wagmiConfig)
  const exportManager = new ExportManagerContractRepository(exportManagerContractAddress, wagmiConfig)
  const wallet = new WalletRepository(wagmiConfig, chainId)
  const pinataGateway = appConfig.getPinataGateway()
  if (!pinataGateway) {
    throw new ConfigurationError('Pinata Gateway is required for IPFS repository')
  }
  const ipfs = new PinataIPFSRepository({
    gateway: pinataGateway,
    getUploadUrl: async () => {
      const response = await getHttpClient().createIpfsUploadUrl()
      if (!response.url) {
        throw new ConfigurationError(response.message || 'The API returned no Pinata upload URL')
      }
      return response.url
    }
  })
  const transactionHistory = new TransactionHistoryBlockchainRepository(wagmiConfig)
  const api = new APIRepository()
  return {
    nft,
    marketplace,
    exportManager,
    wallet,
    transactionHistory,
    ipfs,
    api,
    price: new CoinbasePriceRepository()
  }
}
