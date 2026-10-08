import type { AppConfig } from '@config/app-config'
import type { Chain } from 'viem'
import { defineChain } from 'viem'
import type { Config } from 'wagmi'
import { createConfig, http } from 'wagmi'
import { metaMask } from 'wagmi/connectors'

/**
 * Creates a wagmi configuration for Web3 interactions.
 *
 * Configures the wagmi client with the chain settings from AppConfig
 * and sets up MetaMask as the wallet connector.
 *
 * @param appConfig - Application configuration containing network settings
 * @returns A wagmi Config instance ready for blockchain interactions
 */
export function createWagmiConfig(appConfig: AppConfig): Config {
  const chain = createChainFromAppConfig(appConfig)
  return createConfig({
    chains: [chain],
    connectors: [metaMask()],
    transports: {
      [chain.id]: http(appConfig.getNetwork().rpcUrl)
    }
  })
}

/**
 * Creates a viem Chain definition from application configuration.
 *
 * Transforms the network settings from AppConfig into a viem-compatible
 * chain object with RPC URLs, block explorers, and native currency info.
 *
 * @param appConfig - Application configuration containing network settings
 * @returns A viem Chain object
 */
function createChainFromAppConfig(appConfig: AppConfig): Chain {
  const network = appConfig.getNetwork()
  return defineChain({
    id: network.id,
    name: network.name,
    nativeCurrency: network.nativeCurrency,
    rpcUrls: {
      default: { http: [network.rpcUrl] }
    },
    blockExplorers: network.blockExplorer
      ? {
          default: {
            name: 'Explorer',
            url: network.blockExplorer
          }
        }
      : undefined
  })
}
