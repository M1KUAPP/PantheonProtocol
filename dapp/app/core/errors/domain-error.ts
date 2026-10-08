/**
 * Abstract base class for all domain-specific errors.
 *
 * Provides a foundation for creating typed error hierarchies with proper
 * stack trace capture and automatic error naming based on the constructor.
 */
abstract class DomainError extends Error {
  /**
   * Creates a new DomainError instance.
   * @param message - The error message describing what went wrong
   */
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * Error thrown for general blockchain-related failures.
 *
 * Use this for errors related to blockchain interactions that don't fit
 * into more specific categories like contract or wallet errors.
 */
export class BlockchainError extends DomainError {
  /**
   * Creates a new BlockchainError instance.
   * @param message - Description of the blockchain error
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown for smart contract interaction failures.
 *
 * Use this when a smart contract call fails, reverts, or returns unexpected results.
 */
export class ContractError extends BlockchainError {
  /**
   * Creates a new ContractError instance.
   * @param message - Description of the contract error
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown for wallet-related failures.
 *
 * Use this for errors during wallet connection, signing, or account operations.
 */
export class WalletError extends DomainError {
  /**
   * Creates a new WalletError instance.
   * @param message - Description of the wallet error
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown for IPFS-related failures.
 *
 * Use this when IPFS operations fail, such as uploading, pinning, or fetching content.
 */
export class IPFSError extends DomainError {
  /**
   * Creates a new IPFSError instance.
   * @param message - Description of the IPFS error
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown when a requested resource is not found.
 *
 * Use this for missing NFTs, listings, assets, or other domain entities.
 */
export class NotFoundError extends DomainError {
  /**
   * Creates a new NotFoundError instance.
   * @param message - Description of what was not found
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown for validation failures.
 *
 * Use this when input data fails validation rules or constraints.
 */
export class ValidationError extends DomainError {
  /**
   * Creates a new ValidationError instance.
   * @param message - Description of the validation failure
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown for unauthorized access attempts.
 *
 * Use this when a user tries to perform an action they don't have permission for.
 */
export class UnauthorizedError extends DomainError {
  /**
   * Creates a new UnauthorizedError instance.
   * @param message - Description of the authorization failure
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown for network-related failures.
 *
 * Use this for HTTP errors, connection timeouts, or API failures.
 */
export class NetworkError extends DomainError {
  /**
   * Creates a new NetworkError instance.
   * @param message - Description of the network error
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown for configuration-related issues.
 *
 * Use this when required configuration is missing or invalid.
 */
export class ConfigurationError extends DomainError {
  /**
   * Creates a new ConfigurationError instance.
   * @param message - Description of the configuration error
   */
  constructor(message: string) {
    super(message)
  }
}

/**
 * Error thrown when a user explicitly rejects a transaction.
 *
 * This is a specific type of blockchain error that occurs when the user
 * cancels a transaction in their wallet (e.g., clicking "Reject" in MetaMask).
 */
export class UserRejectedError extends BlockchainError {
  /**
   * Creates a new UserRejectedError instance.
   * @param message - Description of the rejection (defaults to 'Transaction cancelled by user')
   */
  constructor(message: string = 'Transaction cancelled by user') {
    super(message)
  }
}
