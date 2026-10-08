/**
 * Application-wide dependency injection provider.
 *
 * Provides React context for accessing use cases and services throughout
 * the application using the dependency injection container.
 * @module
 */

import type { DIContainer } from '@application/interfaces/di-container.interface'
import type { AppConfig } from '@config/app-config'
import { ConfigurationError } from '@core/errors/domain-error'
import { ToastNotificationService } from '@presentation/services/toast-notification.service'
import { getDIContainer } from '@shared/di/container-factory'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { Config } from '@wagmi/core'

/** React context for the dependency injection container. */
const DIContext = createContext<DIContainer | null>(null)

/** Props for the AppProvider component. */
interface AppProviderProps {
  readonly children: ReactNode
  readonly appConfig: AppConfig
  readonly wagmiConfig: Config
  readonly container?: DIContainer
}

/**
 * Root provider that initializes and provides the DI container.
 *
 * Creates or uses a provided DI container with all use cases and services,
 * making them available to child components via React context.
 */
export function AppProvider({ children, appConfig, wagmiConfig, container }: AppProviderProps) {
  const diContainer = useMemo(() => {
    if (container) {
      return container
    }
    const services = {
      notification: new ToastNotificationService()
    }
    return getDIContainer({ appConfig, wagmiConfig }, services)
  }, [container, appConfig, wagmiConfig])
  return <DIContext.Provider value={diContainer}>{children}</DIContext.Provider>
}

/**
 * Internal hook to access the DI container.
 * @throws ConfigurationError if used outside AppProvider.
 * @returns The DI container instance.
 */
function useDIContainer(): DIContainer {
  const context = useContext(DIContext)
  if (!context) {
    throw new ConfigurationError('useDIContainer must be used within AppProvider')
  }
  return context
}

/**
 * Hook to access all use cases from the DI container.
 * @returns All available use case groups.
 */
export function useUseCases() {
  const { useCases } = useDIContainer()
  return useCases
}

/**
 * Hook to access all services from the DI container.
 * @returns All available service instances.
 */
export function useServices() {
  const { services } = useDIContainer()
  return services
}

/**
 * Hook to access NFT-related use cases.
 * @returns NFT use cases for minting, querying, and metadata.
 */
export function useNFTUseCases() {
  const { useCases } = useDIContainer()
  return useCases.nft
}

/**
 * Hook to access marketplace-related use cases.
 * @returns Marketplace use cases for listing, buying, and filtering.
 */
export function useMarketplaceUseCases() {
  const { useCases } = useDIContainer()
  return useCases.marketplace
}

/**
 * Hook to access wallet-related use cases.
 * @returns Wallet use cases for connect and disconnect operations.
 */
export function useWalletUseCases() {
  const { useCases } = useDIContainer()
  return useCases.wallet
}

/**
 * Hook to access dashboard-related use cases.
 * @returns Dashboard use cases for stats, transactions, and pricing.
 */
export function useDashboardUseCases() {
  const { useCases } = useDIContainer()
  return useCases.dashboard
}
