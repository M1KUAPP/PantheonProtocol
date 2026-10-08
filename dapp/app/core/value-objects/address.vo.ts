import { StringPatternValueObject } from '@core/value-objects/base/string-pattern.vo'

/**
 * Value object representing an Ethereum blockchain address.
 *
 * Validates that the address follows the standard Ethereum format:
 * a 42-character hexadecimal string starting with '0x'.
 * Equality comparison is case-insensitive as per Ethereum standards.
 *
 * @example
 * ```typescript
 * const address = Address.create('0x742d35Cc6634C0532925a3b844Bc9e7595f1934F');
 * console.log(address.toLowerCase()); // '0x742d35cc6634c0532925a3b844bc9e7595f1934f'
 * ```
 */
export class Address extends StringPatternValueObject<`0x${string}`> {
  /** Regex pattern for validating Ethereum addresses (40 hex characters prefixed with 0x) */
  private static readonly PATTERN = /^0x[a-fA-F0-9]{40}$/

  /**
   * Creates a new Address instance.
   * @param value - The validated Ethereum address string
   */
  private constructor(value: `0x${string}`) {
    super(value)
  }

  /**
   * Factory method to create a validated Address instance.
   * @param value - The Ethereum address string to validate and wrap
   * @returns A new Address instance
   * @throws Error if the address format is invalid
   */
  static create(value: string): Address {
    if (!Address.isValid(value)) {
      throw new Error(`Invalid Ethereum address format: ${value}`)
    }
    return new Address(value as `0x${string}`)
  }

  /**
   * Validates whether a string is a valid Ethereum address format.
   * @param value - The string to validate
   * @returns True if the string is a valid Ethereum address format
   */
  static isValid(value: string): boolean {
    return StringPatternValueObject.isValidPattern(value, Address.PATTERN)
  }

  /**
   * Compares two addresses for equality (case-insensitive).
   * @param other - The address to compare against
   * @returns True if the addresses represent the same Ethereum address
   */
  equals(other: Address): boolean {
    return this._value.toLowerCase() === other._value.toLowerCase()
  }

  /**
   * Returns the address in lowercase format.
   * Useful for consistent address comparison and storage.
   * @returns The address string in lowercase
   */
  toLowerCase(): string {
    return this._value.toLowerCase()
  }
}
