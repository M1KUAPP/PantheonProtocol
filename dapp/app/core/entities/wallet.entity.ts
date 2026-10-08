import { Address } from '@core/value-objects/address.vo'
import { WeiAmount } from '@core/value-objects/wei-amount.vo'

/**
 * Enumeration of possible wallet connection states.
 */
enum WalletConnectionStatus {
  /** Wallet is not connected */
  Disconnected = 'disconnected',
  /** Connection is in progress */
  Connecting = 'connecting',
  /** Wallet is successfully connected */
  Connected = 'connected',
  /** Connection failed with an error */
  Error = 'error'
}

/**
 * Domain entity representing a user's cryptocurrency wallet.
 *
 * Manages the state of a wallet connection including address, balance, chain ID,
 * and connection status. This entity follows immutable patterns with state changes
 * returning new instances.
 *
 * @example
 * ```typescript
 * // Create a connected wallet
 * const wallet = Wallet.createConnected({
 *   address: Address.create('0x742d35Cc6634C0532925a3b844Bc9e7595f1934F'),
 *   balance: WeiAmount.create(1000000000000000000n),
 *   chainId: 1
 * });
 *
 * if (wallet.hasSufficientBalance(requiredAmount)) {
 *   // Proceed with transaction
 * }
 * ```
 */
export class Wallet {
  /** The wallet's Ethereum address (present when connected) */
  private readonly _address?: Address
  /** The wallet's balance in Wei (present when connected) */
  private readonly _balance?: WeiAmount
  /** The blockchain network chain ID (present when connected) */
  private readonly _chainId?: number
  /** Current connection status */
  private readonly _status: WalletConnectionStatus
  /** Error message if connection failed */
  private readonly _error?: string

  /**
   * Creates a new Wallet instance.
   * @param status - The connection status
   * @param address - Optional wallet address
   * @param balance - Optional wallet balance
   * @param chainId - Optional chain ID
   * @param error - Optional error message
   */
  private constructor(
    status: WalletConnectionStatus,
    address?: Address,
    balance?: WeiAmount,
    chainId?: number,
    error?: string
  ) {
    this._status = status
    this._address = address
    this._balance = balance
    this._chainId = chainId
    this._error = error
  }

  /**
   * Creates a wallet in disconnected state.
   * @returns A new disconnected Wallet instance
   */
  static createDisconnected(): Wallet {
    return new Wallet(WalletConnectionStatus.Disconnected)
  }

  /**
   * Creates a wallet in connecting state.
   * @returns A new connecting Wallet instance
   */
  static createConnecting(): Wallet {
    return new Wallet(WalletConnectionStatus.Connecting)
  }

  /**
   * Creates a wallet in connected state with full details.
   * @param params - Connection parameters including address, balance, and chain ID
   * @returns A new connected Wallet instance
   */
  static createConnected(params: { address: Address; balance: WeiAmount; chainId: number }): Wallet {
    return new Wallet(WalletConnectionStatus.Connected, params.address, params.balance, params.chainId)
  }

  /**
   * Creates a wallet in error state.
   * @param error - The error message describing what went wrong
   * @returns A new error Wallet instance
   */
  static createError(error: string): Wallet {
    return new Wallet(WalletConnectionStatus.Error, undefined, undefined, undefined, error)
  }

  /**
   * Factory method to create a Wallet from primitive values.
   * Useful for state rehydration.
   * @param params - Wallet parameters with primitive types
   * @returns A new Wallet instance
   */
  static fromPrimitives(params: {
    status: WalletConnectionStatus
    address?: string
    balance?: bigint | string
    chainId?: number
    error?: string
  }): Wallet {
    let address: Address | undefined
    let balance: WeiAmount | undefined
    if (params.address) {
      address = Address.create(params.address)
    }
    if (params.balance !== undefined) {
      balance =
        typeof params.balance === 'string' ? WeiAmount.fromString(params.balance) : WeiAmount.create(params.balance)
    }
    return new Wallet(params.status, address, balance, params.chainId, params.error)
  }

  /** Gets the wallet address if connected */
  get address(): Address | undefined {
    return this._address
  }

  /** Gets the wallet balance if connected */
  get balance(): WeiAmount | undefined {
    return this._balance
  }

  /** Gets the current chain ID if connected */
  get chainId(): number | undefined {
    return this._chainId
  }

  /** Gets the current connection status */
  get status(): WalletConnectionStatus {
    return this._status
  }

  /** Gets the error message if in error state */
  get error(): string | undefined {
    return this._error
  }

  /**
   * Checks if the wallet is fully connected with an address.
   * @returns True if connected and has an address
   */
  isConnected(): boolean {
    return this._status === WalletConnectionStatus.Connected && this._address !== undefined
  }

  /**
   * Checks if the wallet is in disconnected state.
   * @returns True if disconnected
   */
  isDisconnected(): boolean {
    return this._status === WalletConnectionStatus.Disconnected
  }

  /**
   * Checks if the wallet is currently connecting.
   * @returns True if connection is in progress
   */
  isConnecting(): boolean {
    return this._status === WalletConnectionStatus.Connecting
  }

  /**
   * Checks if the wallet is in error state.
   * @returns True if there was a connection error
   */
  hasError(): boolean {
    return this._status === WalletConnectionStatus.Error
  }

  /**
   * Checks if the wallet has a specific address.
   * @param address - The address to check
   * @returns True if the wallet has the given address
   */
  hasAddress(address: Address): boolean {
    return this._address !== undefined && this._address.equals(address)
  }

  /**
   * Checks if the wallet has enough balance for a transaction.
   * @param requiredAmount - The amount needed in Wei
   * @returns True if balance is greater than or equal to required amount
   */
  hasSufficientBalance(requiredAmount: WeiAmount): boolean {
    if (!this._balance) {
      return false
    }
    return this._balance.isGreaterThan(requiredAmount) || this._balance.equals(requiredAmount)
  }

  /**
   * Checks if the wallet is connected to a specific chain.
   * @param chainId - The chain ID to check
   * @returns True if the wallet is on the specified chain
   */
  isOnChain(chainId: number): boolean {
    return this._chainId === chainId
  }

  /**
   * Creates a new Wallet with an updated balance.
   * @param newBalance - The new balance amount
   * @returns A new Wallet instance with updated balance
   * @throws Error if wallet is not connected
   */
  updateBalance(newBalance: WeiAmount): Wallet {
    if (!this.isConnected()) {
      throw new Error('Cannot update balance of a disconnected wallet')
    }
    return new Wallet(this._status, this._address, newBalance, this._chainId, this._error)
  }

  /**
   * Initiates a connection attempt.
   * @returns A new Wallet in connecting state, or self if already connected
   */
  connect(): Wallet {
    if (this.isConnected()) {
      return this
    }
    return new Wallet(WalletConnectionStatus.Connecting)
  }

  /**
   * Transitions to connected state with the provided details.
   * @param params - Connection parameters
   * @returns A new connected Wallet instance
   */
  connected(params: { address: Address; balance: WeiAmount; chainId: number }): Wallet {
    return Wallet.createConnected(params)
  }

  /**
   * Disconnects the wallet.
   * @returns A new Wallet in disconnected state
   */
  disconnect(): Wallet {
    return Wallet.createDisconnected()
  }

  /**
   * Sets an error state.
   * @param error - The error message
   * @returns A new Wallet in error state
   */
  setError(error: string): Wallet {
    return Wallet.createError(error)
  }

  /**
   * Gets the wallet address as a string.
   * @returns The address string
   * @throws Error if wallet is not connected
   */
  getAddressString(): string {
    if (!this._address) {
      throw new Error('Wallet is not connected')
    }
    return this._address.value
  }

  /**
   * Gets the balance converted to Ether.
   * @returns The balance in Ether
   * @throws Error if balance is not available
   */
  getBalanceInEther(): number {
    if (!this._balance) {
      throw new Error('Wallet balance not available')
    }
    return this._balance.toEther()
  }

  /**
   * Gets a formatted balance string in Ether.
   * @param decimals - Number of decimal places (defaults to 4)
   * @returns Formatted balance string, or '0.0000' if not connected
   */
  getFormattedBalance(decimals: number = 4): string {
    if (!this._balance) {
      return '0.0000'
    }
    return this._balance.toEtherString(decimals)
  }

  /**
   * Converts the entity to a plain object with primitive values.
   * Useful for serialization and storage.
   * @returns Plain object representation
   */
  toPrimitives(): {
    status: WalletConnectionStatus
    address?: string
    balance?: string
    chainId?: number
    error?: string
  } {
    return {
      status: this._status,
      address: this._address?.value,
      balance: this._balance?.toString(),
      chainId: this._chainId,
      error: this._error
    }
  }

  /**
   * Compares two wallets for equality based on address.
   * @param other - The wallet to compare against
   * @returns True if both wallets have the same address
   */
  equals(other: Wallet): boolean {
    if (this._address === undefined || other._address === undefined) {
      return false
    }
    return this._address.equals(other._address)
  }
}
