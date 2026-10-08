import { NumericIdValueObject } from '@core/value-objects/base/numeric-id.vo'

/**
 * Value object representing an ERC-721 NFT token identifier.
 *
 * Token IDs are unique identifiers assigned to NFTs by the smart contract.
 * Each token ID represents a specific NFT within the collection.
 *
 * @example
 * ```typescript
 * const tokenId = TokenId.create(1);
 * const bigIntId = tokenId.toBigInt(); // For smart contract calls
 * ```
 */
export class TokenId extends NumericIdValueObject {
  /**
   * Creates a new TokenId instance.
   * @param value - The numeric token identifier
   */
  private constructor(value: number) {
    super(value)
  }

  /**
   * Factory method to create a validated TokenId instance.
   * @param value - The numeric identifier for the NFT token
   * @returns A new TokenId instance
   * @throws Error if the value is not a non-negative integer
   */
  static create(value: number): TokenId {
    if (!TokenId.isValid(value)) {
      throw new Error(`Invalid token ID: ${value}. Must be a non-negative integer.`)
    }
    return new TokenId(value)
  }

  /**
   * Validates whether a number is a valid token identifier.
   * @param value - The number to validate
   * @returns True if the value is a non-negative integer
   */
  static isValid(value: number): boolean {
    return NumericIdValueObject.isValidNumericId(value)
  }
}
