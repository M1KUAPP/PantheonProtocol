/**
 * Application configuration module.
 *
 * Provides centralized configuration management for contract addresses,
 * network settings, API endpoints, and external service credentials.
 * @module
 */

import { ConfigurationError } from '@core/errors/domain-error'

/** Ethereum address type with 0x prefix. */
type ContractAddress = `0x${string}`

/** Enum of deployed smart contract names. */
export enum ContractName {
  ASSET_NFT = 'AssetNFT',
  MARKETPLACE = 'Marketplace',
  EXPORT_MANAGER = 'ExportManager'
}

/** Network configuration options for blockchain connection. */
interface NetworkOptions {
  readonly id: number
  readonly name: string
  readonly nativeCurrency: {
    readonly name: string
    readonly symbol: string
    readonly decimals: number
  }
  readonly rpcUrl: string
  readonly blockExplorer?: string
}

/** Configuration options for initializing AppConfig. */
interface AppConfigOptions {
  readonly assetNFTAddress: ContractAddress
  readonly marketplaceAddress: ContractAddress
  readonly exportManagerAddress: ContractAddress
  readonly network: NetworkOptions
  readonly pinataJWT?: string
  readonly pinataGateway?: string
  readonly apiBaseUrl?: string
  readonly supabaseUrl?: string
  readonly supabaseServiceRoleKey?: string
  readonly sourceTable?: string
  readonly targetTable?: string
  readonly port?: number
  readonly frontendUrl?: string
}

/**
 * Central configuration class for the application.
 * Manages contract addresses, network settings, API endpoints, and service credentials.
 * Uses factory methods for instantiation based on environment context.
 */
export class AppConfig {
  private readonly assetNFTAddress: ContractAddress
  private readonly marketplaceAddress: ContractAddress
  private readonly exportManagerAddress: ContractAddress
  private readonly network: NetworkOptions
  private readonly pinataJWT?: string
  private readonly pinataGateway?: string
  private readonly apiBaseUrl?: string
  private readonly supabaseUrl?: string
  private readonly supabaseAnonKey?: string
  private readonly databaseTables: {
    readonly SOURCE_TABLE: string | undefined
    readonly TARGET_TABLE: string | undefined
  }
  private readonly port?: number
  private readonly frontendUrl?: string
  private readonly httpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  } as const
  private readonly apiEndpoints = {
    GET_RECORD: '/api/assets/get',
    EXPORT_RECORD: '/api/assets/export',
    REMOVE_RECORD: '/api/assets/remove'
  } as const
  private readonly avatarConfig = {
    BASE_URL: 'https://api.dicebear.com/8.x/identicon/svg'
  } as const
  private constructor(options: AppConfigOptions) {
    this.assetNFTAddress = options.assetNFTAddress
    this.marketplaceAddress = options.marketplaceAddress
    this.exportManagerAddress = options.exportManagerAddress
    this.network = options.network
    this.pinataJWT = options.pinataJWT
    this.pinataGateway = options.pinataGateway
    this.apiBaseUrl = options.apiBaseUrl
    this.supabaseUrl = options.supabaseUrl
    this.supabaseAnonKey = options.supabaseServiceRoleKey
    this.port = options.port
    this.frontendUrl = options.frontendUrl
    this.databaseTables = {
      SOURCE_TABLE: options.sourceTable,
      TARGET_TABLE: options.targetTable
    }
    this.validate()
  }
  private static buildConfigOptions(env: Record<string, string | undefined>): AppConfigOptions {
    const rpcUrl = env.VITE_RPC_URL
    if (!rpcUrl) {
      throw new ConfigurationError('VITE_RPC_URL environment variable is required')
    }
    return {
      assetNFTAddress: env.VITE_ASSET_NFT_ADDRESS as ContractAddress,
      marketplaceAddress: env.VITE_MARKETPLACE_ADDRESS as ContractAddress,
      exportManagerAddress: env.VITE_EXPORT_MANAGER_ADDRESS as ContractAddress,
      network: {
        id: 31337,
        name: 'Pantheon Protocol',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrl
      },
      pinataJWT: env.VITE_PINATA_JWT,
      pinataGateway: env.VITE_PINATA_GATEWAY,
      apiBaseUrl: env.VITE_API_BASE_URL,
      supabaseUrl: env.VITE_SUPABASE_URL,
      supabaseServiceRoleKey: env.VITE_SUPABASE_SERVICE_ROLE_KEY,
      port: env.SERVER_PORT ? parseInt(env.SERVER_PORT, 10) : undefined,
      frontendUrl: env.FRONTEND_URL,
      sourceTable: env.VITE_SUPABASE_SOURCE_TABLE,
      targetTable: env.VITE_SUPABASE_TARGET_TABLE
    }
  }
  static fromImportMeta(): AppConfig {
    return new AppConfig(this.buildConfigOptions(import.meta.env as Record<string, string | undefined>))
  }
  static fromProcessEnv(): AppConfig {
    return new AppConfig(this.buildConfigOptions(process.env))
  }
  static fromEnvironment(): AppConfig {
    const isNodeEnvironment = typeof process !== 'undefined' && process.versions?.node
    return isNodeEnvironment ? AppConfig.fromProcessEnv() : AppConfig.fromImportMeta()
  }
  static create(options: AppConfigOptions): AppConfig {
    return new AppConfig(options)
  }
  getContractAddress(contractName: ContractName): ContractAddress {
    switch (contractName) {
      case ContractName.ASSET_NFT:
        return this.assetNFTAddress
      case ContractName.MARKETPLACE:
        return this.marketplaceAddress
      case ContractName.EXPORT_MANAGER:
        return this.exportManagerAddress
      default:
        throw new ConfigurationError(`Unknown contract: ${contractName}`)
    }
  }
  getAllContractAddresses(): {
    [ContractName.ASSET_NFT]: ContractAddress
    [ContractName.MARKETPLACE]: ContractAddress
    [ContractName.EXPORT_MANAGER]: ContractAddress
  } {
    return {
      [ContractName.ASSET_NFT]: this.assetNFTAddress,
      [ContractName.MARKETPLACE]: this.marketplaceAddress,
      [ContractName.EXPORT_MANAGER]: this.exportManagerAddress
    }
  }
  getNetwork(): NetworkOptions {
    return this.network
  }
  getPinataJWT(): string | undefined {
    return this.pinataJWT
  }
  getPinataGateway(): string | undefined {
    return this.pinataGateway
  }
  hasPinataJWT(): boolean {
    return !!this.pinataJWT && this.pinataJWT.trim() !== ''
  }
  getApiBaseUrl(): string | undefined {
    return this.apiBaseUrl
  }
  getApiEndpointUrl(endpoint: string): string {
    if (!this.apiBaseUrl) {
      throw new ConfigurationError('API_BASE_URL is not configured')
    }
    return `${this.apiBaseUrl}${endpoint}`
  }
  getHttpStatus() {
    return this.httpStatus
  }
  getApiEndpoints() {
    return this.apiEndpoints
  }
  getSupabaseUrl(): string | undefined {
    return this.supabaseUrl
  }
  getSupabaseAnonKey(): string | undefined {
    return this.supabaseAnonKey
  }
  getDatabaseTables() {
    return this.databaseTables
  }
  getPort(): number | undefined {
    return this.port
  }
  getFrontendUrl(): string | undefined {
    return this.frontendUrl
  }
  getAvatarUrl(seed: string): string {
    return `${this.avatarConfig.BASE_URL}?seed=${seed}`
  }
  private validate(): void {
    const errors = this.getValidationErrors()
    if (errors.length > 0) {
      throw new ConfigurationError(`Configuration validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`)
    }
  }
  private getValidationErrors(): string[] {
    const errors: string[] = []
    const contractAddresses = [
      { value: this.assetNFTAddress, name: 'ASSET_NFT_ADDRESS' },
      { value: this.marketplaceAddress, name: 'MARKETPLACE_ADDRESS' },
      { value: this.exportManagerAddress, name: 'EXPORT_MANAGER_ADDRESS' }
    ]
    for (const { value, name } of contractAddresses) {
      if (!value) {
        errors.push(`${name} is required but not provided`)
      } else {
        const addressError = this.validateAddress(value, name)
        if (addressError) errors.push(addressError)
      }
    }
    const chainIdError = this.validateChainId(this.network.id, 'Chain ID')
    if (chainIdError) errors.push(chainIdError)
    if (!this.network.name || this.network.name.trim() === '') {
      errors.push('Network name is required')
    }
    const rpcError = this.validateUrl(this.network.rpcUrl, 'RPC URL')
    if (rpcError) errors.push(rpcError)
    if (!this.network.nativeCurrency.name) {
      errors.push('Native currency name is required')
    }
    if (!this.network.nativeCurrency.symbol) {
      errors.push('Native currency symbol is required')
    }
    if (this.network.nativeCurrency.decimals !== 18) {
      errors.push('Native currency decimals must be 18')
    }
    if (this.network.blockExplorer) {
      const explorerError = this.validateUrl(this.network.blockExplorer, 'Block Explorer URL')
      if (explorerError) errors.push(explorerError)
    }
    if (this.pinataJWT !== undefined && this.pinataJWT.trim() === '') {
      errors.push('PINATA_JWT cannot be an empty string (omit it if not using Pinata)')
    }
    if (this.apiBaseUrl) {
      const apiUrlError = this.validateUrl(this.apiBaseUrl, 'API_BASE_URL')
      if (apiUrlError) errors.push(apiUrlError)
    }
    return errors
  }
  private validateAddress(address: string, name: string): string | null {
    if (!address) {
      return `${name} is required`
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return `${name} must be a valid Ethereum address (0x + 40 hex characters)`
    }
    return null
  }
  private validateUrl(url: string, name: string): string | null {
    if (!url) {
      return `${name} is required`
    }
    try {
      new URL(url)
      return null
    } catch {
      return `${name} must be a valid URL`
    }
  }
  private validateChainId(chainId: number, name: string): string | null {
    if (!Number.isInteger(chainId) || chainId <= 0) {
      return `${name} must be a positive integer`
    }
    return null
  }
}

/**
 * Factory function to create AppConfig from current environment.
 * Automatically detects Node.js vs browser environment.
 */
export function createAppConfig(): AppConfig {
  return AppConfig.fromEnvironment()
}

export default AppConfig
