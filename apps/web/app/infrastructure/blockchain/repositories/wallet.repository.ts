import { Wallet } from '@core/entities/wallet.entity'
import { UserRejectedError, WalletError } from '@core/errors/domain-error'
import { isUserRejectedError } from '@core/errors/error-helpers'
import type { IWalletRepository } from '@core/interfaces/wallet.repository.interface'
import type { Address } from '@core/value-objects/address.vo'
import { Address as AddressClass } from '@core/value-objects/address.vo'
import { WeiAmount } from '@core/value-objects/wei-amount.vo'
import type { Config } from '@wagmi/core'
import { connect, disconnect, getAccount, getBalance, signMessage, switchChain } from '@wagmi/core'

/**
 * Implementation of IWalletRepository using wagmi for Web3 wallet interactions.
 *
 * Manages wallet connections (MetaMask, etc.), account state, balance queries,
 * and chain switching operations through the wagmi library.
 */
export class WalletRepository implements IWalletRepository {
  private readonly config: Config
  private readonly chainId: number
  constructor(config: Config, chainId: number) {
    this.config = config
    this.chainId = chainId
  }
  async getCurrent(): Promise<Wallet> {
    try {
      const account = getAccount(this.config)
      if (!account.isConnected || !account.address) {
        throw new WalletError('No wallet connected')
      }
      const balance = await this.getBalance(this.createAddress(account.address))
      const wallet = Wallet.createConnected({
        address: AddressClass.create(account.address),
        chainId: account.chainId || this.chainId,
        balance
      })
      return wallet
    } catch (error) {
      throw new WalletError(error instanceof Error ? error.message : 'Failed to get current wallet')
    }
  }
  async connect(): Promise<Wallet> {
    try {
      const connectors = this.config.connectors
      if (!connectors || connectors.length === 0) {
        throw new WalletError('No wallet connectors available')
      }
      const connector = connectors[0]
      await connect(this.config, {
        connector,
        chainId: this.chainId
      })
      return await this.getCurrent()
    } catch (error) {
      throw new WalletError(error instanceof Error ? error.message : 'Failed to connect wallet')
    }
  }
  async disconnect(): Promise<void> {
    try {
      await disconnect(this.config)
    } catch (error) {
      throw new WalletError(error instanceof Error ? error.message : 'Failed to disconnect wallet')
    }
  }
  async getBalance(address: Address): Promise<WeiAmount> {
    try {
      const balance = await getBalance(this.config, {
        address: address.value as `0x${string}`
      })
      return WeiAmount.create(balance.value)
    } catch (error) {
      throw new WalletError(error instanceof Error ? error.message : 'Failed to get balance')
    }
  }
  async getChainId(): Promise<number> {
    try {
      const account = getAccount(this.config)
      if (!account.chainId) {
        throw new WalletError('No chain ID available')
      }
      return account.chainId
    } catch (error) {
      throw new WalletError(error instanceof Error ? error.message : 'Failed to get chain ID')
    }
  }
  async switchChain(chainId: number): Promise<void> {
    try {
      await switchChain(this.config, { chainId })
    } catch (error) {
      throw new WalletError(error instanceof Error ? error.message : 'Failed to switch chain')
    }
  }
  async isConnected(): Promise<boolean> {
    try {
      const account = getAccount(this.config)
      return account.isConnected
    } catch {
      return false
    }
  }
  async getAddress(): Promise<Address | null> {
    try {
      const account = getAccount(this.config)
      if (!account.address) {
        return null
      }
      return this.createAddress(account.address)
    } catch (error) {
      throw new WalletError(error instanceof Error ? error.message : 'Failed to get address')
    }
  }
  async signMessage(message: string): Promise<`0x${string}`> {
    try {
      return await signMessage(this.config, { message })
    } catch (error) {
      if (isUserRejectedError(error)) {
        throw new UserRejectedError('Signature request cancelled by user')
      }
      throw new WalletError(error instanceof Error ? error.message : 'Failed to sign message')
    }
  }
  private createAddress(value: string): Address {
    return AddressClass.create(value)
  }
}
